import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  try {
    // Check if the application has been initialized (any users exist)
    const userCount = await prisma.user.count();

    if (userCount === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cb-dark text-white">
          <div className="max-w-md p-8 text-center bg-cb-dark-card rounded-2xl border border-cb-dark-accent shadow-2xl">
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-3xl font-bold mb-4">Welcome to CatchBarrels Pro</h1>
            <p className="text-gray-400 mb-8">
              The system has been reset and is ready for Beta Launch.
              Be the first to initialize the database.
            </p>
            <Link
              href="/auth/signup"
              className="block w-full py-4 bg-cb-gold text-cb-dark font-bold rounded-xl hover:bg-cb-gold-dark transition-all transform hover:scale-105"
            >
              Sign Up as First Coach
            </Link>
          </div>
        </div>
      );
    }
  } catch (error) {
    // Fallback if DB connection fails entirely
    console.error("DB Connection Check Failed:", error);
  }

  // Standard flow
  redirect("/auth/login");
}
