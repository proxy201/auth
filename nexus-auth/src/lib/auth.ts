import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET      = process.env.JWT_SECRET!;
const EXPIRES_IN  = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_NAME = 'nexus_token';

/* ── Types ───────────────────────────────────────────────── */
export interface TokenPayload {
  sub:  number;   // user id
  name: string;
  iat?: number;
  exp?: number;
}

/* ── Sign / verify ───────────────────────────────────────── */
export function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/* ── Cookie helpers (server-side only) ───────────────────── */
export function setAuthCookie(token: string): void {
  cookies().set(COOKIE_NAME, token, {
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    sameSite:  'lax',
    path:      '/',
    maxAge:    60 * 60 * 24 * 7, // 7 days in seconds
  });
}

export function clearAuthCookie(): void {
  cookies().delete(COOKIE_NAME);
}

export function getTokenFromCookies(): string | null {
  return cookies().get(COOKIE_NAME)?.value ?? null;
}

export function getCurrentUser(): TokenPayload | null {
  const token = getTokenFromCookies();
  if (!token) return null;
  return verifyToken(token);
}
