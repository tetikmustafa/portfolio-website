'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Download, Copy, Check, Loader2, FileText, Mail } from 'lucide-react';
import LaTeXEditor from './LaTeXEditor';
import TurnstileWidget from './TurnstileWidget';

// Lazy-load diff viewer — heavy component
const ReactDiffViewer = dynamic(() => import('react-diff-viewer-continued'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-muted/30 rounded-lg border border-border animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground text-sm">Loading diff view…</span>
    </div>
  ),
});

interface ResultsTabProps {
  masterLatex: string;
  tailoredLatex: string;
  coverMail: string;
}

export default function ResultsTab({
  masterLatex,
  tailoredLatex,
  coverMail,
}: ResultsTabProps) {
  const [editedTailored, setEditedTailored] = useState(tailoredLatex);
  const [isCompiling, setIsCompiling] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiff, setShowDiff] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [pdfFilename, setPdfFilename] = useState('tailored-cv');

  // Detect theme for diff viewer
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  });

  const handleDownloadPdf = async () => {
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
      const a = document.createElement('a');
      a.href = url;
      const finalName = pdfFilename.trim() || 'tailored-cv';
      a.download = finalName.endsWith('.pdf') ? finalName : `${finalName}.pdf`;
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

  const handleCopyMail = async () => {
    try {
      await navigator.clipboard.writeText(coverMail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS contexts
      const textarea = document.createElement('textarea');
      textarea.value = coverMail;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">

      {/* ═══ Section A: Tailored CV ═══ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Tailored CV
          </h3>
          <button
            onClick={() => setShowDiff((v) => !v)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            {showDiff ? 'Hide' : 'Show'} Diff View
          </button>
        </div>

        <LaTeXEditor
          value={editedTailored}
          onChange={setEditedTailored}
          height="400px"
        />

        {/* Diff View */}
        {showDiff && (
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="px-4 py-2 bg-muted/50 border-b border-border text-xs text-muted-foreground font-medium">
              Changes: Master CV → Tailored CV
            </div>
            <div className="max-h-[400px] overflow-auto text-xs">
              <ReactDiffViewer
                oldValue={masterLatex}
                newValue={editedTailored}
                splitView={true}
                useDarkTheme={isDark}
                leftTitle="Master CV"
                rightTitle="Tailored CV"
                styles={{
                  contentText: { fontSize: '11px', lineHeight: '1.5' },
                }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
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
                Download
              </>
            )}
          </button>
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
          {copied ? (
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
