import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export default async function AddSwingPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/auth/login");

    const lesson = await prisma.lesson.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            name: true,
            status: true,
            totalSwings: true,
        },
    });

    if (!lesson) notFound();
    if (lesson.status !== "active") redirect(`/lesson/${lesson.id}`);
    if (lesson.totalSwings >= 15) redirect(`/lesson/${lesson.id}`);

    const swingsRemaining = 15 - lesson.totalSwings;

    return (
        <div className="min-h-screen bg-cb-dark">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <Link
                    href={`/lesson/${lesson.id}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Lesson
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Add Swing</h1>
                    <p className="text-gray-400">{lesson.name} • {swingsRemaining} swings remaining</p>
                </div>

                <form action="/api/swing/upload" method="POST" encType="multipart/form-data" className="space-y-6">
                    <input type="hidden" name="lessonId" value={lesson.id} />

                    {/* Video Upload */}
                    <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent">
                        <h2 className="text-xl font-bold text-white mb-4">Upload Swing Video</h2>

                        <div className="border-2 border-dashed border-cb-dark-accent rounded-xl p-12 text-center">
                            <div className="text-6xl mb-4">📹</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Drag & Drop Video Here
                            </h3>
                            <p className="text-gray-400 mb-4">
                                or click to browse
                            </p>
                            <input
                                type="file"
                                name="video"
                                accept="video/*"
                                required
                                className="hidden"
                                id="video-upload"
                            />
                            <label
                                htmlFor="video-upload"
                                className="inline-block px-6 py-3 bg-cb-gold text-cb-dark font-medium rounded-lg cursor-pointer hover:bg-cb-gold-dark transition-colors"
                            >
                                Select Video
                            </label>
                            <p className="text-sm text-gray-500 mt-4">
                                Supported: .mp4, .mov, .avi (max 500MB)
                            </p>
                        </div>
                    </div>

                    {/* Optional Notes */}
                    <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent">
                        <h2 className="text-xl font-bold text-white mb-4">Swing Notes (Optional)</h2>
                        <textarea
                            name="notes"
                            rows={3}
                            placeholder="e.g., Felt good, nice contact, pulled too early..."
                            className="w-full px-4 py-3 bg-cb-dark border border-cb-dark-accent text-white rounded-lg focus:ring-2 focus:ring-cb-gold focus:border-cb-gold"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 px-8 py-4 bg-cb-gold text-cb-dark font-bold rounded-xl hover:bg-cb-gold-dark transition-all shadow-lg"
                        >
                            Upload & Analyze
                        </button>
                        <Link
                            href={`/lesson/${lesson.id}`}
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
