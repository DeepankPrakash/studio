import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('user_email')
  const { pathname } = request.nextUrl

  // If user is logged in, and tries to access login/register, redirect to app
  if (cookie && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/app/generate', request.url))
  }
  
  // If user is not logged in and tries to access app, redirect to login
  if (!cookie && pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
