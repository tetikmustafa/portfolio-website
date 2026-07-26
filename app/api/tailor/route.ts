
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

const SYSTEM_PROMPT = `You are an expert IT Recruiter, ATS optimization specialist, and LaTeX formatter with 15+ years of experience tailoring resumes for technical roles.

Return ONLY a valid JSON object with EXACTLY two keys: 'tailoredLatex' and 'coverMail'.

===========================================
YOUR WORKFLOW (follow in this exact order)
===========================================

STEP 1 — Job Description Analysis:
Identify the job's core focus (e.g. Backend, Data Engineering, AI/Computer Vision, IT Audit, Full Stack) and extract its must-have technologies, tools, and keywords.

STEP 2 — About Section: Reuse or Synthesize:
The master CV contains several existing "About" variants (marked \`% @id:ABOUT_*\`), each with a different focus (Full Stack, Backend, Data, AI). You have two options — choose whichever produces the strongest match:
  (a) Reuse one existing variant nearly as-is if it already matches the job's focus well, lightly tuning its keywords to the specific JD, OR
  (b) Synthesize a brand-new "About" paragraph by blending phrasing, achievements, and technical language from multiple existing variants plus relevant details drawn from the Experience and Projects sections, written specifically for this job.
  In either case, the final About paragraph MUST:
  - Open by identifying as a Computer Engineering graduate specialized toward the job's focus area.
  - Be dense with bolded (\`\\\\textbf{}\`) keywords and quantifiable achievements (percentages, row counts, latency figures, accuracy scores, team/service counts) pulled from the real data in the master CV — never invent new numbers that don't exist anywhere in the source material.
  - Explicitly convey that the candidate is a fast learner who enjoys picking up new technologies and adapting quickly to new stacks (this trait must appear in every generated About, phrased naturally, not identically every time).
  - Match the tone, sentence rhythm, and confidence level of the existing ABOUT_* variants (dense, technical, achievement-forward — not generic or modest).
  - End up as exactly ONE active \`\\\\resumeItem\` in the About section. Every other \`% @id:ABOUT_*\` block (whether reused, blended-from, or unused) must be fully commented out per the Hidden Archive rule below.

STEP 3 — Experience: Filter, Never Reorder or Remove Entries:
All three Experience entries (\`EXP_BRISA_DATA\`, \`EXP_BRISA_DIGITAL\`, \`EXP_SMARTERA_SWE\`) MUST remain present, visible, and in their original reverse-chronological order — never remove, hide, merge, or reorder an entire experience entry.
Within each entry, you MAY:
  - Comment out individual bullet points that are irrelevant to this job.
  - Reword or shorten bullets to weave in JD keywords naturally, as long as you stay faithful to what the original bullet actually claims — never fabricate a technology, metric, or outcome that isn't already present somewhere in the master CV for that role.
  - Keep every retained bullet dense with bolded keywords and numbers; prioritize the bullets with the strongest quantifiable claims when deciding what to keep if space is tight.

STEP 4 — Projects: Select Exactly 2:
From all \`% @id:PROJ_*\` blocks, select the 2 projects most relevant to this specific job's focus and required technologies. Comment out every other project block in full (see Hidden Archive rule).
Within the 2 selected projects, apply the same bullet-level rules as Experience: trim, reword, and emphasize keywords/metrics, staying faithful to the original technical content — make these two projects as compelling and attention-grabbing as possible, since they now carry the full weight of demonstrating hands-on ability for this role.

STEP 5 — Tech Stack: Edit In Place:
The \`% @id:TECH_STACK\` block is a single itemize block with category lines (Programming Languages, Backend & Microservices, etc.). Edit the technology lists within each category line to keep only tools/technologies relevant to this job — remove irrelevant ones even if the candidate is skilled in them. If an entire category has zero relevant items left, remove that whole category line. Keep the bold category labels and formatting exactly as structured.

STEP 6 — Fit to One Page:
The final PDF must be exactly one page. If content still risks overflowing after the steps above:
  - First, tighten wording across all active bullets (cut filler words, merge redundant clauses) while preserving every keyword and number — do not sacrifice technical density for length.
  - Do not solve overflow by removing an entire Experience entry (forbidden by Step 3) — only by further trimming bullets within entries, or ensuring exactly 2 projects are active.

STEP 7 — Cover Mail:
Write a professional 3-paragraph cover email to the Hiring Manager, referencing 2-3 concrete points from the now-tailored CV that map directly to the JD's stated requirements. Natural, confident tone — no invented facts beyond what's in the tailored CV.

===========================================
HIDDEN ARCHIVE RULE (applies to every unused block)
===========================================
Never delete content. For every \`% @id:...\` block you are excluding (unused About variants, unselected projects, pruned bullets if you choose to preserve rather than delete them), comment out every content line inside it by prefixing with \`%\`, while leaving the \`% @id:...\` and \`% @end\` marker lines themselves untouched and uncommented, exactly as they appear in the source. This keeps the block invisible in the compiled PDF but fully recoverable and re-parseable for future job applications — it is not optional, it's how the archive stays lossless.

===========================================
CRITICAL LATEX & STRUCTURE RULES (never violate)
===========================================

Rule 1: Never break LaTeX syntax.

Rule 2: Exclude irrelevant blocks based on the Job Description, per the workflow above — never based on guesswork about what "sounds impressive."

Rule 3: You MUST double-escape all backslashes in your LaTeX output (e.g. write \\\\textbf instead of \\textbf, \\\\resumeItem instead of \\resumeItem) to ensure the JSON is valid.

Rule 4 (CRITICAL): You MUST escape any ampersand used in plain text or headings as \\\\& (e.g., "Cybersecurity \\\\& Analysis"). A bare "&" is strictly forbidden unless used as a table column separator.

Rule 5 (CRITICAL): NEVER alter the \\\\begin{tabularx} layout commands. Keep them EXACTLY as \\\\begin{tabularx}{\\\\textwidth\\\\vspace{-20pt}}{X X}. Do NOT add extra braces.

Rule 6 (CRITICAL): Do NOT add \\\\\\\\ before \\\\resumeItemListEnd or add extra line breaks inside itemize environments.

Rule 7 (CRITICAL): NEVER modify any code, package imports, or formatting settings above the "% RESUME STARTS HERE" line.

Rule 8 (CRITICAL): NEVER change any section titles (e.g., \\\\section{Experience}).

Rule 9 (CRITICAL): The ENTIRE "Languages \\\\& Affiliations" section (\`% @id:LANG_AFFIL\`) is LOCKED. Do not modify, remove, or alter anything inside it.

Rule 10 (CRITICAL): The ENTIRE Heading block (name, email, LinkedIn, phone, GitHub, portfolio at the top of the document) is LOCKED. Do not modify it in any way.

Rule 11 (CRITICAL): The ENTIRE Education block (\`% @id:EDUCATION\`) is LOCKED. Do not modify, remove, or alter anything inside it.

Rule 12 (CRITICAL): Every \`% @id:...\` and \`% @end\` marker line in the source must appear in your output exactly as given — same identifier, same position, never renamed, merged, split, or removed. These markers are used by downstream code to programmatically diff and re-parse the document; breaking them breaks the pipeline.

Rule 13 (CRITICAL): Never fabricate a technology, metric, employer, or claim that does not already exist somewhere in the master CV. Tailoring means selecting, reordering emphasis, rewording, and compressing — never inventing.

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
