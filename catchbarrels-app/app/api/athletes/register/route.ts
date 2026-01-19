import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validate required fields
        if (!data.firstName || !data.lastName || !data.parentEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log('📝 Registering athlete:', data.firstName, data.lastName);

        // Create athlete
        const athlete = await prisma.athlete.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email || null,
                dateOfBirth: new Date(data.dateOfBirth),
                height: data.height ? parseFloat(data.height) : null,
                weight: data.weight ? parseFloat(data.weight) : null,
                handedness: data.handedness || null,
                position: data.position || null,
                program: data.program || 'Augusta',
                teamName: data.teamName || null,
                season: data.season || 'Winter 2025',
                parentName: data.parentName,
                parentEmail: data.parentEmail,
                parentPhone: data.parentPhone,
                status: 'active'
            }
        });

        console.log('✅ Athlete created:', athlete.id);

        // TODO: Send confirmation email to parent (future)

        return NextResponse.json({
            success: true,
            athlete: {
                id: athlete.id,
                name: `${athlete.firstName} ${athlete.lastName}`
            }
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed: ' + error.message },
            { status: 500 }
        );
    }
}
