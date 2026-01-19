import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create parent account
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'parent',
                profileCompleted: true, // Parents don't need physical attributes
                firstLoginCompleted: true,
            },
        });

        return NextResponse.redirect(new URL('/auth/login?signup=success', request.url));
    } catch (error) {
        console.error('Parent signup error:', error);
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}
