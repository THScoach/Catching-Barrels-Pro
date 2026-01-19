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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                lessons: {
                    where: { status: "active" },
                    take: 1,
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user already has an active lesson
        if (user.lessons.length > 0) {
            return NextResponse.json(
                { error: "You already have an active lesson. Please end it before starting a new one." },
                { status: 400 }
            );
        }

        // Check subscription tier limits
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const completedLessonsThisWeek = await prisma.lesson.count({
            where: {
                userId: user.id,
                status: "completed",
                completedAt: {
                    gte: oneWeekAgo,
                },
            },
        });

        const subscriptionLimits = {
            basic: 1,
            pro: 2,
            elite: 999999, // Unlimited
        };

        const limit = subscriptionLimits[user.subscriptionTier as keyof typeof subscriptionLimits] || 1;

        if (completedLessonsThisWeek >= limit) {
            return NextResponse.json(
                {
                    error: `You've reached your ${user.subscriptionTier} plan limit of ${limit} lesson(s) per week. Upgrade to add more lessons.`,
                    upgradeRequired: true,
                },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const name = formData.get("name") as string;
        const sessionType = formData.get("sessionType") as string;

        // Create ACTIVE lesson
        const lesson = await prisma.lesson.create({
            data: {
                userId: user.id,
                name,
                sessionType,
                status: "active",
                totalSwings: 0,
            },
        });

        return NextResponse.redirect(new URL(`/lesson/${lesson.id}`, request.url));
    } catch (error) {
        console.error("Lesson creation error:", error);
        return NextResponse.json(
            { error: "Failed to create lesson" },
            { status: 500 }
        );
    }
}
