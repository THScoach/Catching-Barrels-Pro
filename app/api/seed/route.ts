import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    // 1. Ensure Test User Exists
    const password = await hash("password123", 10);
    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: { password },
      create: {
        email: "test@example.com",
        name: "Test Player",
        password,
        role: "player",
        playerProfile: {
          create: {
            position: "Shortstop",
            battingStance: "Right",
          },
        },
      },
    });

    // Clean up existing test data
    const existingUser = await prisma.user.findUnique({ where: { email: "test@catchbarrels.com" } });
    if (existingUser) {
      // Find swings for this user via lessons
      const swings = await prisma.swingVideo.findMany({
        where: {
          lesson: { userId: existingUser.id }
        }
      });
      const swingIds = swings.map(s => s.id);

      // Delete metrics first
      await prisma.swingMetrics.deleteMany({
        where: { swingVideoId: { in: swingIds } }
      });

      // Then delete videos
      await prisma.swingVideo.deleteMany({
        where: {
          lesson: { userId: existingUser.id }
        }
      });
    } // 3. Create 5 Sample Swings
    const swings = [
      {
        // Swing 1 (Elite)
        uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
        metrics: {
          exitVelocity: 98, launchAngle: 28, batSpeed: 74,
          barrelScore: 92, groundScore: 88, coreScore: 85, whipScore: 94, overallScore: 90,
          hardHitRate: 95, barrelRate: 25, squaredUpRate: 80, sweetSpotRate: 60,
          notes: "Elite session. Great rhythm.",
          sessionType: "game",
        }
      },
      {
        // Swing 2 (Good)
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        metrics: {
          exitVelocity: 95, launchAngle: 15, batSpeed: 72,
          barrelScore: 78, groundScore: 85, coreScore: 72, whipScore: 91, overallScore: 82,
          hardHitRate: 80, barrelRate: 15, squaredUpRate: 70, sweetSpotRate: 50,
          notes: "Solid contact but low launch angle.",
          sessionType: "bp",
        }
      },
      {
        // Swing 3 (Average)
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        metrics: {
          exitVelocity: 88, launchAngle: 22, batSpeed: 68,
          barrelScore: 68, groundScore: 72, coreScore: 65, whipScore: 75, overallScore: 70,
          hardHitRate: 50, barrelRate: 10, squaredUpRate: 60, sweetSpotRate: 40,
          notes: "Felt a bit off today.",
          sessionType: "tee",
        }
      },
      {
        // Swing 4 (Needs Work)
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        metrics: {
          exitVelocity: 85, launchAngle: 8, batSpeed: 66,
          barrelScore: 58, groundScore: 68, coreScore: 55, whipScore: 72, overallScore: 63,
          hardHitRate: 30, barrelRate: 5, squaredUpRate: 40, sweetSpotRate: 30,
          notes: "Working on lower half mechanics.",
          sessionType: "soft-toss",
        }
      },
      {
        // Swing 5 (Recent - Elite)
        uploadedAt: new Date(), // Today
        metrics: {
          exitVelocity: 102, launchAngle: 32, batSpeed: 77,
          barrelScore: 95, groundScore: 90, coreScore: 88, whipScore: 96, overallScore: 92,
          hardHitRate: 98, barrelRate: 30, squaredUpRate: 85, sweetSpotRate: 70,
          notes: "Best session yet! Crushed it.",
          sessionType: "game",
        }
      }
    ];

    for (const swing of swings) {
      // Create a completed lesson for this swing session
      const lesson = await prisma.lesson.create({
        data: {
          userId: user.id,
          name: `${swing.metrics.sessionType === 'bp' ? 'Batting Practice' : swing.metrics.sessionType.charAt(0).toUpperCase() + swing.metrics.sessionType.slice(1)} Session`,
          sessionType: swing.metrics.sessionType,
          status: "completed",
          totalSwings: 1,
          completedAt: swing.uploadedAt,
          createdAt: swing.uploadedAt,
          overallScore: swing.metrics.overallScore,
          barrelScore: swing.metrics.barrelScore,
          groundScore: swing.metrics.groundScore,
          coreScore: swing.metrics.coreScore,
          whipScore: swing.metrics.whipScore,
          avgExitVelo: swing.metrics.exitVelocity,
          avgBatSpeed: swing.metrics.batSpeed,
          avgLaunchAngle: swing.metrics.launchAngle,
        }
      });

      await prisma.swingVideo.create({
        data: {
          lessonId: lesson.id,
          videoUrl: "manual-entry",
          uploadedAt: swing.uploadedAt,
          analyzedAt: swing.uploadedAt,
          swingNumber: 1,
          swingMetrics: {
            create: swing.metrics
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Seed data created successfully" });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed", details: error.message }, { status: 500 });
  }
}
