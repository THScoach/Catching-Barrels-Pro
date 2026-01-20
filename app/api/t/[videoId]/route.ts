import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { videoId: string } }) {
    try {
        const { videoId } = params;
        const url = new URL(req.url);
        const userId = url.searchParams.get("u") || null; // Optional User ID tracking

        // 1. Fetch Video to get Destination URL
        const video = await prisma.videoLibraryItem.findUnique({
            where: { id: videoId }
        });

        if (!video || !video.videoUrl) {
            return new NextResponse("Video Not Found", { status: 404 });
        }

        // 2. Log Engagement (Fire & Forget)
        prisma.videoEngagement.create({
            data: {
                videoId: videoId,
                userId: userId,
                viewedAt: new Date()
            }
        }).catch(e => console.error("Tracking Error", e));

        // 3. Redirect
        return NextResponse.redirect(video.videoUrl);

    } catch (error) {
        console.error("[Tracking Error]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
