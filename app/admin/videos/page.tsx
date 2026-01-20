import { prisma } from "@/lib/prisma";
import VideoDashboardClient from "./video-dashboard";

export const dynamic = 'force-dynamic';

export default async function AdminVideosPage() {
    // Fetch all videos, ordered by newest first
    const videos = await prisma.videoLibraryItem.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return <VideoDashboardClient initialVideos={videos} />;
}
