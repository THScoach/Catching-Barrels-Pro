import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function LessonDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/auth/login");

    const lesson = await prisma.lesson.findUnique({
        where: { id: params.id },
        include: {
            user: { select: { name: true, email: true } },
            swingVideos: {
                include: {
                    swingMetrics: true,
                    sensorSwing: true
                },
                orderBy: { swingNumber: "asc" },
            },
        },
    });

    if (!lesson) notFound();

    const isActive = lesson.status === "active";
    const canAddSwings = isActive && lesson.totalSwings < 15;

    return (
        <div className="min-h-screen bg-cb-dark">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Back Link */}
                <Link
                    href={isActive ? "/dashboard" : "/history"}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to {isActive ? "Dashboard" : "History"}
                </Link>

                {/* Lesson Header */}
                <div className="bg-cb-dark-card rounded-2xl p-8 mb-6 border border-cb-dark-accent">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">{lesson.name}</h1>
                                {isActive ? (
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full border border-green-500/30">
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm font-medium rounded-full border border-gray-500/30">
                                        Completed
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400">
                                {new Date(lesson.createdAt).toLocaleDateString()} • {lesson.sessionType} • {lesson.totalSwings}/15 swings
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4 md:mt-0">
                            {isActive && (
                                <>
                                    {canAddSwings && (
                                        <Link
                                            href={`/lesson/${lesson.id}/add-swing`}
                                            className="px-6 py-3 bg-cb-gold text-cb-dark font-bold rounded-lg hover:bg-cb-gold-dark transition-all shadow-lg"
                                        >
                                            ➕ Add Swing ({15 - lesson.totalSwings} left)
                                        </Link>
                                    )}
                                    <form action="/api/lesson/end" method="POST">
                                        <input type="hidden" name="lessonId" value={lesson.id} />
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                                            disabled={lesson.totalSwings === 0}
                                        >
                                            🏁 End Lesson
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Active Lesson Warning */}
                    {isActive && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                            <div className="flex gap-3">
                                <div className="text-xl">💡</div>
                                <div className="text-sm text-blue-400">
                                    This lesson is still active. Add up to {15 - lesson.totalSwings} more swings, then click "End Lesson" when you're done to calculate your scores.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary Scores (Only for completed lessons) */}
                    {!isActive && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <ScoreSummary label="Barrel" score={lesson.barrelScore} />
                            <ScoreSummary label="Ground" score={lesson.groundScore} />
                            <ScoreSummary label="Core" score={lesson.coreScore} />
                            <ScoreSummary label="Whip" score={lesson.whipScore} />
                        </div>
                    )}

                    {/* Stats (Only for completed lessons) */}
                    {!isActive && (
                        <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-cb-dark-accent">
                            <div>
                                <div className="text-sm text-gray-400">Avg Exit Velocity</div>
                                <div className="text-2xl font-bold text-white">{lesson.avgExitVelo?.toFixed(1) || "--"} mph</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Avg Bat Speed</div>
                                <div className="text-2xl font-bold text-white">{lesson.avgBatSpeed?.toFixed(1) || "--"} mph</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">Avg Launch Angle</div>
                                <div className="text-2xl font-bold text-white">{lesson.avgLaunchAngle?.toFixed(1) || "--"}°</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Individual Swings */}
                <h2 className="text-2xl font-bold text-white mb-4">
                    {isActive ? "Uploaded Swings" : "Individual Swings"}
                </h2>

                {lesson.swingVideos.length === 0 ? (
                    <div className="bg-cb-dark-card rounded-xl p-12 border border-cb-dark-accent text-center">
                        <div className="text-6xl mb-4">⚾</div>
                        <h3 className="text-xl font-bold text-white mb-2">No Swings Yet</h3>
                        <p className="text-gray-400 mb-6">Upload your first swing to get started</p>
                        {canAddSwings && (
                            <Link
                                href={`/lesson/${lesson.id}/add-swing`}
                                className="inline-block px-8 py-4 bg-cb-gold text-cb-dark font-bold rounded-xl hover:bg-cb-gold-dark transition-all"
                            >
                                Upload First Swing
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {lesson.swingVideos.map((swing, index) => (
                            <div
                                key={swing.id}
                                className="bg-cb-dark-card rounded-xl p-6 border border-cb-dark-accent"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Video Thumbnail */}
                                    <div className="w-full md:w-48 h-32 bg-cb-dark rounded-lg overflow-hidden relative">
                                        {/* Placeholder for video thumbnail if needed, or actual video element */}
                                        <video
                                            src={swing.videoUrl}
                                            className="w-full h-full object-cover"
                                            controls={false}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="text-white text-3xl opacity-80">▶</span>
                                        </div>
                                    </div>

                                    {/* Swing Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">Swing #{swing.swingNumber || index + 1}</h3>
                                                <p className="text-sm text-gray-400">
                                                    {swing.timestamp ? new Date(swing.timestamp).toLocaleTimeString() : "No timestamp"}
                                                </p>
                                            </div>
                                            {/* Processing Badge */}
                                            {swing.sensorSwing?.rebootJobId && !swing.sensorSwing?.batScore ? (
                                                <div className="flex items-center gap-2 text-cb-yellow">
                                                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                                                    <span className="font-bold text-sm">Processing...</span>
                                                </div>
                                            ) : (
                                                swing.swingMetrics?.overallScore && (
                                                    <div className="text-2xl font-bold text-cb-gold">
                                                        {Math.round(swing.swingMetrics.overallScore)}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {swing.swingMetrics && (
                                            <div className="grid grid-cols-3 gap-3 text-sm">
                                                <div>
                                                    <span className="text-gray-400">EV:</span>
                                                    <span className="text-white ml-1">{Math.round(swing.swingMetrics.exitVelocity || 0)} mph</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">LA:</span>
                                                    <span className="text-white ml-1">{Math.round(swing.swingMetrics.launchAngle || 0)}°</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">BS:</span>
                                                    <span className="text-white ml-1">{Math.round(swing.swingMetrics.batSpeed || 0)} mph</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-4">
                                            <Link
                                                href={`/lesson/${lesson.id}/swing/${swing.id}`} // Note: This page might not exist yet, but linking for future
                                                className="px-4 py-2 bg-cb-gold text-cb-dark rounded-lg hover:bg-cb-gold-dark transition-colors font-medium"
                                            >
                                                ▶ Play Video
                                            </Link>
                                            {!isActive && swing.swingMetrics && (
                                                <Link
                                                    href={`/lesson/${lesson.id}/swing/${swing.id}`}
                                                    className="px-4 py-2 bg-cb-dark-accent text-white rounded-lg hover:bg-cb-dark transition-colors"
                                                >
                                                    📊 View Metrics
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
}

function ScoreSummary({ label, score }: { label: string; score?: number | null }) {
    return (
        <div className="text-center p-4 bg-cb-dark rounded-lg">
            <div className="text-sm text-gray-400 mb-1">{label}</div>
            <div className="text-3xl font-bold text-white">{score ? Math.round(score) : "--"}</div>
        </div>
    );
}
