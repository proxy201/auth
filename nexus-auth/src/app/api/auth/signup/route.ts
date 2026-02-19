import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { signupSchema } from '@/lib/validation';
import { findUserByName, createUser } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import { ok, err, zodErrors } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json().catch(() => ({}));
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return err('Validation failed', 422, zodErrors(parsed.error));
    }

    const { name, password } = parsed.data;

    /* ── Check username availability ─────────────────────── */
    const existing = await findUserByName(name);
    if (existing) {
      return err('Username already taken — please choose another', 409, {
        name: ['Username already taken'],
      });
    }

    /* ── Hash password (bcrypt cost = 12) ────────────────── */
    const password_hash = await bcrypt.hash(password, 12);

    /* ── Persist user ────────────────────────────────────── */
    const userId = await createUser({ name, password_hash });

    /* ── Issue JWT, set HttpOnly cookie ──────────────────── */
    const token = signToken({ sub: userId, name });
    setAuthCookie(token);

    const redirectUrl =
      process.env.NEXT_PUBLIC_REDIRECT_URL || '/dashboard';

    return ok({ user: { id: userId, name }, redirectUrl }, 201);
  } catch (e) {
    console.error('[POST /api/auth/signup]', e);
    return err('Internal server error — please try again later.', 500);
  }
}
