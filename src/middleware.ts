import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the Firebase auth token from cookie (set after sign-in)
  const authToken = request.cookies.get('firebase-auth-token')?.value;
  
  // For now, we'll do client-side auth checks for better UX
  // Middleware runs on Edge Runtime and can't use Firebase Auth directly
  // Instead, we'll check for a session cookie that we'll set on sign-in
  
  const isAuthenticated = !!authToken;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/onboarding'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
  // Auth routes (login page for unauthenticated users)
  // Note: Don't include '/' as auth route to prevent redirect loops
  const authRoutes = ['/login'];
  const isAuthRoute = authRoutes.some(route => pathname === route || pathname.startsWith(route));

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login page to dashboard
  // Don't redirect from '/' to prevent loops - let the home page handle it
  if (isAuthRoute && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/login',
    '/',
  ],
};
