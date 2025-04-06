import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;
  
  // Check if the request is for an admin page (except admin login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check if user has an authentication token - check both token and authToken for compatibility
    const token = request.cookies.get('token')?.value || request.cookies.get('authToken')?.value;
    
    // If no token, redirect to admin login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  
  // For the main admin endpoint, ensure they don't just access it directly
  if (pathname === '/admin' || pathname === '/admin/') {
    // Check if user has an authentication token
    const token = request.cookies.get('token')?.value || request.cookies.get('authToken')?.value;
    
    // If no token, redirect to admin login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

// Only run middleware on admin routes
export const config = {
  matcher: ['/admin/:path*'],
}; 