import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validation';
import { findUserByName } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import { ok, err, zodErrors } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return err('Validation failed', 422, zodErrors(parsed.error));
    }

    const { name, password } = parsed.data;

    /* ── Find user ───────────────────────────────────────── */
    const user = await findUserByName(name);

    /* ── Constant-time comparison (prevents timing attacks) ─ */
    const passwordOk = user
      ? await bcrypt.compare(password, user.password_hash)
      : await bcrypt.compare(password, '$2a$12$invalid.hash.for.timing.safety.only');

    if (!user || !passwordOk) {
      /* Generic message — prevents username enumeration */
      return err('Invalid username or password', 401);
    }

    /* ── Issue JWT, set HttpOnly cookie ──────────────────── */
    const token = signToken({ sub: user.id, name: user.name });
    setAuthCookie(token);

    const redirectUrl =
      process.env.NEXT_PUBLIC_REDIRECT_URL || '/dashboard';

    return ok({ user: { id: user.id, name: user.name }, redirectUrl });
  } catch (e) {
    console.error('[POST /api/auth/login]', e);
    return err('Internal server error — please try again later.', 500);
  }
}
