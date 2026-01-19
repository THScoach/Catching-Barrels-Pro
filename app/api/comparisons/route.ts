import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user ID from email (since session might not have ID depending on config)
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json()
    const { swingId, proModelId, notes } = body

    try {
        const comparison = await prisma.comparison.create({
            data: {
                userId: user.id,
                swingId,
                proModelId,
                notes,
            },
            include: {
                swing: true,
                proModel: true,
            }
        })

        return NextResponse.json({ comparison })
    } catch (error) {
        console.error('Error creating comparison:', error);
        return NextResponse.json(
            { error: 'Failed to create comparison' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
        const comparisons = await prisma.comparison.findMany({
            where: { userId: user.id },
            include: {
                swing: true,
                proModel: true,
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ comparisons })
    } catch (error) {
        console.error('Error fetching comparisons:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comparisons' },
            { status: 500 }
        )
    }
}
