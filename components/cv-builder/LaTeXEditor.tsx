'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco — client-only, no SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-muted/30 rounded-lg border border-border animate-pulse">
      <span className="text-muted-foreground text-sm">Loading editor…</span>
    </div>
  ),
});

interface LaTeXEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
}

export default function LaTeXEditor({
  value,
  onChange,
  readOnly = false,
  height = '500px',
}: LaTeXEditorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Detect mobile viewport
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsMobile(!mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Detect dark/light theme
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // ── Mobile fallback: syntax-highlighted <pre> ──
  if (isMobile) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Editing is available on desktop — you can still view and download the PDF here.</span>
        </div>
        <pre
          className="overflow-x-auto p-4 rounded-lg border border-border bg-muted/30 text-xs leading-relaxed font-mono text-foreground/90 whitespace-pre-wrap break-words"
          style={{ maxHeight: height }}
        >
          {value}
        </pre>
      </div>
    );
  }

  // ── Desktop: Monaco Editor ──
  return (
    <div className="rounded-lg overflow-hidden border border-border">
      <MonacoEditor
        height={height}
        language="latex"
        theme={isDark ? 'vs-dark' : 'light'}
        value={value}
        onChange={(val) => onChange?.(val ?? '')}
        options={{
          readOnly,
          minimap: { enabled: false },
          wordWrap: 'on',
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          smoothScrolling: true,
          padding: { top: 12 },
          automaticLayout: true,
        }}
      />
    </div>
  );
}
