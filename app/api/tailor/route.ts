
import { verifyTurnstile } from '@/lib/turnstile';
import { tailorLimiter, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import {
  MAX_LATEX_LENGTH,
  MAX_JOB_DESCRIPTION_LENGTH,
  MAX_CUSTOM_INSTRUCTIONS_LENGTH,
} from '@/lib/constants';
import { callWithFallbackChain, callSpecificProvider } from '@/lib/llm/registry';
import { LLMFatalError } from '@/lib/llm/types';
import { TAILOR_SYSTEM_PROMPT } from '@/lib/tailor/systemPrompt';
import { PAGE_LINE_CAPACITY, SLACK_THRESHOLD, OVERFLOW_BUFFER } from '@/lib/tailor/constants';
import { compileLatexToPdf } from '@/lib/compile/compileLatex';
import { analyzePdfPages, type PageAnalysis } from '@/lib/pdf/analyzePages';

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

const MAX_SHRINK_ATTEMPTS = 2;
const MAX_GROW_ATTEMPTS = 1;

/**
 * Build a precise shrink prompt using the measured overflow in lines.
 */
function buildShrinkPrompt(latex: string, overflowLines: number): string {
  const cutTarget = overflowLines + OVERFLOW_BUFFER;
  return `Your previous tailoredLatex compiled to 2 pages. The overflow onto page 2 measured exactly ${overflowLines} lines. This is a precise, verified measurement — not an estimate.

Cut approximately ${cutTarget} lines total (the measured overflow plus a small safety margin) — no more than that. Do not over-cut; the goal is the minimum trim that brings this back to exactly 1 page, not maximum brevity. Use this priority order:
1. Shorten any bullet still over ~16 words to hit that target.
2. If still short of the target, drop the single least JD-relevant bullet from whichever Experience entry or Project currently has the most bullets (never below 2 bullets per Experience entry, never remove an entire entry).
3. Trim Tech Stack category lines to their 5-6 most relevant items only if not already done.

Do not re-select different About text or different Projects — only reduce length from the current content, by the precise amount above. Return the full corrected document in the same tailoredLatex/coverMail JSON format, following all the same LaTeX rules (double-escaped backslashes, @id markers preserved exactly, locked sections untouched).

Current tailoredLatex to trim:
${latex}`;
}

/**
 * Build a grow-back prompt to fill measured slack with real archived content.
 */
function buildGrowBackPrompt(latex: string, slackLines: number): string {
  return `Your previous tailoredLatex compiled successfully to exactly 1 page, but with ${slackLines} lines of unused space remaining out of the page's ~${PAGE_LINE_CAPACITY}-line capacity. This is real, measured slack — the page has visible room for more content.

Add back approximately ${slackLines - 2} to ${slackLines} lines of real content (never exceed this, to avoid pushing back to 2 pages) using this priority order:
1. Restore one previously-commented bullet from the Hidden Archive (an unselected Project, or a pruned Experience bullet) that is the next-most relevant to this job description, uncommenting it into the active document.
2. If no archived bullet fits within the remaining space, expand 1-2 of the current shortest bullets with more specific technical detail, keywords, or context that is already true and present elsewhere in the master CV — never invent new facts.
3. If Tech Stack categories were trimmed below 6-7 items during earlier tailoring, restore 1-2 more relevant items per category if space allows.

Do not remove or shorten anything currently in the document — this pass only adds content back within the measured slack. Return the full corrected document in the same tailoredLatex/coverMail JSON format, following all the same LaTeX rules (double-escaped backslashes, @id markers preserved exactly, locked sections untouched).

Current tailoredLatex to enrich:
${latex}`;
}

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

    // 2. Rate Limiting (one slot per tailor click, regardless of retries)
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

    let devProvider: string | undefined;
    let devModel: string | undefined;
    let activeSystemPrompt = TAILOR_SYSTEM_PROMPT;

    if (isDevMode) {
      devProvider = body.devProvider;
      devModel = body.devModel;
      if (body.devSystemPrompt && typeof body.devSystemPrompt === 'string') {
        activeSystemPrompt = body.devSystemPrompt;
      }
    }

    // Helper: call LLM using dev override or fallback chain
    const callLLM = async (params: { systemPrompt: string; userPrompt: string; jsonSchema: typeof TAILOR_SCHEMA }) => {
      if (isDevMode && devProvider) {
        return callSpecificProvider<TailorResponse>(devProvider, devModel, params);
      }
      return callWithFallbackChain<TailorResponse>(params);
    };

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
            systemPrompt: activeSystemPrompt,
            userPrompt,
            jsonSchema: TAILOR_SCHEMA,
          };

          // ── Step 1: Initial LLM call ──
          let result;
          if (isDevMode && devProvider) {
            send({
              type: 'progress',
              message: `[DEV] Calling ${devProvider}${devModel ? ` (${devModel})` : ''}...`,
              step: 1,
              totalSteps: 3,
            });
            result = await callSpecificProvider<TailorResponse>(devProvider, devModel, llmParams);
          } else {
            result = await callWithFallbackChain<TailorResponse>(
              llmParams,
              (providerId, model, attemptIndex, totalProviders) => {
                const retryNote = attemptIndex > 0 ? ` (fallback ${attemptIndex}/${totalProviders - 1})` : '';
                send({
                  type: 'progress',
                  message: `Analyzing with ${providerId} (${model.split('/').pop() || model})${retryNote}...`,
                  step: 1,
                  totalSteps: 3,
                });
              },
            );
          }

          // ── Step 2: Compile-Check-Retry Loop (Precise Shrink + Grow-Back) ──
          send({ type: 'progress', message: 'Compiling PDF to verify page layout...', step: 2, totalSteps: 3 });

          let currentLatex = result.data.tailoredLatex;
          let coverMail = result.data.coverMail;
          let analysis: PageAnalysis = { totalPages: 1, linesPerPage: [0] };
          let shrinkAttempts = 0;
          let growAttempts = 0;

          try {
            // --- Phase 1: shrink until it fits on 1 page ---
            while (true) {
              const pdfBytes = await compileLatexToPdf(currentLatex);
              analysis = await analyzePdfPages(pdfBytes);

              if (analysis.totalPages <= 1 || shrinkAttempts >= MAX_SHRINK_ATTEMPTS) break;

              shrinkAttempts++;
              const overflowLines = analysis.linesPerPage.slice(1).reduce((sum, n) => sum + n, 0);

              send({
                type: 'progress',
                message: `PDF is ${analysis.totalPages} pages (${overflowLines} lines overflow) — trimming (attempt ${shrinkAttempts}/${MAX_SHRINK_ATTEMPTS})...`,
                step: 2,
                totalSteps: 3 + shrinkAttempts,
              });

              const retryResult = await callLLM({
                systemPrompt: activeSystemPrompt,
                userPrompt: buildShrinkPrompt(currentLatex, overflowLines),
                jsonSchema: TAILOR_SCHEMA,
              });

              currentLatex = retryResult.data.tailoredLatex;
              coverMail = retryResult.data.coverMail;
            }

            // --- Phase 2: grow back if there's meaningful slack ---
            if (analysis.totalPages === 1) {
              const usedLines = analysis.linesPerPage[0] ?? 0;
              const slack = PAGE_LINE_CAPACITY - usedLines;

              if (slack >= SLACK_THRESHOLD) {
                growAttempts = 1;

                send({
                  type: 'progress',
                  message: `Page fits with ${slack} lines of slack — restoring archived content...`,
                  step: 3 + shrinkAttempts,
                  totalSteps: 3 + shrinkAttempts + 1,
                });

                const growResult = await callLLM({
                  systemPrompt: activeSystemPrompt,
                  userPrompt: buildGrowBackPrompt(currentLatex, slack),
                  jsonSchema: TAILOR_SCHEMA,
                });

                // Verify the grow-back didn't push it back to 2 pages
                const grownPdfBytes = await compileLatexToPdf(growResult.data.tailoredLatex);
                const grownAnalysis = await analyzePdfPages(grownPdfBytes);

                if (grownAnalysis.totalPages === 1) {
                  // Safe to accept the fuller version
                  currentLatex = growResult.data.tailoredLatex;
                  coverMail = growResult.data.coverMail;
                  analysis = grownAnalysis;
                }
                // else: silently keep the pre-grow version — avoid oscillation
              }
            }
          } catch (compileErr) {
            // If compile/analysis fails, proceed with the LaTeX as-is
            console.warn('[tailor] compile-check failed, skipping page verification:', compileErr);
          }

          const linesUsedOnPage1 = analysis.linesPerPage[0] ?? 0;
          const slackLines = Math.max(0, PAGE_LINE_CAPACITY - linesUsedOnPage1);

          const finalStep = 3 + shrinkAttempts + growAttempts;
          send({ type: 'progress', message: 'Done!', step: finalStep, totalSteps: finalStep });

          send({
            type: 'result',
            tailoredLatex: currentLatex,
            coverMail,
            pageCount: analysis.totalPages,
            linesUsedOnPage1,
            slackLines,
            shrinkAttempts,
            growAttempts,
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
