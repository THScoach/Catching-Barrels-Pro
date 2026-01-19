import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();

        // Validate password match
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user profile
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                password: hashedPassword,
                height: parseFloat(formData.get('height') as string),
                weight: parseFloat(formData.get('weight') as string),
                birthDate: new Date(formData.get('birthDate') as string),

                firstLoginCompleted: true,
                profileCompleted: true,
                profileCompletedAt: new Date(),
                mustChangePassword: false,
            },
        });

        return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
        console.error('Complete profile error:', error);
        return NextResponse.json(
            { error: 'Failed to complete profile' },
            { status: 500 }
        );
    }
}
