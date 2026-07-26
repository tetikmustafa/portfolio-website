'use client';

import { useState, useEffect } from 'react';
import { Download, Copy, Check, FileText, Loader2 } from 'lucide-react';
import LaTeXEditor from './LaTeXEditor';
import TurnstileWidget from './TurnstileWidget';

interface MasterCvTabProps {
  masterLatex: string;
  onLatexChange: (value: string) => void;
}

export default function MasterCvTab({ masterLatex, onLatexChange }: MasterCvTabProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState('Master_CV');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Clear PDF preview if code changes
  useEffect(() => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [masterLatex]);

  const handleCompileAndPreview = async () => {
    if (!turnstileToken) return;
    setIsCompiling(true);
    setError(null);

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latexCode: masterLatex,
          turnstileToken,
        }),
      });

      // Reset turnstile for next use
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
      await navigator.clipboard.writeText(masterLatex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = masterLatex;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">

      {/* Header with copy button */}
      <div className="flex items-center justify-between pt-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Master CV
        </h3>
        <button
          onClick={handleCopyLatex}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
        >
          {copied ? (
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

      {/* Editor */}
      <LaTeXEditor
        value={masterLatex}
        onChange={onLatexChange}
        height="500px"
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
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
            download={`${pdfFilename.trim() || 'Master_CV'}.pdf`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm transition-all duration-200 hover:bg-green-700 shadow-sm hover:shadow-md"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        )}
      </div>
    </div>
  );
}
