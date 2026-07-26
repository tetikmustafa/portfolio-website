/**
 * GET /api/tailor/system-prompt
 * Returns the default system prompt text for the dev panel editor.
 * Gated by DEV_PANEL_SECRET.
 */

import { TAILOR_SYSTEM_PROMPT } from '@/lib/tailor/systemPrompt';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const devKey = url.searchParams.get('devKey');
  const devSecret = process.env.DEV_PANEL_SECRET;

  if (!devKey || !devSecret || devKey !== devSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ systemPrompt: TAILOR_SYSTEM_PROMPT }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
