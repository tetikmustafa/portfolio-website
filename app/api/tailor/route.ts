export const runtime = 'edge';

import { verifyTurnstile } from '@/lib/turnstile';
import { tailorLimiter, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import {
  MAX_LATEX_LENGTH,
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_CUSTOM_INSTRUCTIONS_LENGTH,
} from '@/lib/constants';
import { callWithFallbackChain, callSpecificProvider } from '@/lib/llm/registry';
import { LLMFatalError } from '@/lib/llm/types';

/** The JSON shape we expect from the LLM. */
interface TailorResponse {
  tailoredLatex: string;
  coverMail: string;
}

/** JSON Schema passed to providers that support structured output. */
const TAILOR_SCHEMA = {
  type: 'object' as const,
  properties: {
    tailoredLatex: { type: 'string', description: 'The complete tailored LaTeX CV' },
    coverMail: { type: 'string', description: 'Professional cover mail text' },
  },
  required: ['tailoredLatex', 'coverMail'],
};

const SYSTEM_PROMPT = `You are an expert IT Recruiter and LaTeX formatter.

Return ONLY a valid JSON object with EXACTLY two keys: 'tailoredLatex' and 'coverMail'.

Rule 1: Never break LaTeX syntax.

Rule 2: Exclude irrelevant blocks based on the Job Description.

Rule 3: You MUST double-escape all backslashes in your LaTeX output (e.g. write \\\\textbf instead of \\textbf, \\\\resumeItem instead of \\resumeItem) to ensure the JSON is valid.

Rule 4 (CRITICAL): You MUST escape any ampersand used in plain text or headings as \\\\& (e.g., "Cybersecurity \\\\& Analysis"). A bare "&" is strictly forbidden unless used as a table column separator.

Rule 5 (CRITICAL): NEVER alter the \\\\begin{tabularx} layout commands. Keep them EXACTLY as \\\\begin{tabularx}{\\\\textwidth\\\\vspace{-20pt}}{X X}. Do NOT add extra braces.

Rule 6 (CRITICAL): Do NOT add \\\\\\\\ before \\\\resumeItemListEnd or add extra line breaks inside itemize environments.

Rule 7 (CRITICAL): NEVER modify any code, package imports, or formatting settings above the "% RESUME STARTS HERE" line.

Rule 8 (CRITICAL): NEVER change any section titles (e.g., \\\\section{Experience}).

Rule 9 (CRITICAL): The ENTIRE "Languages \\\\& Affiliations" section is LOCKED. Do not modify, remove, or alter anything inside it.

DO NOT wrap the JSON in markdown blocks like \`\`\`json.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { masterLatex, jobDescription, customInstructions, turnstileToken } = body;

    // 1. Validation
    if (!turnstileToken || !(await verifyTurnstile(turnstileToken))) {
      return new Response(JSON.stringify({ error: 'Invalid security token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!masterLatex || !jobDescription) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (
      masterLatex.length > MAX_LATEX_LENGTH ||
      jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH ||
      (customInstructions && customInstructions.length > MAX_CUSTOM_INSTRUCTIONS_LENGTH)
    ) {
      return new Response(JSON.stringify({ error: 'Payload exceeds size limits' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimit = await checkRateLimit(tailorLimiter, ip);
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit.remaining);
    }

    // 3. Dev panel override (gated by DEV_PANEL_SECRET)
    const url = new URL(request.url);
    const devKey = url.searchParams.get('devKey');
    const devSecret = process.env.DEV_PANEL_SECRET;
    const isDevMode = devKey && devSecret && devKey === devSecret;

    // Only accept provider/model overrides from authenticated dev requests
    let devProvider: string | undefined;
    let devModel: string | undefined;
    if (isDevMode) {
      devProvider = body.devProvider;
      devModel = body.devModel;
    }

    // 4. Setup NDJSON stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: unknown) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
        };

        try {
          const userPrompt = `## Original LaTeX CV:\n${masterLatex}\n\n## Job Description:\n${jobDescription}\n\n${
            customInstructions ? `## Custom Instructions:\n${customInstructions}` : ''
          }`;

          const llmParams = {
            systemPrompt: SYSTEM_PROMPT,
            userPrompt,
            jsonSchema: TAILOR_SCHEMA,
          };

          let result;

          if (isDevMode && devProvider) {
            // Dev mode: call specific provider
            send({
              type: 'progress',
              message: `[DEV] Calling ${devProvider}${devModel ? ` (${devModel})` : ''}...`,
              step: 1,
              totalSteps: 2,
            });
            result = await callSpecificProvider<TailorResponse>(devProvider, devModel, llmParams);
          } else {
            // Public mode: use fallback chain
            result = await callWithFallbackChain<TailorResponse>(
              llmParams,
              (providerId, model, attemptIndex, totalProviders) => {
                const retryNote = attemptIndex > 0 ? ` (fallback ${attemptIndex}/${totalProviders - 1})` : '';
                send({
                  type: 'progress',
                  message: `Analyzing with ${providerId} (${model.split('/').pop() || model})${retryNote}...`,
                  step: 1,
                  totalSteps: 2,
                });
              },
            );
          }

          send({ type: 'progress', message: 'Parsing response...', step: 2, totalSteps: 2 });

          send({
            type: 'result',
            tailoredLatex: result.data.tailoredLatex,
            coverMail: result.data.coverMail,
            meta: {
              provider: result.providerId,
              model: result.model,
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          const statusCode = error instanceof LLMFatalError ? error.statusCode : 500;
          console.error(`[tailor] stream error (${statusCode}):`, message);
          send({ type: 'error', message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    console.error('[tailor] unhandled route error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
