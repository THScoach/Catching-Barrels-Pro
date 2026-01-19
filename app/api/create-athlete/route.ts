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

        const parent = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!parent || parent.role !== 'parent') {
            return NextResponse.json(
                { error: 'Only parents can create athlete profiles' },
                { status: 403 }
            );
        }

        const formData = await request.formData();

        // Check if athlete email already exists
        const existingAthlete = await prisma.user.findUnique({
            where: { email: formData.get('athleteEmail') as string },
        });

        if (existingAthlete) {
            return NextResponse.json(
                { error: 'Email already in use' },
                { status: 400 }
            );
        }

        // Hash temporary password
        const hashedPassword = await bcrypt.hash(
            formData.get('athletePassword') as string,
            10
        );

        // Create athlete account
        await prisma.user.create({
            data: {
                email: formData.get('athleteEmail') as string,
                password: hashedPassword,
                name: formData.get('athleteName') as string,
                role: 'athlete',
                parentId: parent.id,

                // Physical attributes
                birthDate: new Date(formData.get('birthDate') as string),
                height: parseFloat(formData.get('height') as string),
                weight: parseFloat(formData.get('weight') as string),
                position: (formData.get('position') as string) || null,
                stance: (formData.get('stance') as string) || null,
                batHand: (formData.get('batHand') as string) || null,
                throwHand: (formData.get('throwHand') as string) || null,

                // Profile flags
                profileCompleted: false, // Athlete must verify on first login
                firstLoginCompleted: false,
                mustChangePassword: true,
            },
        });

        return NextResponse.redirect(new URL('/parent-dashboard', request.url));
    } catch (error) {
        console.error('Create athlete error:', error);
        return NextResponse.json(
            { error: 'Failed to create athlete profile' },
            { status: 500 }
        );
    }
}
