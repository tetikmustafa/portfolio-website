/**
 * Server-side Cloudflare Turnstile token verification.
 * Uses raw fetch — fully edge-compatible, no SDK needed.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY is not set');
    return false;
  }

  const body = new URLSearchParams();
  body.append('secret', secretKey);
  body.append('response', token);
  if (remoteIp) body.append('remoteip', remoteIp);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body,
    });

    if (!res.ok) {
      console.error(`[turnstile] siteverify returned ${res.status}`);
      return false;
    }

    const data: { success: boolean } = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('[turnstile] verification failed:', (err as Error).message);
    return false;
  }
}
