import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const players = await prisma.proModel.findMany({
            orderBy: { createdAt: 'desc' },
            // Removed rebootSessions count as relation is removed
        });

        return NextResponse.json({ players });
    } catch (error) {
        console.error('Error fetching players:', error);
        return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Calculate overall score if individual scores are provided
        let overallScore = data.overallScore;
        if (!overallScore && data.anchorScore && data.coreScore && data.whipScore) {
            overallScore = (data.anchorScore + data.coreScore + data.whipScore) / 3;
        }

        const player = await prisma.proModel.create({
            data: {
                name: data.name,
                team: data.team,
                position: data.position,
                handedness: data.handedness,
                anchorScore: data.anchorScore,
                coreScore: data.coreScore,
                whipScore: data.whipScore,
                overallScore: overallScore,
                isProModel: data.isProModel ?? true,
                featured: data.featured ?? false,
                thumbnailUrl: data.thumbnailUrl,
                videoUrl: data.videoUrl,
                description: data.notes, // Mapping notes to description
            }
        });

        return NextResponse.json(player);
    } catch (error) {
        console.error('Error creating player:', error);
        return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
    }
}
