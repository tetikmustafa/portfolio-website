/**
 * DeepSeek provider adapter.
 * OpenAI-compatible API with response_format: json_object
 * (DeepSeek's JSON mode is schema-less — schema is restated in the prompt).
 */

import type { LLMProvider, LLMCallParams, LLMCallResult } from './types';
import { LLMRetryableError, LLMFatalError } from './types';

function getApiKey(): string | undefined {
  return process.env.DEEPSEEK_API_KEY;
}

function getModel(): string {
  return process.env.DEEPSEEK_MODEL || 'deepseek-chat';
}

export const deepSeekProvider: LLMProvider = {
  id: 'deepseek',

  isAvailable() {
    return !!getApiKey();
  },

  async callStructured<T>(params: LLMCallParams, modelOverride?: string): Promise<LLMCallResult<T>> {
    const apiKey = getApiKey();
    if (!apiKey) throw new LLMFatalError('DEEPSEEK_API_KEY is not configured', 500);

    const model = modelOverride || getModel();

    // DeepSeek is schema-less JSON mode — restate the schema in the prompt
    const schemaHint = `\n\nYou MUST respond with a JSON object matching this schema:\n${JSON.stringify(params.jsonSchema, null, 2)}`;

    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: params.systemPrompt + schemaHint },
          { role: 'user', content: params.userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `DeepSeek API returned HTTP ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) msg = errJson.error.message;
      } catch { /* keep default */ }

      console.error(`[deepseek] ${res.status}: ${errText}`);

      if (res.status === 429 || res.status >= 500) {
        throw new LLMRetryableError(msg, res.status);
      }
      throw new LLMFatalError(msg, res.status);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    if (!content) {
      throw new LLMRetryableError('Empty response from DeepSeek', 502);
    }

    // Strip markdown fences if hallucinated
    const cleaned = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned) as T;

    return { data: parsed, raw: data, providerId: 'deepseek', model };
  },
};
