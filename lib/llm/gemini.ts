/**
 * Google Gemini provider adapter.
 * Raw fetch to REST API with responseMimeType + responseSchema for structured output.
 */

import type { LLMProvider, LLMCallParams, LLMCallResult } from './types';
import { LLMRetryableError, LLMFatalError } from './types';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

function getModel(): string {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
}

export const geminiProvider: LLMProvider = {
  id: 'gemini',

  isAvailable() {
    return !!getApiKey();
  },

  async callStructured<T>(params: LLMCallParams, modelOverride?: string): Promise<LLMCallResult<T>> {
    const apiKey = getApiKey();
    if (!apiKey) throw new LLMFatalError('GEMINI_API_KEY is not configured', 500);

    const model = modelOverride || getModel();
    const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;

    // Gemini uses a combined prompt (system instructions aren't a separate field in v1beta REST)
    const combinedPrompt = `${params.systemPrompt}\n\n${params.userPrompt}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: combinedPrompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          response_json_schema: params.jsonSchema,
          temperature: 0.3,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `Gemini API returned HTTP ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) msg = errJson.error.message;
      } catch { /* keep default */ }

      console.error(`[gemini] ${res.status}: ${errText}`);

      if (res.status === 429 || res.status >= 500) {
        throw new LLMRetryableError(msg, res.status);
      }
      throw new LLMFatalError(msg, res.status);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new LLMRetryableError('Empty response from Gemini', 502);
    }

    let parsed: T;
    try {
      parsed = JSON.parse(text) as T;
    } catch {
      // Defensive fallback: strip markdown fences
      const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      try {
        parsed = JSON.parse(cleaned) as T;
      } catch {
        throw new LLMFatalError('Gemini returned invalid JSON that could not be parsed', 502);
      }
    }

    return { data: parsed, raw: data, providerId: 'gemini', model };
  },
};
