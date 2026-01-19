import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const lessonId = formData.get("lessonId") as string;
        const video = formData.get("video") as File;
        const notes = formData.get("notes") as string;

        // Get lesson
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                status: true,
                totalSwings: true,
            },
        });

        if (!lesson) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
        }

        if (lesson.status !== "active") {
            return NextResponse.json({ error: "Cannot add swings to completed lesson" }, { status: 400 });
        }

        if (lesson.totalSwings >= 15) {
            return NextResponse.json({ error: "Lesson is full (15 swings max)" }, { status: 400 });
        }

        // TODO: Upload video to storage (S3, Cloudflare R2, etc.)
        // For now, we'll just create a placeholder URL
        const videoUrl = `/uploads/${Date.now()}-${video.name}`;

        // Create swing video
        const swingVideo = await prisma.swingVideo.create({
            data: {
                lessonId,
                videoUrl,
                swingNumber: lesson.totalSwings + 1,
                timestamp: new Date(),
                notes: notes || null,
            },
        });

        // Update lesson swing count
        await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                totalSwings: { increment: 1 },
            },
        });

        // TODO: Trigger video analysis (AI/CV processing)
        // This would create SwingMetrics for this swing

        return NextResponse.redirect(new URL(`/lesson/${lessonId}`, request.url));
    } catch (error) {
        console.error("Swing upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload swing" },
            { status: 500 }
        );
    }
}
