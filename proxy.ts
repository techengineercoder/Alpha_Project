import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a basic middleware to demonstrate role-based routing protection
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // In a real app, extract role from token
  // const token = await getToken({ req: request });
  // const role = token?.role;

  // Example: basic protection for dashboard routes
  if (path.startsWith('/artist') /* && role !== 'artist' */) {
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
