import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-barrels-black text-white font-barrels selection:bg-barrels-red selection:text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justification-between items-center border-b border-barrels-grey">
        <div className="text-2xl font-black tracking-tighter text-white uppercase italic">
          BARRELS
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/auth/login" className="text-sm font-bold uppercase tracking-wider hover:text-barrels-red transition-colors text-gray-400">
            Login
          </Link>
          <Link
            href="/quiz"
            className="hidden sm:block px-6 py-3 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-barrels-red hover:text-white transition-all rounded-none"
          >
            Start Audit
          </Link>
        </div>
      </nav>

      {/* Hero / Manifesto Section */}
      <main className="max-w-5xl mx-auto px-6 py-24 sm:py-32">
        <div className="space-y-16">

          <div className="space-y-8">
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
              DATA DOESN'T COACH. <br />
              <span className="text-barrels-red">PEOPLE DO.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-barrels-text-dim max-w-3xl leading-relaxed font-medium">
              We tried letting the algorithms run the show. They failed.
              <br className="hidden sm:block" />
              Real development requires the human element.
            </p>
          </div>

          <div className="space-y-6 text-lg sm:text-xl text-gray-400 max-w-3xl border-l-2 border-barrels-red pl-8">
            <p>
              The era of "collecting dots" is over. Every facility has a sensor. Every kid has an iPad.
              Yet batting averages are dropping, and injury rates are climbing. Why?
            </p>
            <p>
              Because raw data is noise without context. A 90mph exit velocity means nothing if
              your kinetic sequence is a ticking time bomb for your lower back.
            </p>
            <p className="font-bold text-white text-2xl italic uppercase">
              "We don't build robots. We build <span className="text-barrels-red">Human 3.0</span> Athletes."
            </p>
            <p>
              It's time to stop guessing and start engineering. We monitor the
              <strong> Kinetic Fingerprint</strong>—the unique bio-signature of how <em>you</em> move energy
              through space.
            </p>
          </div>

          <div className="pt-8">
            <Link
              href="/quiz"
              className="group relative inline-flex items-center justify-center px-10 py-6 text-xl font-black text-white uppercase tracking-widest transition-all duration-200 bg-barrels-red hover:bg-white hover:text-barrels-red rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-barrels-red"
            >
              <span className="relative">Start Human 3.0 Audit</span>
              <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <p className="mt-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
              Free 2-minute assessment // No credit card required
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-barrels-grey mt-20 bg-barrels-grey/20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs font-bold tracking-widest uppercase">
          <div>&copy; 2026 Catching Barrels Pro.</div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
