/**
 * OpenAI provider adapter.
 * Uses response_format with json_schema + strict: true for structured output.
 */

import type { LLMProvider, LLMCallParams, LLMCallResult } from './types';
import { LLMRetryableError, LLMFatalError } from './types';

function getApiKey(): string | undefined {
  return process.env.OPENAI_API_KEY;
}

function getModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}

export const openAIProvider: LLMProvider = {
  id: 'openai',

  isAvailable() {
    return !!getApiKey();
  },

  async callStructured<T>(params: LLMCallParams, modelOverride?: string): Promise<LLMCallResult<T>> {
    const apiKey = getApiKey();
    if (!apiKey) throw new LLMFatalError('OPENAI_API_KEY is not configured', 500);

    const model = modelOverride || getModel();

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'tailor_response',
            strict: true,
            schema: params.jsonSchema,
          },
        },
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `OpenAI API returned HTTP ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) msg = errJson.error.message;
      } catch { /* keep default */ }

      console.error(`[openai] ${res.status}: ${errText}`);

      if (res.status === 429 || res.status >= 500) {
        throw new LLMRetryableError(msg, res.status);
      }
      throw new LLMFatalError(msg, res.status);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    if (!content) {
      throw new LLMRetryableError('Empty response from OpenAI', 502);
    }

    const parsed = JSON.parse(content) as T;
    return { data: parsed, raw: data, providerId: 'openai', model };
  },
};
