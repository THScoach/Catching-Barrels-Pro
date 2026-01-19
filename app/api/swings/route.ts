import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const swings = await prisma.swingVideo.findMany({
            where: {
                lesson: {
                    userId: session.user.id
                }
            },
            include: {
                swingMetrics: true
            },
            orderBy: {
                uploadedAt: 'desc'
            },
            take: 50
        });

        // Map to simpler format if needed, or return as is
        // ModelOverlay expects: id, videoUrl, overallScore, uploadedAt
        // plus we need metrics for comparison
        const formattedSwings = swings.map(swing => ({
            id: swing.id,
            videoUrl: swing.videoUrl,
            uploadedAt: swing.uploadedAt,
            overallScore: swing.swingMetrics?.overallScore || 0,
            swingMetrics: swing.swingMetrics // Pass full metrics for comparison
        }));

        return NextResponse.json({ swings: formattedSwings });
    } catch (error) {
        console.error("Fetch swings error:", error);
        return NextResponse.json({ error: "Failed to fetch swings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            date,
            exitVelocity,
            launchAngle,
            batSpeed,
            notes,
            // New Scores
            overallScore,
            barrelScore,
            groundScore,
            coreScore,
            whipScore
        } = body;

        // Basic validation
        if (!date) {
            return NextResponse.json({ error: "Date is required" }, { status: 400 });
        }

        if (!session.user.id) {
            return NextResponse.json({ error: "User ID missing" }, { status: 401 });
        }

        // 1. Create a placeholder SwingVideo record
        // We use a placeholder URL to indicate this is a manual entry
        // 1. Create a completed lesson for this manual swing
        const lesson = await prisma.lesson.create({
            data: {
                userId: session.user.id,
                name: "Manual Session",
                sessionType: "practice",
                status: "completed",
                totalSwings: 1,
                completedAt: new Date(date),
                createdAt: new Date(date),
                overallScore: parseFloat(overallScore) || null,
                barrelScore: parseFloat(barrelScore) || null,
                groundScore: parseFloat(groundScore) || null,
                coreScore: parseFloat(coreScore) || null,
                whipScore: parseFloat(whipScore) || null,
                avgExitVelo: parseFloat(exitVelocity) || null,
                avgBatSpeed: parseFloat(batSpeed) || null,
                avgLaunchAngle: parseFloat(launchAngle) || null,
            }
        });

        // 2. Create the SwingVideo record linked to the lesson
        const swingVideo = await prisma.swingVideo.create({
            data: {
                lessonId: lesson.id,
                videoUrl: "manual-entry",
                uploadedAt: new Date(date), // Use the user-provided date
                analyzedAt: new Date(), // It's "analyzed" immediately since we have metrics
                swingNumber: 1,
                swingMetrics: {
                    create: {
                        exitVelocity: parseFloat(exitVelocity) || null,
                        launchAngle: parseFloat(launchAngle) || null,
                        batSpeed: parseFloat(batSpeed) || null,
                        notes: notes || null,
                        // New Scores
                        overallScore: parseFloat(overallScore) || null,
                        barrelScore: parseFloat(barrelScore) || null,
                        groundScore: parseFloat(groundScore) || null,
                        coreScore: parseFloat(coreScore) || null,
                        whipScore: parseFloat(whipScore) || null,
                    },
                },
            },
            include: {
                swingMetrics: true,
            },
        });

        return NextResponse.json(swingVideo);
    } catch (error) {
        console.error("Manual swing entry error:", error);
        return NextResponse.json(
            { error: "Failed to save swing data" },
            { status: 500 }
        );
    }
}
