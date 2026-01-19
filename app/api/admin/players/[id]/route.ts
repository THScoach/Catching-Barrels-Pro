import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // Calculate overall score if individual scores are provided
        let overallScore = body.overallScore;
        if (!overallScore && body.anchorScore && body.coreScore && body.whipScore) {
            overallScore = (body.anchorScore + body.coreScore + body.whipScore) / 3;
        }

        const updated = await prisma.proModel.update({
            where: { id: params.id },
            data: {
                name: body.name,
                team: body.team,
                position: body.position,
                handedness: body.handedness,
                anchorScore: body.anchorScore,
                coreScore: body.coreScore,
                whipScore: body.whipScore,
                overallScore: overallScore,
                isProModel: body.isProModel,
                featured: body.featured,
                thumbnailUrl: body.thumbnailUrl,
                videoUrl: body.videoUrl,
            }
        });

        return NextResponse.json({ success: true, player: updated });
    } catch (error) {
        console.error('Error updating player:', error);
        return NextResponse.json({ error: 'Failed to update player' }, { status: 500 });
    }
}
