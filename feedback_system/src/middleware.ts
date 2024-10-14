import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

// Middleware to handle redirects based on token presence
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }); // Get the token to check authentication status
  const url = request.nextUrl;

  // If token exists and user is accessing sign-in, sign-up, or root, redirect them to dashboard
  if (
    token && (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/' // Root path check
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If no token, redirect users trying to access protected pages to the home page
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Default behavior: Allow the request to go through
  return NextResponse.next();
}

// Configure matcher to apply middleware to specific routes
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/verify',
    '/dashboard/:path*', // Protect all dashboard routes
    '/' // Root path
  ],
};
