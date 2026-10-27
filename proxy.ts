import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_ROUTES = [
  '/main',
  '/documents',
  '/projects',
  '/trash',
  '/join',
  '/search',
  '/settings',
  '/calendar',
];

const REFRESH_COOKIE_NAME = 'refreshToken';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(REFRESH_COOKIE_NAME)?.value);
  const isPrivate = PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Если приватный маршрут, а cookie нет — редирект на логин
  if (isPrivate && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(url);
  }

  // Если пользователь авторизован, но идет на /login — редирект на /main
  if (hasSession && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/main';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
