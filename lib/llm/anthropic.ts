/**
 * Anthropic Claude provider adapter.
 * Uses forced tool call pattern for structured output (Claude has no bare JSON mode).
 */

import type { LLMProvider, LLMCallParams, LLMCallResult } from './types';
import { LLMRetryableError, LLMFatalError } from './types';

function getApiKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY;
}

function getModel(): string {
  return process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
}

export const anthropicProvider: LLMProvider = {
  id: 'anthropic',

  isAvailable() {
    return !!getApiKey();
  },

  async callStructured<T>(params: LLMCallParams, modelOverride?: string): Promise<LLMCallResult<T>> {
    const apiKey = getApiKey();
    if (!apiKey) throw new LLMFatalError('ANTHROPIC_API_KEY is not configured', 500);

    const model = modelOverride || getModel();

    // Claude structured output: define a tool matching the JSON schema,
    // then force the model to call it via tool_choice.
    const toolName = 'structured_response';

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        system: params.systemPrompt,
        messages: [
          { role: 'user', content: params.userPrompt },
        ],
        tools: [
          {
            name: toolName,
            description: 'Return the structured response as specified by the schema.',
            input_schema: params.jsonSchema,
          },
        ],
        tool_choice: { type: 'tool', name: toolName },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `Anthropic API returned HTTP ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.message) msg = errJson.error.message;
      } catch { /* keep default */ }

      console.error(`[anthropic] ${res.status}: ${errText}`);

      if (res.status === 429 || res.status >= 500) {
        throw new LLMRetryableError(msg, res.status);
      }
      throw new LLMFatalError(msg, res.status);
    }

    const data = await res.json();

    // Find the tool_use content block
    const toolUseBlock = data.content?.find(
      (block: { type: string }) => block.type === 'tool_use'
    );

    if (!toolUseBlock?.input) {
      throw new LLMRetryableError('Anthropic did not return a tool_use block', 502);
    }

    const parsed = toolUseBlock.input as T;
    return { data: parsed, raw: data, providerId: 'anthropic', model };
  },
};
