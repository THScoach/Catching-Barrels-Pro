import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role === "admin" || session.user.role === "coach") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Player Dashboard</h1>
          <Link
            href="/api/auth/signout"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
          >
            Sign Out
          </Link>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Welcome, {session.user.name}!
          </h2>
          <p className="text-gray-400">
            Email: {session.user.email}
          </p>
          <p className="text-gray-400">
            Role: <span className="text-purple-500 capitalize">{session.user.role}</span>
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Your Swing Analysis
          </h2>
          <p className="text-gray-400">
            Video uploads and analysis coming in Phase 3...
          </p>
        </div>
      </div>
    </div>
  );
}
