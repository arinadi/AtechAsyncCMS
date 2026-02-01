import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const session = req.auth;

    // Setup page - only accessible if no users exist (handled in page)
    if (pathname === '/setup') {
        return NextResponse.next();
    }

    // Login page - redirect to dashboard if already logged in
    if (pathname === '/login') {
        if (session?.user) {
            if (session.user.status === 'pending') {
                return NextResponse.redirect(new URL('/complete-profile', req.nextUrl));
            }
            return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
        }
        return NextResponse.next();
    }

    // Complete profile page - only for pending users
    if (pathname === '/complete-profile') {
        if (!session?.user) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        if (session.user.status === 'active') {
            return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
        }
        return NextResponse.next();
    }

    // Admin routes - require active auth
    if (pathname.startsWith('/admin')) {
        if (!session?.user) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        if (session.user.status === 'pending') {
            return NextResponse.redirect(new URL('/complete-profile', req.nextUrl));
        }
        if (session.user.status !== 'active') {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/admin/:path*',
        '/login',
        '/setup',
        '/complete-profile',
    ],
};
