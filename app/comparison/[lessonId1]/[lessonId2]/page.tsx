import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ComparisonPlayer } from "@/components/comparison/ComparisonPlayer";
import { MetricsDiff } from "@/components/comparison/MetricsDiff";
import { ImprovementHighlight } from "@/components/comparison/ImprovementHighlight";
import { generateComparisonInsights } from "@/lib/comparison/generateInsights";

export default async function ComparisonDetailPage({
    params,
}: {
    params: { lessonId1: string; lessonId2: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/auth/login");

    const [lesson1, lesson2] = await Promise.all([
        prisma.lesson.findUnique({
            where: { id: params.lessonId1 },
            include: {
                swingVideos: {
                    include: { swingMetrics: true },
                    take: 1,
                },
            },
        }),
        prisma.lesson.findUnique({
            where: { id: params.lessonId2 },
            include: {
                swingVideos: {
                    include: { swingMetrics: true },
                    take: 1,
                },
            },
        }),
    ]);

    if (!lesson1 || !lesson2) notFound();

    // Generate AI insights
    const insights = generateComparisonInsights(lesson1, lesson2);

    // Save comparison
    await prisma.comparison.create({
        data: {
            userId: lesson1.userId,
            lessonId1: lesson1.id,
            lessonId2: lesson2.id,
            insights: insights.summary,
            improvements: insights.improvements,
            regressions: insights.regressions,
            recommendedDrills: insights.drillIds,
        },
    });

    return (
        <div className="min-h-screen bg-cb-dark">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Swing Comparison
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400">
                        <span>{lesson1.name}</span>
                        <span>vs</span>
                        <span>{lesson2.name}</span>
                    </div>
                </div>

                {/* Video Comparison */}
                <ComparisonPlayer
                    video1={lesson1.swingVideos[0]?.videoUrl}
                    video2={lesson2.swingVideos[0]?.videoUrl}
                />

                {/* Improvement Highlights */}
                <ImprovementHighlight
                    improvements={insights.improvements}
                    regressions={insights.regressions}
                />

                {/* Metrics Comparison */}
                <MetricsDiff lesson1={lesson1} lesson2={lesson2} />

                {/* AI Insights */}
                <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-cb-gold flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🤖</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                                Coach Rick's Analysis
                            </h3>
                            <p className="text-gray-300 whitespace-pre-wrap">
                                {insights.summary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recommended Drills */}
                {insights.drillIds.length > 0 && (
                    <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Recommended Drills
                        </h3>
                        <div className="text-gray-400">
                            Drill recommendations coming in Week 2...
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
