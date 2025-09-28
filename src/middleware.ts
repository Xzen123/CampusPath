import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/opportunities'];
const LOGIN_ROUTE = '/login';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('campus_path_session');
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    }
    
    try {
        const session = JSON.parse(sessionCookie.value);
        if (new Date(session.expires) < new Date()) {
            const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
            response.cookies.delete('campus_path_session');
            return response;
        }
    } catch {
        const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
        response.cookies.delete('campus_path_session');
        return response;
    }

  }

  if (pathname === LOGIN_ROUTE && sessionCookie) {
    try {
        const session = JSON.parse(sessionCookie.value);
        if (new Date(session.expires) > new Date()) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } catch {
      // Invalid cookie, let them proceed to login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
