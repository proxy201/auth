import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { findUserById } from '@/lib/db';
import { ok, err } from '@/lib/api';

export async function GET(_req: NextRequest) {
  try {
    const payload = getCurrentUser();
    if (!payload) return err('Unauthorized', 401);

    const user = await findUserById(payload.sub);
    if (!user) return err('User not found', 404);

    return ok({ user });
  } catch (e) {
    console.error('[GET /api/auth/me]', e);
    return err('Internal server error', 500);
  }
}
