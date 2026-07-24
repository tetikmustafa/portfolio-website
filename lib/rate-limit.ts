/**
 * Upstash Redis-based rate limiting.
 * REST-based client — fully edge-compatible.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { COMPILE_DAILY_LIMIT, TAILOR_DAILY_LIMIT } from './constants';

function createRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/** 15 compile requests per IP per 24h sliding window */
export const compileLimiter = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(COMPILE_DAILY_LIMIT, '24 h'),
  prefix: 'cv-builder:compile',
  analytics: false,
});

/** 5 tailor requests per IP per 24h sliding window */
export const tailorLimiter = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(TAILOR_DAILY_LIMIT, '24 h'),
  prefix: 'cv-builder:tailor',
  analytics: false,
});

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetMs: number;
}

/** Check rate limit for the given limiter + identifier (usually IP). */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<RateLimitResult> {
  const { success, remaining, reset } = await limiter.limit(identifier);
  return { success, remaining, resetMs: reset };
}

/** Build a 429 Response with a friendly message. */
export function rateLimitResponse(remaining: number): Response {
  return new Response(
    JSON.stringify({
      error: 'Daily limit reached — please try again tomorrow.',
      remaining,
    }),
    {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
