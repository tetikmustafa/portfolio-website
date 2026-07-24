'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileText, Sparkles, CheckCircle, ArrowLeft, Wrench } from 'lucide-react';
import Link from 'next/link';
import MasterCvTab from './MasterCvTab';
import AiTailorTab from './AiTailorTab';
import ResultsTab from './ResultsTab';

type TabId = 'master' | 'tailor' | 'results';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'master', label: 'Master CV', icon: FileText },
  { id: 'tailor', label: 'AI Tailor', icon: Sparkles },
  { id: 'results', label: 'Results', icon: CheckCircle },
];

export default function CvBuilderClient() {
  const [activeTab, setActiveTab] = useState<TabId>('master');
  const [masterLatex, setMasterLatex] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const devKey = searchParams.get('devKey');

  // Results state
  const [tailoredLatex, setTailoredLatex] = useState<string | null>(null);
  const [coverMail, setCoverMail] = useState<string | null>(null);

  // Load master.tex from public folder
  useEffect(() => {
    fetch('/data/master.tex')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load master.tex: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        setMasterLatex(text);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setMasterLatex('% Error: Could not load master.tex\n% Please check that public/data/master.tex exists.');
        setIsLoading(false);
      });
  }, []);

  const handleTailorComplete = (result: {
    tailoredLatex: string;
    coverMail: string;
    meta?: { provider: string; model: string };
  }) => {
    setTailoredLatex(result.tailoredLatex);
    setCoverMail(result.coverMail);
    setActiveTab('results');
  };

  const hasResults = tailoredLatex !== null && coverMail !== null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading CV data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 fade-up">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">CV Builder</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered resume tailoring &amp; LaTeX-to-PDF compilation
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg hover:border-primary/30 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Portfolio
        </Link>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex border-b border-border">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.id === 'results' && !hasResults;

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveTab(tab.id)}
              disabled={isDisabled}
              className={`relative flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : isDisabled
                    ? 'text-muted-foreground/40 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
              )}

              {/* Results badge */}
              {tab.id === 'results' && hasResults && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className="min-h-[500px]">
        {activeTab === 'master' && (
          <MasterCvTab
            masterLatex={masterLatex}
            onLatexChange={setMasterLatex}
          />
        )}
        {activeTab === 'tailor' && (
          <AiTailorTab
            masterLatex={masterLatex}
            devKey={devKey}
            onTailorComplete={handleTailorComplete}
          />
        )}
        {activeTab === 'results' && tailoredLatex && coverMail && (
          <ResultsTab
            masterLatex={masterLatex}
            tailoredLatex={tailoredLatex}
            coverMail={coverMail}
          />
        )}
      </div>
    </div>
  );
}
