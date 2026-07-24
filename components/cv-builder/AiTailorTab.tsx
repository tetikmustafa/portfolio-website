'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import TurnstileWidget from './TurnstileWidget';
import { MAX_JOB_DESCRIPTION_LENGTH, MAX_CUSTOM_INSTRUCTIONS_LENGTH } from '@/lib/constants';

interface AiTailorTabProps {
  masterLatex: string;
  devKey?: string | null;
  onTailorComplete: (result: {
    tailoredLatex: string;
    coverMail: string;
    meta?: { provider: string; model: string };
  }) => void;
}

interface ProgressEvent {
  type: 'progress';
  message: string;
  step: number;
  totalSteps: number;
}

const DEV_PROVIDERS = [
  { id: 'openrouter', label: 'OpenRouter' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'deepseek', label: 'DeepSeek' },
];

export default function AiTailorTab({ masterLatex, devKey, onTailorComplete }: AiTailorTabProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isTailoring, setIsTailoring] = useState(false);
  const [progress, setProgress] = useState<ProgressEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dev mode state
  const isDevMode = !!devKey;
  const [devProvider, setDevProvider] = useState('openrouter');
  const [devModel, setDevModel] = useState('');

  const handleTailor = async () => {
    if (!turnstileToken || !jobDescription.trim()) return;
    setIsTailoring(true);
    setError(null);
    setProgress(null);

    try {
      // Build URL with devKey if in dev mode
      const tailorUrl = isDevMode ? `/api/tailor?devKey=${encodeURIComponent(devKey!)}` : '/api/tailor';

      const bodyPayload: Record<string, string> = {
        masterLatex,
        jobDescription,
        customInstructions,
        turnstileToken,
      };

      // Only include dev overrides when authenticated
      if (isDevMode) {
        bodyPayload.devProvider = devProvider;
        if (devModel.trim()) {
          bodyPayload.devModel = devModel.trim();
        }
      }

      const res = await fetch(tailorUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      // Reset turnstile
      setTurnstileToken(null);
      setTurnstileResetKey((k) => k + 1);

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Tailoring failed (${res.status})`);
      }

      // Read NDJSON stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === 'progress') {
              setProgress(event);
            } else if (event.type === 'result') {
              onTailorComplete({
                tailoredLatex: event.tailoredLatex,
                coverMail: event.coverMail,
                meta: event.meta,
              });
            } else if (event.type === 'error') {
              throw new Error(event.message);
            }
          } catch (parseErr) {
            // Re-throw intentional errors (from event.type === 'error')
            if (parseErr instanceof Error && parseErr.message !== 'Invalid JSON') {
              throw parseErr;
            }
            // Silently ignore JSON parse errors on partial stream chunks
          }
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsTailoring(false);
      setProgress(null);
    }
  };

  return (
    <div className="space-y-5 py-6">
      {/* Dev Mode Banner */}
      {isDevMode && (
        <div className="px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-sm font-medium flex items-center gap-2">
          <span className="text-lg">🔧</span>
          Dev Mode Active — Provider/model overrides enabled
        </div>
      )}

      {/* Job Description */}
      <div className="space-y-2">
        <label htmlFor="job-description" className="block text-sm font-medium text-foreground">
          Job Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here…"
          rows={8}
          maxLength={MAX_JOB_DESCRIPTION_LENGTH}
          disabled={isTailoring}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-y disabled:opacity-50"
        />
        <div className="flex justify-end">
          <span className={`text-xs ${jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {jobDescription.length.toLocaleString()} / {MAX_JOB_DESCRIPTION_LENGTH.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Custom Instructions */}
      <div className="space-y-2">
        <label htmlFor="custom-instructions" className="block text-sm font-medium text-foreground">
          Custom Instructions <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="custom-instructions"
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="e.g. 'Focus on backend skills', 'Remove all cybersecurity projects', 'Keep the cover letter under 200 words'…"
          rows={3}
          maxLength={MAX_CUSTOM_INSTRUCTIONS_LENGTH}
          disabled={isTailoring}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-y disabled:opacity-50"
        />
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground">
            {customInstructions.length.toLocaleString()} / {MAX_CUSTOM_INSTRUCTIONS_LENGTH.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Dev Mode: Provider/Model Picker */}
      {isDevMode && (
        <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dev: Provider Override</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              id="dev-provider-select"
              value={devProvider}
              onChange={(e) => setDevProvider(e.target.value)}
              disabled={isTailoring}
              className="w-full sm:w-48 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50"
            >
              {DEV_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={devModel}
              onChange={(e) => setDevModel(e.target.value)}
              placeholder="Model override (leave empty for env default)"
              disabled={isTailoring}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50"
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <p className="font-medium mb-1">Tailoring failed</p>
          <p className="text-destructive/80">{error}</p>
        </div>
      )}

      {/* Progress */}
      {isTailoring && progress && (
        <div className="px-4 py-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            {progress.message}
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(progress.step / progress.totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Step {progress.step} of {progress.totalSteps}
          </p>
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
          onClick={handleTailor}
          disabled={isTailoring || !turnstileToken || !jobDescription.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {isTailoring ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Tailoring…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Tailor CV &amp; Generate Cover Mail
            </>
          )}
        </button>
      </div>
    </div>
  );
}
