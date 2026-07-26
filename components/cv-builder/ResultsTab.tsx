'use client';

import { useState, useEffect } from 'react';
import { Download, Copy, Check, Loader2, FileText, Mail, AlertTriangle } from 'lucide-react';
import LaTeXEditor from './LaTeXEditor';
import TurnstileWidget from './TurnstileWidget';

interface ResultsTabProps {
  tailoredLatex: string;
  coverMail: string;
  pageCount?: number;
  slackLines?: number;
  shrinkAttempts?: number;
  growAttempts?: number;
}

export default function ResultsTab({
  tailoredLatex,
  coverMail,
  pageCount,
  slackLines,
  shrinkAttempts,
  growAttempts,
}: ResultsTabProps) {
  const [editedTailored, setEditedTailored] = useState(tailoredLatex);
  const [isCompiling, setIsCompiling] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [copiedMail, setCopiedMail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState('Mustafa_Tetik_CV');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Clear PDF preview if code changes
  useEffect(() => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [editedTailored]);

  const handleCompileAndPreview = async () => {
    if (!turnstileToken) return;
    setIsCompiling(true);
    setError(null);

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latexCode: editedTailored,
          turnstileToken,
        }),
      });

      setTurnstileToken(null);
      setTurnstileResetKey((k) => k + 1);

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Compilation failed (${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleCopyLatex = async () => {
    try {
      await navigator.clipboard.writeText(editedTailored);
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = editedTailored;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedLatex(true);
      setTimeout(() => setCopiedLatex(false), 2000);
    }
  };

  const handleCopyMail = async () => {
    try {
      await navigator.clipboard.writeText(coverMail);
      setCopiedMail(true);
      setTimeout(() => setCopiedMail(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = coverMail;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedMail(true);
      setTimeout(() => setCopiedMail(false), 2000);
    }
  };

  return (
    <div className="space-y-6">

      {/* ═══ Page Count Warning Banner ═══ */}
      {pageCount !== undefined && pageCount > 1 && (
        <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            Bu sürüm hâlâ {pageCount} sayfa — otomatik kısaltma denemeleri tükendi, manuel düzenleme önerilir.
          </span>
        </div>
      )}

      {/* ═══ Section A: Tailored CV ═══ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Tailored CV
          </h3>
          <button
            onClick={handleCopyLatex}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            {copiedLatex ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy LaTeX
              </>
            )}
          </button>
        </div>

        {/* Page count info badge */}
        {pageCount !== undefined && pageCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${pageCount === 1 ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
              {pageCount} page{pageCount !== 1 ? 's' : ''}
            </span>
            {pageCount === 1 && slackLines !== undefined && (
              <span className="text-muted-foreground/70">
                Sayfa doluluğu: {slackLines < 6 ? 'iyi' : `${slackLines} satır boşluk`}
              </span>
            )}
            {shrinkAttempts !== undefined && shrinkAttempts > 0 && (
              <span className="text-muted-foreground/70">
                ({shrinkAttempts} shrink{growAttempts ? ` + ${growAttempts} grow` : ''})
              </span>
            )}
            {shrinkAttempts === 0 && growAttempts !== undefined && growAttempts > 0 && (
              <span className="text-muted-foreground/70">
                ({growAttempts} grow-back)
              </span>
            )}
          </div>
        )}

        <LaTeXEditor
          value={editedTailored}
          onChange={setEditedTailored}
          height="400px"
        />

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* PDF Preview */}
        {pdfUrl && (
          <div className="rounded-lg overflow-hidden border border-border mt-4">
            <div className="px-4 py-2 bg-muted/50 border-b border-border text-xs text-muted-foreground font-medium">
              PDF Preview
            </div>
            <iframe
              src={pdfUrl}
              className="w-full h-[600px] border-none bg-white"
              title="PDF Preview"
            />
          </div>
        )}

        {/* Download Tailored PDF */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <TurnstileWidget
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken(null)}
            resetKey={turnstileResetKey}
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={pdfFilename}
              onChange={(e) => setPdfFilename(e.target.value)}
              placeholder="Filename"
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-[150px]"
            />
            <span className="text-muted-foreground text-sm -ml-1">.pdf</span>
          </div>
          <button
            onClick={handleCompileAndPreview}
            disabled={isCompiling || !turnstileToken}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {isCompiling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Compiling…
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Compile & Preview
              </>
            )}
          </button>
          
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`${pdfFilename.trim() || 'Mustafa_Tetik_CV'}.pdf`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm transition-all duration-200 hover:bg-green-700 shadow-sm hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* ═══ Section B: Cover Mail ═══ */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Cover Mail
        </h3>

        <div className="p-5 rounded-lg border border-border bg-card/50 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-[inherit]">
          {coverMail}
        </div>

        <button
          onClick={handleCopyMail}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
          {copiedMail ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
    </div>
  );
}
