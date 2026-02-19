import { NextRequest } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { ok } from '@/lib/api';

export async function POST(_req: NextRequest) {
  clearAuthCookie();
  return ok({ message: 'Logged out successfully' });
}
