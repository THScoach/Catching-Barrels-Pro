// @ts-nocheck
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AIAlertsPanel } from "@/components/admin/AIAlertsPanel";
import { InterventionQueue } from "@/components/admin/InterventionQueue";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Fetch Quick Stats & AI Data
  const [
    athleteCount,
    lessonCount,
    swingCount,
    alerts,
    interventions
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'athlete' } }),
    prisma.lesson.count(),
    prisma.swingVideo.count(),
    // @ts-ignore - Schema realignment in progress
    [], // Alerts mock
    // @ts-ignore - Schema realignment in progress
    []  // Interventions mock
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back, Coach. Here's what's happening today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Athletes" value={athleteCount} icon="👥" />
        <StatCard label="Total Lessons" value={lessonCount} icon="🎓" />
        <StatCard label="Total Swings" value={swingCount} icon="⚾" />
        <StatCard label="Active Rate" value="89%" icon="📈" />
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 mb-8 border border-indigo-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl">🤖</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🤖</span>
            <h2 className="text-xl font-bold text-white">AI Insight (Live)</h2>
          </div>
          <p className="text-indigo-100 text-lg mb-4 max-w-3xl">
            "I'm noticing 12 athletes struggling with rotation power this week. Common pattern: early shoulder rotation. Suggest group clinic on hip separation."
          </p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors">
              View Details
            </button>
            <button className="px-4 py-2 bg-indigo-800 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors border border-indigo-600">
              Schedule Clinic
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* AI Alerts Panel */}
        <div className="lg:col-span-1">
          <AIAlertsPanel alerts={alerts} />
        </div>

        {/* Intervention Queue */}
        <div className="lg:col-span-1">
          <InterventionQueue interventions={interventions} />
        </div>

        {/* Trending Up (Mock for now) */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📈</span> Trending Up
          </h3>
          <ul className="space-y-3">
            {[
              "Sarah Johnson: +12% overall (3 weeks)",
              "Elite group avg: 82% → 87% on Whip Action"
            ].map((trend, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <span className="text-green-500 mt-1">•</span>
                <span>{trend}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
