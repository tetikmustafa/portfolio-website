import { extractText, getDocumentProxy } from 'unpdf';

export interface PageAnalysis {
  totalPages: number;
  /** Non-empty line count per page. */
  linesPerPage: number[];
}

/**
 * Extract per-page text from a compiled PDF and count non-empty lines.
 * Uses unpdf — pure JS, edge-runtime compatible (no native/canvas deps).
 */
export async function analyzePdfPages(pdfBytes: ArrayBuffer): Promise<PageAnalysis> {
  const pdf = await getDocumentProxy(new Uint8Array(pdfBytes));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  // `text` is an array of per-page strings when mergePages is false
  const linesPerPage = (text as string[]).map(
    (pageText) => pageText.split('\n').filter((l) => l.trim().length > 0).length
  );
  return { totalPages, linesPerPage };
}
