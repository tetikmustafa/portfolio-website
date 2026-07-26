/**
 * Compile LaTeX to PDF using ytotech (primary) with latexonline.cc fallback.
 * Extracted from /api/compile/route.ts so both the compile endpoint and
 * the tailor retry-loop can call it without an HTTP round-trip.
 */

import {
  COMPILE_TIMEOUT_MS,
  YTOTECH_URL,
  LATEXONLINE_URL,
} from '@/lib/constants';

export async function compileLatexToPdf(latexCode: string): Promise<ArrayBuffer> {
  let pdfBuffer: ArrayBuffer | null = null;

  // ── Primary: ytotech ──
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), COMPILE_TIMEOUT_MS);

    const ytoRes = await fetch(YTOTECH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'pdflatex',
        resources: [{ main: true, content: latexCode }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (ytoRes.ok) {
      pdfBuffer = await ytoRes.arrayBuffer();
    }
  } catch {
    // ytotech failed — fall through to latexonline
  }

  // ── Fallback: latexonline.cc ──
  if (!pdfBuffer) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), COMPILE_TIMEOUT_MS);

      const formData = new URLSearchParams();
      formData.append('text', latexCode);

      const latexonlineRes = await fetch(
        `${LATEXONLINE_URL}?command=pdflatex`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (latexonlineRes.ok) {
        pdfBuffer = await latexonlineRes.arrayBuffer();
      }
    } catch {
      // latexonline also failed
    }
  }

  if (!pdfBuffer) {
    throw new Error(
      'Both compile services are currently unavailable. Please try again shortly.'
    );
  }

  return pdfBuffer;
}
