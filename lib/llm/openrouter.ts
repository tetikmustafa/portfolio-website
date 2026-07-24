/**
 * OpenRouter provider adapter.
 * Uses the OpenAI-compatible endpoint with response_format: json_object.
 */

import type { LLMProvider, LLMCallParams, LLMCallResult } from './types';
import { LLMRetryableError, LLMFatalError } from './types';

function getApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY;
}

function getModel(): string {
  return process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat:free';
}

/** Extract a human-readable error message from the OpenRouter error response. */
function parseErrorMessage(status: number, body: string): string {
  try {
    const json = JSON.parse(body);
    if (json.error?.message) return json.error.message;
    if (json.message) return json.message;
  } catch {
    // not JSON
  }
  return `OpenRouter API returned HTTP ${status}`;
}

export const openRouterProvider: LLMProvider = {
  id: 'openrouter',

  isAvailable() {
    return !!getApiKey();
  },

  async callStructured<T>(params: LLMCallParams, modelOverride?: string): Promise<LLMCallResult<T>> {
    const apiKey = getApiKey();
    if (!apiKey) throw new LLMFatalError('OPENROUTER_API_KEY is not configured', 500);

    const model = modelOverride || getModel();

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      const msg = parseErrorMessage(res.status, errText);
      console.error(`[openrouter] ${res.status}: ${errText}`);

      // 429, 5xx → retryable (try next provider in chain)
      if (res.status === 429 || res.status >= 500) {
        throw new LLMRetryableError(msg, res.status);
      }
      // 400, 401, 403, etc. → fatal
      throw new LLMFatalError(msg, res.status);
    }

    const data = await res.json();
    let content: string = data.choices?.[0]?.message?.content ?? '';

    if (!content) {
      throw new LLMRetryableError('Empty response from OpenRouter', 502);
    }

    // Strip markdown fences if hallucinated
    content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

    let parsed: T;
    try {
      parsed = JSON.parse(content) as T;
    } catch {
      // Fallback: try to fix unescaped LaTeX backslashes
      console.warn('[openrouter] JSON.parse failed, attempting regex extraction...');
      parsed = extractWithRegex<T>(content);
    }

    return { data: parsed, raw: data, providerId: 'openrouter', model };
  },
};

/**
 * Regex-based extraction fallback for when LLMs produce invalid JSON
 * due to unescaped LaTeX backslashes (\textbf → tab + extbf, etc.).
 */
function extractWithRegex<T>(content: string): T {
  const result: Record<string, string> = {};

  const latexMatch = content.match(/"tailoredLatex"\s*:\s*"([\s\S]*?)"\s*(?:,\s*"coverMail"|\})/);
  const coverMatch = content.match(/"coverMail"\s*:\s*"([\s\S]*?)"\s*(?:,\s*"|\})/);

  if (latexMatch) {
    result.tailoredLatex = latexMatch[1]
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r');
  }

  if (coverMatch) {
    result.coverMail = coverMatch[1]
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r');
  }

  if (!result.tailoredLatex) {
    throw new LLMFatalError('Failed to extract tailoredLatex from malformed JSON response', 502);
  }

  return result as T;
}
