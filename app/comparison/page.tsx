import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ComparisonSelector } from "@/components/comparison/ComparisonSelector";
import { RecentComparisons } from "@/components/comparison/RecentComparisons";

export default async function ComparisonPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) redirect("/auth/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            lessons: {
                where: { status: "completed" },
                orderBy: { createdAt: "desc" },
                take: 20,
                include: {
                    swingVideos: { take: 1 },
                },
            },
        },
    });

    if (!user) redirect("/auth/login");

    const getLastWeekLesson = (lessons: any[]) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return lessons.find(l => new Date(l.createdAt) < oneWeekAgo);
    };

    return (
        <div className="min-h-screen bg-cb-dark">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Compare Swings</h1>
                    <p className="text-gray-400">
                        See your progress by comparing lessons side-by-side
                    </p>
                </div>

                {/* Quick Compare Options */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <QuickCompareCard
                        title="First vs Latest"
                        description="See how far you've come"
                        lesson1={user.lessons[user.lessons.length - 1]}
                        lesson2={user.lessons[0]}
                    />
                    <QuickCompareCard
                        title="This Week vs Last Week"
                        description="Track weekly improvement"
                        lesson1={getLastWeekLesson(user.lessons)}
                        lesson2={user.lessons[0]}
                    />
                    <QuickCompareCard
                        title="Compare to Pro"
                        description="Measure against elite mechanics"
                        isPro
                    />
                </div>

                {/* Custom Comparison */}
                <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Custom Comparison
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Select any two lessons to compare
                    </p>

                    <ComparisonSelector lessons={user.lessons} />
                </div>

                {/* Recent Comparisons */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Recent Comparisons
                    </h2>
                    <RecentComparisons userId={user.id} />
                </div>

            </main>
        </div>
    );
}

function QuickCompareCard({ title, description, lesson1, lesson2, isPro }: any) {
    if (isPro) {
        return (
            <Link
                href="/comparison/pro"
                className="bg-gradient-to-br from-cb-gold to-yellow-600 rounded-2xl p-6 hover:scale-105 transition-transform block"
            >
                <div className="text-2xl mb-2">⭐</div>
                <h3 className="text-xl font-bold text-cb-dark mb-2">{title}</h3>
                <p className="text-cb-dark/80 text-sm">{description}</p>
            </Link>
        );
    }

    if (!lesson1 || !lesson2) return null;

    return (
        <Link
            href={`/comparison/${lesson1.id}/${lesson2.id}`}
            className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent hover:border-cb-gold transition-colors block"
        >
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm mb-4">{description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{lesson1.name}</span>
                <span>→</span>
                <span>{lesson2.name}</span>
            </div>
        </Link>
    );
}
