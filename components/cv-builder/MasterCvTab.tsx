'use client';

import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
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

      // Download the PDF blob
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'master-cv.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="space-y-4">

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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <TurnstileWidget
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          resetKey={turnstileResetKey}
        />
        <button
          onClick={handleDownloadPdf}
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
              <Download className="w-4 h-4" />
              Download Master PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
