import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { notFound } from 'next/navigation';

export default async function AthleteDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const athlete = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            lessons: {
                orderBy: { createdAt: 'desc' },
                take: 10
            }
        }
    });

    if (!athlete) {
        notFound();
    }

    const latestLesson = athlete.lessons[0];
    // Use lesson scores instead of swing metrics
    const overallScore = latestLesson?.overallScore ? Math.round(latestLesson.overallScore) : 0;

    // Power Zone Scores (Mocked or derived from lesson scores if available)
    // Since we don't have granular zone scores on Lesson model yet (only overall, barrel, ground, core, whip),
    // we can map them:
    // Ground -> Ground Connection
    // Core -> Rotation Power
    // Whip -> Whip Action
    // Barrel -> Chain Reaction (approx)
    const zones = [
        { name: 'Ground Connection', score: latestLesson?.groundScore ? Math.round(latestLesson.groundScore) : 0, color: 'bg-blue-500' },
        { name: 'Rotation Power', score: latestLesson?.coreScore ? Math.round(latestLesson.coreScore) : 0, color: 'bg-green-500' },
        { name: 'Whip Action', score: latestLesson?.whipScore ? Math.round(latestLesson.whipScore) : 0, color: 'bg-purple-500' },
        { name: 'Chain Reaction', score: latestLesson?.barrelScore ? Math.round(latestLesson.barrelScore) : 0, color: 'bg-orange-500' },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{athlete.name}</h1>
                    <p className="text-gray-400">{athlete.email} • Member since {new Date(athlete.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700">
                        Send Message
                    </button>
                    <button className="px-4 py-2 bg-cb-gold text-cb-dark font-bold rounded-lg hover:bg-yellow-500">
                        Assign Drill
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Stats & Zones */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Current Status Card */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Current Status</h2>
                            <div className="text-3xl font-bold text-cb-gold">{overallScore}%</div>
                        </div>

                        {/* Power Zones */}
                        <div className="space-y-4">
                            {zones.map((zone) => (
                                <div key={zone.name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300">{zone.name}</span>
                                        <span className="text-white font-bold">{zone.score}%</span>
                                    </div>
                                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${zone.color}`}
                                            style={{ width: `${zone.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">🤖</span>
                            <h2 className="text-xl font-bold text-white">AI Insight</h2>
                        </div>
                        <p className="text-indigo-100 mb-4">
                            "Tommy is showing early shoulder rotation in recent uploads. His Rotation Power dropped 12% in 2 weeks. Recommend 1-on-1 video review focusing on hip-first mechanics."
                        </p>
                        <div className="flex gap-3">
                            <button className="text-sm px-3 py-1 bg-indigo-800 text-white rounded hover:bg-indigo-700 border border-indigo-600">
                                Schedule Review
                            </button>
                            <button className="text-sm px-3 py-1 bg-indigo-800 text-white rounded hover:bg-indigo-700 border border-indigo-600">
                                Assign Hip Drill
                            </button>
                        </div>
                    </div>

                    {/* Recent Lessons */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">Recent Lessons</h2>
                        <div className="space-y-4">
                            {athlete.lessons.length > 0 ? (
                                athlete.lessons.map((lesson) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center text-2xl">
                                                ⚾
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{lesson.name}</div>
                                                <div className="text-xs text-gray-400">{new Date(lesson.createdAt).toLocaleDateString()} • {lesson.totalSwings} swings</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-white">Score: {lesson.overallScore ? Math.round(lesson.overallScore) : '--'}</div>
                                            <a href={`/lesson/${lesson.id}`} className="text-xs text-cb-gold hover:underline">View Details</a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No recent lessons.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Column: Info & Actions */}
                <div className="space-y-8">

                    {/* Parent Info */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Parent Info</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-400 block">Name</span>
                                <span className="text-white">Maria Martinez (Mom)</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block">Email</span>
                                <span className="text-white">maria@email.com</span>
                            </div>
                            <div>
                                <span className="text-gray-400 block">Phone</span>
                                <span className="text-white">(555) 123-4567</span>
                            </div>
                            <div className="pt-3 border-t border-gray-700">
                                <span className="text-gray-400 block">Subscription</span>
                                <span className="text-green-400 font-bold">Premium ($49/mo) • Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Drill Completion */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-lg font-bold text-white mb-4">Drill Completion</h3>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">This Week</span>
                                <span className="text-white font-bold">3/5</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-cb-gold w-3/5" />
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2 text-green-400">
                                <span>✓</span> Ground Force Drill
                            </li>
                            <li className="flex items-center gap-2 text-green-400">
                                <span>✓</span> Hand Path Drill
                            </li>
                            <li className="flex items-center gap-2 text-red-400">
                                <span>✗</span> Hip Separation Drill
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
