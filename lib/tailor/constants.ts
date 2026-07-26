/**
 * Shared constants for the one-page optimization loop.
 * These are calibrated empirically from compiled PDFs.
 */

/** Maximum non-empty text lines that fit on one page of this LaTeX template. */
export const PAGE_LINE_CAPACITY = 54;

/** Minimum lines of unused space before triggering a grow-back pass. */
export const SLACK_THRESHOLD = 6;

/** Extra lines to cut beyond the measured overflow, as a safety margin. */
export const OVERFLOW_BUFFER = 2;
