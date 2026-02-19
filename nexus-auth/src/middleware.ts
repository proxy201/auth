import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/* Routes accessible without a valid token */
const PUBLIC: string[] = [
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* Always allow static assets, _next, favicon */
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf)$/)
  ) {
    return NextResponse.next();
  }

  /* Always allow public routes */
  if (PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  /* Root → redirect to login */
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  /* Check auth token */
  const token = req.cookies.get('nexus_token')?.value;
  if (!token || !verifyToken(token)) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
