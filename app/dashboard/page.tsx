import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import FunctionalHealthPanel from "@/components/dashboard/FunctionalHealthPanel";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      lessons: {
        orderBy: { createdAt: "desc" },
        take: 5, // Fetch top 5 for "Recent Lessons" list
        include: {
          swingVideos: {
            include: { swingMetrics: true },
          },
        },
      },
    },
  });

  if (!user) redirect("/auth/login");
  if (user.role === "parent") redirect("/parent-dashboard");

  const latestLesson = user.lessons[0];

  // Efficiently count total swings across ALL lessons, not just the fetched ones
  const totalSwingsCount = await prisma.swingVideo.count({
    where: {
      lesson: { userId: user.id }
    }
  });

  return (
    <div className="min-h-screen bg-cb-dark">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-400">
            {/* @ts-ignore: position and stance might not be in User type yet if not regenerated, but schema has it */}
            {user.position || "Athlete"} • {user.battingStance ? `${user.battingStance}-handed` : "Right-handed"}
          </p>
        </div>

        {/* Functional Health Panel */}
        <FunctionalHealthPanel />

        {/* Latest Lesson Scores */}
        {latestLesson ? (
          <div className="bg-cb-dark-card rounded-2xl p-8 mb-8 border border-cb-dark-accent">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{latestLesson.name}</h2>
                <p className="text-gray-400">
                  {new Date(latestLesson.createdAt).toLocaleDateString()} • {latestLesson.totalSwings} swings
                </p>
              </div>
              <Link
                href={`/lesson/${latestLesson.id}`}
                className="px-4 py-2 bg-cb-dark-accent text-white rounded-lg hover:bg-cb-dark hover:text-cb-gold transition-colors"
              >
                View Details →
              </Link>
            </div>

            {/* 4 Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreCard
                label="Barrel"
                score={latestLesson.barrelScore}
                color="bg-cb-gold text-cb-dark"
              />
              <ScoreCard
                label="Ground"
                score={latestLesson.groundScore}
                color="bg-yellow-500 text-white"
              />
              <ScoreCard
                label="Core"
                score={latestLesson.coreScore}
                color="bg-gray-500 text-white"
              />
              <ScoreCard
                label="Whip"
                score={latestLesson.whipScore}
                color="bg-red-500 text-white"
              />
            </div>
          </div>
        ) : (
          <div className="bg-cb-dark-card rounded-2xl p-12 mb-8 border border-cb-dark-accent text-center">
            <div className="text-6xl mb-4">⚾</div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome, Coach!</h2>
            <p className="text-gray-400 mb-6">
              Your database is clean. Click below to add your first player or session.
            </p>
            <Link
              href="/new-lesson"
              className="inline-block px-8 py-4 bg-cb-gold text-cb-dark font-bold rounded-xl hover:bg-cb-gold-dark transition-all shadow-lg"
            >
              Start New Session
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Total Lessons"
            value={user.lessons.length}
            icon="📚"
          />
          <StatCard
            label="Total Swings"
            value={totalSwingsCount}
            icon="🎯"
          />
          <StatCard
            label="Latest Session"
            value={latestLesson?.sessionType || "N/A"}
            icon="⚡"
          />
        </div>

        {/* Recent Lessons */}
        <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Recent Lessons</h2>
            <Link href="/history" className="text-cb-gold hover:text-cb-gold-light">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {user.lessons.slice(0, 5).map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lesson/${lesson.id}`}
                className="flex justify-between items-center p-4 bg-cb-dark hover:bg-cb-dark-accent rounded-lg transition-colors"
              >
                <div>
                  <div className="text-white font-medium">{lesson.name}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(lesson.createdAt).toLocaleDateString()} • {lesson.totalSwings} swings
                  </div>
                </div>
                <div className="text-cb-gold font-bold">
                  {lesson.overallScore ? Math.round(lesson.overallScore) : "--"}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

function ScoreCard({ label, score, color }: { label: string; score?: number | null; color: string }) {
  return (
    <div className={`${color} rounded-xl p-6 text-center shadow-md`}>
      <div className="text-sm opacity-80 mb-2 font-medium uppercase tracking-wide">{label}</div>
      <div className="text-4xl font-bold">{score ? Math.round(score) : "--"}</div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-cb-dark-card rounded-xl p-6 border border-cb-dark-accent">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
