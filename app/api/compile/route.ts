/**
 * POST /api/compile
 * Compiles LaTeX to PDF using ytotech (primary) with latexonline.cc fallback.
 * Edge runtime — fully Cloudflare Pages compatible.
 */


import { verifyTurnstile } from '@/lib/turnstile';
import { compileLimiter, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { MAX_LATEX_LENGTH } from '@/lib/constants';
import { compileLatexToPdf } from '@/lib/compile/compileLatex';

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // ── Parse body ──
    const body = await request.json();
    const { latexCode, turnstileToken } = body as {
      latexCode?: string;
      turnstileToken?: string;
    };

    if (!latexCode || !turnstileToken) {
      return jsonError('Missing required fields: latexCode, turnstileToken', 400);
    }

    // ── Input size guard ──
    if (latexCode.length > MAX_LATEX_LENGTH) {
      return jsonError(
        `LaTeX code exceeds the ${MAX_LATEX_LENGTH.toLocaleString()} character limit.`,
        400
      );
    }

    // ── Turnstile verification ──
    const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
    const turnstileOk = await verifyTurnstile(turnstileToken, ip);
    if (!turnstileOk) {
      return jsonError('Turnstile verification failed. Please try again.', 403);
    }

    // ── Rate limit ──
    const rateResult = await checkRateLimit(compileLimiter, `compile:${ip}`);
    if (!rateResult.success) {
      return rateLimitResponse(rateResult.remaining);
    }

    // ── Compile ──
    let pdfBuffer: ArrayBuffer;
    try {
      pdfBuffer = await compileLatexToPdf(latexCode);
    } catch {
      return jsonError(
        'Both compile services are currently unavailable. Please try again shortly.',
        502
      );
    }

    // ── Aggregate-only logging ──
    const latency = Date.now() - startTime;
    console.log(
      `[compile] latency=${latency}ms size=${pdfBuffer.byteLength} ip_hash=${hashIp(ip)}`
    );

    // ── Return PDF ──
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cv.pdf"',
        'X-Remaining-Quota': String(rateResult.remaining),
      },
    });
  } catch (err) {
    const latency = Date.now() - startTime;
    console.error(`[compile] error latency=${latency}ms msg=${(err as Error).message}`);
    return jsonError('An unexpected error occurred during compilation.', 500);
  }
}

// ── Helpers ──

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Simple non-reversible hash for aggregate logging — never log raw IPs. */
function hashIp(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = ((hash << 5) - hash + ip.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}
