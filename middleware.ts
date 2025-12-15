import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPage = pathname === '/' || pathname === '/home' || pathname === '/internships' || pathname.startsWith('/internships/') || pathname.startsWith('/auth');

  // Allow all public pages freely
  if (isPublicPage) {
    return NextResponse.next();
  }

  // For all other pages, let the frontend handle authentication
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
