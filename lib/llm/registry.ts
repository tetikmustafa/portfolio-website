/**
 * LLM Provider Registry + Fallback Chain.
 *
 * Reads `LLM_PROVIDER_CHAIN` env var (comma-separated provider IDs)
 * and walks the list in order, retrying the next provider on
 * retryable errors (429, 5xx, timeout).
 */

import type { LLMProvider, LLMCallParams, LLMCallResult } from './types';
import { LLMRetryableError, LLMFatalError } from './types';
import { openRouterProvider } from './openrouter';
import { geminiProvider } from './gemini';
import { openAIProvider } from './openai';
import { anthropicProvider } from './anthropic';
import { deepSeekProvider } from './deepseek';

/** All registered providers, keyed by id. */
const PROVIDERS: Record<string, LLMProvider> = {
  openrouter: openRouterProvider,
  gemini: geminiProvider,
  openai: openAIProvider,
  anthropic: anthropicProvider,
  deepseek: deepSeekProvider,
};

/** Get a single provider by id, or undefined if unknown. */
export function getProvider(id: string): LLMProvider | undefined {
  return PROVIDERS[id];
}

/** Get the ordered fallback chain from env, filtering to available providers. */
function getProviderChain(): LLMProvider[] {
  const chainStr = process.env.LLM_PROVIDER_CHAIN || 'openrouter';
  const ids = chainStr.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

  const chain: LLMProvider[] = [];
  for (const id of ids) {
    const provider = PROVIDERS[id];
    if (!provider) {
      console.warn(`[llm] Unknown provider "${id}" in LLM_PROVIDER_CHAIN — skipping.`);
      continue;
    }
    if (!provider.isAvailable()) {
      console.warn(`[llm] Provider "${id}" has no API key configured — skipping.`);
      continue;
    }
    chain.push(provider);
  }

  return chain;
}

/**
 * Walk the provider chain and call each one until one succeeds.
 *
 * - On LLMRetryableError (429/5xx): log and try the next provider.
 * - On LLMFatalError (400/401/403): throw immediately (won't help to retry elsewhere).
 * - On unknown errors: treat as retryable.
 *
 * @param params   The generic LLM call parameters
 * @param onTry    Optional callback invoked before each provider attempt (for progress updates)
 */
export async function callWithFallbackChain<T>(
  params: LLMCallParams,
  onTry?: (providerId: string, model: string, attemptIndex: number, totalProviders: number) => void,
): Promise<LLMCallResult<T>> {
  const chain = getProviderChain();

  if (chain.length === 0) {
    throw new LLMFatalError(
      'No LLM providers are available. Check LLM_PROVIDER_CHAIN and ensure at least one provider has an API key configured.',
      500,
    );
  }

  const errors: string[] = [];

  for (let i = 0; i < chain.length; i++) {
    const provider = chain[i];
    const model = getModelForProvider(provider.id);

    if (onTry) {
      onTry(provider.id, model, i, chain.length);
    }

    try {
      console.log(`[llm] Trying provider "${provider.id}" with model "${model}"...`);
      const result = await provider.callStructured<T>(params);
      console.log(`[llm] Provider "${provider.id}" succeeded.`);
      return result;
    } catch (err) {
      if (err instanceof LLMFatalError) {
        // Fatal = don't retry, surface to user immediately
        console.error(`[llm] Provider "${provider.id}" returned fatal error: ${err.message}`);
        throw err;
      }

      // Retryable or unknown error — log and try next
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[llm] Provider "${provider.id}" failed (retryable): ${msg}`);
      errors.push(`${provider.id}: ${msg}`);
    }
  }

  // All providers exhausted
  throw new LLMRetryableError(
    `All LLM providers failed:\n${errors.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}`,
    502,
  );
}

/**
 * Call a specific provider by id (for dev panel overrides).
 * Does NOT use the fallback chain — calls exactly the requested provider.
 */
export async function callSpecificProvider<T>(
  providerId: string,
  modelOverride: string | undefined,
  params: LLMCallParams,
): Promise<LLMCallResult<T>> {
  const provider = PROVIDERS[providerId];
  if (!provider) {
    throw new LLMFatalError(`Unknown provider: "${providerId}"`, 400);
  }
  if (!provider.isAvailable()) {
    throw new LLMFatalError(`Provider "${providerId}" has no API key configured`, 500);
  }
  return provider.callStructured<T>(params, modelOverride);
}

/** Read the env-configured model for a given provider. */
function getModelForProvider(providerId: string): string {
  switch (providerId) {
    case 'openrouter': return process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat:free';
    case 'gemini': return process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
    case 'openai': return process.env.OPENAI_MODEL || 'gpt-4o-mini';
    case 'anthropic': return process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
    case 'deepseek': return process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    default: return 'unknown';
  }
}
