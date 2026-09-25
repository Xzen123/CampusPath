import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/jwt';

const PROTECTED_PAGE_ROUTES = [
  '/dashboard',
  '/profile',
  '/opportunities',
  '/students',
  '/employers',
  '/settings',
];

const PROTECTED_API_ROUTES = [
  '/api/applications',
  '/api/profile',
  '/api/notifications',
];

const LOGIN_ROUTE = '/login';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('campus_path_session');
  const { pathname } = request.nextUrl;

  const session = sessionCookie ? await verifySession(sessionCookie.value) : null;

  // 1. Protect Sensitive API Endpoints
  const isProtectedApi = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtectedApi && !session) {
    return NextResponse.json({ error: 'Unauthorized. Valid session token required.' }, { status: 401 });
  }

  // 2. Protect Authenticated Pages
  const isProtectedPage = PROTECTED_PAGE_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtectedPage) {
    if (!session) {
      const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
      response.cookies.delete('campus_path_session');
      return response;
    }
  }

  // 3. Redirect logged-in users away from Auth pages
  if ((pathname === LOGIN_ROUTE || pathname === '/signup') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
