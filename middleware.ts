import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Allow public routes
    if (
        pathname.startsWith('/auth/login') ||
        pathname.startsWith('/auth/signup') ||
        pathname.startsWith('/signup') || // Allow new signup landing page
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/api/signup') ||
        pathname === '/' // Landing page
    ) {
        return NextResponse.next();
    }

    // Require authentication
    const token = await getToken({ req: request });

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // We can't use Prisma in middleware (Edge runtime), so we rely on the token
    // Ensure token has the necessary fields (we added them in lib/auth.ts)
    const role = token.role as string;
    const firstLoginCompleted = token.firstLoginCompleted as boolean;

    // ATHLETE - First login flow
    if (
        role === 'athlete' &&
        !firstLoginCompleted &&
        !pathname.startsWith('/complete-profile') &&
        !pathname.startsWith('/api/complete-profile') // Allow API route
    ) {
        return NextResponse.redirect(new URL('/complete-profile', request.url));
    }

    // PARENT - Can't access athlete routes
    if (
        role === 'parent' &&
        (pathname.startsWith('/dashboard') || pathname.startsWith('/add-swing'))
    ) {
        return NextResponse.redirect(new URL('/parent-dashboard', request.url));
    }

    // ATHLETE - Can't access parent routes
    if (
        role === 'athlete' &&
        (pathname.startsWith('/parent-dashboard') || pathname.startsWith('/create-athlete'))
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
};
