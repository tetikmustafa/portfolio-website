/**
 * Common types for the Multi-Provider LLM Abstraction Layer.
 * All provider adapters implement the LLMProvider interface.
 */

/** Parameters passed to every provider's callStructured method. */
export interface LLMCallParams {
  systemPrompt: string;
  userPrompt: string;
  /** JSON Schema describing the expected response shape. */
  jsonSchema: Record<string, unknown>;
}

/** Result returned by every provider's callStructured method. */
export interface LLMCallResult<T> {
  /** Parsed, typed data extracted from the LLM response. */
  data: T;
  /** The raw response body from the provider for debugging. */
  raw: unknown;
  /** Which provider served this request. */
  providerId: string;
  /** Which model was used. */
  model: string;
}

/** Every LLM provider adapter must implement this interface. */
export interface LLMProvider {
  /** Unique identifier: "openrouter" | "gemini" | "openai" | "anthropic" | "deepseek" */
  id: string;

  /**
   * Returns true if this provider has a valid API key configured.
   * Used by the registry to skip unavailable providers in the chain.
   */
  isAvailable(): boolean;

  /**
   * Call the LLM with a structured output request.
   * The provider is responsible for translating the generic params
   * into its own request format and parsing the response.
   *
   * @throws Error with a descriptive message on failure (the registry
   *         will catch retryable errors and try the next provider).
   */
  callStructured<T>(params: LLMCallParams, modelOverride?: string): Promise<LLMCallResult<T>>;
}

/**
 * Error class for retryable LLM failures (429, 5xx, timeout).
 * The fallback chain will catch these and try the next provider.
 */
export class LLMRetryableError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'LLMRetryableError';
    this.statusCode = statusCode;
  }
}

/**
 * Error class for non-retryable LLM failures (400, 401, 403, etc.).
 * The fallback chain will NOT retry these — they indicate a config
 * or input problem, not a transient provider issue.
 */
export class LLMFatalError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'LLMFatalError';
    this.statusCode = statusCode;
  }
}
