import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a basic middleware to demonstrate role-based routing protection
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);

  // In a real app, extract role from token
  // const token = await getToken({ req: request });
  // const role = token?.role;

  // Example: basic protection for dashboard routes
  if (path.startsWith('/artist') /* && role !== 'artist' */) {
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/assets in public folder (extensions like png, jpg, svg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)).*)",
  ],
};
