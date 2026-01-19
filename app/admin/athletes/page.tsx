import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AthleteListPage() {
    const session = await getServerSession(authOptions);

    // Fetch all athletes
    const athletes = await prisma.user.findMany({
        where: { role: 'athlete' },
        include: {
            lessons: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Athlete Management</h1>
                    <p className="text-gray-400">View and manage all {athletes.length} athletes</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 hover:bg-gray-700">
                        Filter: All
                    </button>
                    <button className="px-4 py-2 bg-cb-gold text-cb-dark font-bold rounded-lg hover:bg-yellow-500">
                        + Add Athlete
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search athletes by name..."
                    className="w-full md:w-96 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cb-gold"
                />
            </div>

            {/* Athlete Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Overall Score</th>
                            <th className="px-6 py-4">Trend</th>
                            <th className="px-6 py-4">Last Lesson</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {athletes.map((athlete) => {
                            const lastLesson = athlete.lessons[0];
                            const overallScore = lastLesson?.overallScore ? Math.round(lastLesson.overallScore) : 0;

                            // Mock trend logic for now
                            const trend = Math.random() > 0.5 ? 5 : -3;

                            return (
                                <tr key={athlete.id} className="hover:bg-gray-750 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white">
                                                {athlete.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{athlete.name}</div>
                                                <div className="text-xs text-gray-400">{athlete.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {overallScore > 0 ? (
                                            <span className={`font-bold ${overallScore >= 80 ? 'text-green-400' : overallScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {overallScore}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {overallScore > 0 ? (
                                            <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {lastLesson ? new Date(lastLesson.createdAt).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {overallScore < 70 && overallScore > 0 ? (
                                            <span className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded-full border border-red-800">
                                                Needs Attention
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full border border-green-800">
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/athletes/${athlete.id}`}
                                            className="text-cb-gold hover:underline text-sm font-bold"
                                        >
                                            View Profile
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {athletes.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No athletes found.
                    </div>
                )}
            </div>
        </div>
    );
}
