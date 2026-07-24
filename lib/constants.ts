// Shared constants for the CV Builder feature.
// All limits are intentionally conservative for a public-facing tool.

// ── Input size limits ──
export const MAX_LATEX_LENGTH = 50_000;
export const MAX_JOB_DESCRIPTION_LENGTH = 10_000;
export const MAX_CUSTOM_INSTRUCTIONS_LENGTH = 2_000;

// ── Compile service timeouts ──
export const COMPILE_TIMEOUT_MS = 15_000;

// ── Rate-limit quotas (per IP, sliding 24h window) ──
export const COMPILE_DAILY_LIMIT = 100;
export const TAILOR_DAILY_LIMIT = 50;



// ── Compile service URLs ──
export const YTOTECH_URL = 'https://latex.ytotech.com/builds/sync';
export const LATEXONLINE_URL = 'https://latexonline.cc/compile';
