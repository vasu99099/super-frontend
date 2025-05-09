import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PROTECTED_ROUTES, PUBLIC_ROUTES, ROUTE_PATH } from './constant/Routes';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.includes(path);
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
    const regexPath = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${regexPath}(/|$|\\?)`);
    return regex.test(path);
  });

  const cookie = (await cookies()).get('authToken')?.value;

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL(ROUTE_PATH.AUTH.LOGIN, req.nextUrl));
  }

  if (isPublicRoute && cookie && !req.nextUrl.pathname.startsWith(ROUTE_PATH.ADMIN.DASHBOARD)) {
    return NextResponse.redirect(new URL(ROUTE_PATH.ADMIN.DASHBOARD, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
