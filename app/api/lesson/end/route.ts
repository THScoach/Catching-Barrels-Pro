import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { calculateLessonScores } from "@/lib/scoreCalculations";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const lessonId = formData.get("lessonId") as string;

        // Get lesson with all swings and metrics
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                swingVideos: {
                    include: { swingMetrics: true },
                },
            },
        });

        if (!lesson) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
        }

        if (lesson.status !== "active") {
            return NextResponse.json({ error: "Lesson is already completed" }, { status: 400 });
        }

        if (lesson.swingVideos.length === 0) {
            return NextResponse.json({ error: "Cannot end lesson with no swings" }, { status: 400 });
        }

        // Calculate aggregate scores from all swings
        const scores = calculateLessonScores(lesson.swingVideos);

        // Update lesson to completed status
        await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                status: "completed",
                completedAt: new Date(),
                overallScore: scores.overallScore,
                barrelScore: scores.barrelScore,
                groundScore: scores.groundScore,
                coreScore: scores.coreScore,
                whipScore: scores.whipScore,
                avgExitVelo: scores.avgExitVelo,
                avgBatSpeed: scores.avgBatSpeed,
                avgLaunchAngle: scores.avgLaunchAngle,
            },
        });

        return NextResponse.redirect(new URL(`/lesson/${lessonId}`, request.url));
    } catch (error) {
        console.error("End lesson error:", error);
        return NextResponse.json(
            { error: "Failed to end lesson" },
            { status: 500 }
        );
    }
}
