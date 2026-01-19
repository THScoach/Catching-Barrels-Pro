import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewLessonPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/auth/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            lessons: {
                where: { status: "active" },
                take: 1,
            },
        },
    });

    if (!user) redirect("/auth/login");

    // Check if user already has an active lesson
    const activeLesson = user.lessons[0];

    // If there's an active lesson, redirect to it
    if (activeLesson) {
        redirect(`/lesson/${activeLesson.id}`);
    }

    return (
        <div className="min-h-screen bg-cb-dark">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Start New Lesson</h1>
                    <p className="text-gray-400">Create a new training session (up to 15 swings)</p>
                </div>

                <form action="/api/lesson/create" method="POST" className="space-y-6">

                    {/* Lesson Details */}
                    <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent">
                        <h2 className="text-xl font-bold text-white mb-4">Lesson Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Lesson Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g., Live BP - Nov 30, 2024"
                                    className="w-full px-4 py-3 bg-cb-dark border border-cb-dark-accent text-white rounded-lg focus:ring-2 focus:ring-cb-gold focus:border-cb-gold"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Session Type *
                                </label>
                                <select
                                    name="sessionType"
                                    required
                                    className="w-full px-4 py-3 bg-cb-dark border border-cb-dark-accent text-white rounded-lg focus:ring-2 focus:ring-cb-gold focus:border-cb-gold"
                                >
                                    <option value="bp">Live BP</option>
                                    <option value="tee">Tee Work</option>
                                    <option value="soft-toss">Soft Toss</option>
                                    <option value="game">Game</option>
                                    <option value="machine">Machine</option>
                                    <option value="practice">Practice</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                        <div className="flex gap-3">
                            <div className="text-2xl">ℹ️</div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-400 mb-2">How Lessons Work</h3>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    <li>• After creating this lesson, you'll be able to upload up to 15 swings</li>
                                    <li>• Add swings one at a time or in batches during your training session</li>
                                    <li>• When you're done, click "End Lesson" to complete and analyze</li>
                                    <li>• You can only have one active lesson at a time</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 px-8 py-4 bg-cb-gold text-cb-dark font-bold rounded-xl hover:bg-cb-gold-dark transition-all shadow-lg"
                        >
                            Start Lesson
                        </button>
                        <Link
                            href="/dashboard"
                            className="px-8 py-4 bg-cb-dark-accent text-white font-medium rounded-xl hover:bg-cb-dark transition-colors text-center"
                        >
                            Cancel
                        </Link>
                    </div>

                </form>

            </main>
        </div>
    );
}
