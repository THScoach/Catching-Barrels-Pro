import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const athletes = await prisma.athlete.findMany({
            orderBy: {
                registeredAt: 'desc'
            },
            include: {
                _count: {
                    select: { swings: true }
                }
            }
        });

        return NextResponse.json({ athletes });
    } catch (error: any) {
        console.error('Error listing athletes:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
