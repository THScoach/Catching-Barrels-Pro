import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HistoryPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/auth/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            lessons: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!user) redirect("/auth/login");

    return (
        <div className="min-h-screen bg-cb-dark">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Lesson History</h1>
                    <p className="text-gray-400">Track your progress over time</p>
                </div>

                {/* Filters */}
                <div className="bg-cb-dark-card rounded-xl p-4 mb-6 border border-cb-dark-accent flex gap-4">
                    <select className="px-4 py-2 bg-cb-dark border border-cb-dark-accent text-white rounded-lg">
                        <option>All Time</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                    </select>
                    <select className="px-4 py-2 bg-cb-dark border border-cb-dark-accent text-white rounded-lg">
                        <option>All Types</option>
                        <option>Live BP</option>
                        <option>Tee Work</option>
                        <option>Games</option>
                    </select>
                </div>

                {/* Lessons List */}
                <div className="space-y-4">
                    {user.lessons.length === 0 ? (
                        <div className="bg-cb-dark-card rounded-2xl p-12 border border-cb-dark-accent text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <h2 className="text-2xl font-bold text-white mb-2">No Lessons Yet</h2>
                            <p className="text-gray-400 mb-6">Create your first lesson to start tracking progress</p>
                            <Link
                                href="/new-lesson"
                                className="inline-block px-8 py-4 bg-cb-gold text-cb-dark font-bold rounded-xl hover:bg-cb-gold-dark transition-all"
                            >
                                Create First Lesson
                            </Link>
                        </div>
                    ) : (
                        user.lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="bg-cb-dark-card rounded-xl p-6 border border-cb-dark-accent hover:border-cb-gold transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{lesson.name}</h3>
                                        <p className="text-sm text-gray-400">
                                            {new Date(lesson.createdAt).toLocaleDateString()} • {lesson.sessionType} • {lesson.totalSwings} swings
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-400 mb-1">Overall Score</div>
                                        <div className="text-3xl font-bold text-cb-gold">
                                            {lesson.overallScore ? Math.round(lesson.overallScore) : "--"}
                                        </div>
                                    </div>
                                </div>

                                {/* 4 Scores */}
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">Barrel</div>
                                        <div className="text-lg font-bold text-white">{lesson.barrelScore ? Math.round(lesson.barrelScore) : "--"}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">Ground</div>
                                        <div className="text-lg font-bold text-white">{lesson.groundScore ? Math.round(lesson.groundScore) : "--"}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">Core</div>
                                        <div className="text-lg font-bold text-white">{lesson.coreScore ? Math.round(lesson.coreScore) : "--"}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">Whip</div>
                                        <div className="text-lg font-bold text-white">{lesson.whipScore ? Math.round(lesson.whipScore) : "--"}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        href={`/lesson/${lesson.id}`}
                                        className="flex-1 px-4 py-2 bg-cb-gold text-cb-dark text-center font-medium rounded-lg hover:bg-cb-gold-dark transition-colors"
                                    >
                                        View Details
                                    </Link>
                                    <button className="px-4 py-2 bg-cb-dark-accent text-white rounded-lg hover:bg-cb-dark transition-colors">
                                        Download Data
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </main>
        </div>
    );
}
