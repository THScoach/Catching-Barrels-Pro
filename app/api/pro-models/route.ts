import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const handedness = searchParams.get('handedness')
    const featured = searchParams.get('featured')

    try {
        const proModels = await prisma.proModel.findMany({
            where: {
                ...(handedness && { handedness }),
                ...(featured === 'true' && { featured: true }),
            },
            orderBy: [
                { featured: 'desc' },
                { name: 'asc' }
            ]
        })

        return NextResponse.json({ proModels })
    } catch (error) {
        console.error('Error fetching pro models:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pro models' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    // Admin only - add new pro model
    // TODO: Add admin check
    const body = await request.json()

    try {
        const proModel = await prisma.proModel.create({
            data: {
                name: body.name,
                position: body.position,
                team: body.team,
                handedness: body.handedness,
                videoUrl: body.videoUrl,
                thumbnailUrl: body.thumbnailUrl,
                anchorScore: body.anchorScore,
                coreScore: body.coreScore,
                whipScore: body.whipScore,
                barrelScore: body.barrelScore,
                overallScore: body.overallScore,
                description: body.description,
                tags: body.tags || [],
                featured: body.featured || false,
            }
        })

        return NextResponse.json({ proModel })
    } catch (error) {
        console.error('Error creating pro model:', error);
        return NextResponse.json(
            { error: 'Failed to create pro model' },
            { status: 500 }
        )
    }
}
