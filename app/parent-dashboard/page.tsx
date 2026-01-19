import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ParentDashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect('/auth/login');

    const parent = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            athletes: {
                include: {
                    lessons: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                    // swingVideos removed
                },
            },
        },
    });

    if (!parent) redirect('/auth/login');
    if (parent.role !== 'parent') redirect('/dashboard');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Parent Dashboard
                        </h1>
                        <p className="text-sm text-slate-600">Welcome back, {parent.name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/create-athlete"
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                        >
                            + Add Athlete
                        </Link>
                        {/* Note: NextAuth signout is usually client-side or a specific API route. 
                Using a simple link to the signout page for now, or we could use a client component.
                For simplicity in this server component, we'll link to /api/auth/signout */}
                        <Link
                            href="/api/auth/signout"
                            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Sign Out
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Subscription Status */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Subscription Status</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-slate-600">Plan</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {parent.subscriptionPlan || 'Free Trial'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Status</p>
                            <p className="text-lg font-semibold text-emerald-600">
                                {parent.subscriptionStatus || 'Active'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Athletes</p>
                            <p className="text-lg font-semibold text-slate-900">
                                {parent.athletes.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Athletes Grid */}
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Athletes</h2>

                    {parent.athletes.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
                            <div className="text-6xl mb-4">⚾</div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Athletes Yet</h3>
                            <p className="text-slate-600 mb-6">Get started by creating your first athlete profile</p>
                            <Link
                                href="/create-athlete"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                            >
                                + Create Athlete Profile
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {parent.athletes.map((athlete) => {
                                const latestLesson = athlete.lessons[0];
                                const overallScore = latestLesson?.overallScore;
                                // We need total swings, but we only fetched 1 lesson. 
                                // To get total swings efficiently without fetching all lessons, we might need a separate query or aggregate.
                                // For now, let's just show the latest lesson's swing count or "N/A" if we can't easily get total.
                                // Or better: fetch all lessons but select only id and totalSwings to be lightweight.
                                // Let's update the query above to fetch all lessons but lightweight.

                                return (
                                    <div key={athlete.id} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold">
                                                {athlete.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{athlete.name}</h3>
                                                <p className="text-sm text-slate-600">{athlete.position || 'Position not set'}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Latest Score</span>
                                                <span className="font-semibold text-slate-900">
                                                    {overallScore ? Math.round(overallScore) : '--'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Latest Session Swings</span>
                                                <span className="font-semibold text-slate-900">
                                                    {latestLesson?.totalSwings ?? 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Profile Status</span>
                                                <span className={`font-semibold ${athlete.profileCompleted ? 'text-emerald-600' : 'text-yellow-600'}`}>
                                                    {athlete.profileCompleted ? 'Complete' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-center text-sm text-slate-500">
                                            View-only access • Athletes run their own analysis
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
