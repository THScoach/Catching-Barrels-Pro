import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-cb-dark text-white font-sans selection:bg-cb-gold selection:text-black">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justification-between items-center">
        <div className="text-xl font-bold tracking-tighter text-white">
          CATCHING<span className="text-cb-gold">BARRELS</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="text-sm font-medium hover:text-cb-gold transition-colors">
            Login
          </Link>
          <Link
            href="/quiz"
            className="hidden sm:block px-4 py-2 bg-white text-cb-dark text-sm font-bold rounded-md hover:bg-gray-200 transition-all"
          >
            Take the Audit
          </Link>
        </div>
      </nav>

      {/* Hero / Manifesto Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 sm:py-32">
        <div className="space-y-12">

          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.9]">
              DATA DOESN'T COACH. <br />
              <span className="text-cb-gold">PEOPLE DO.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl leading-relaxed">
              We tried letting the algorithms run the show. They failed.
              <br className="hidden sm:block" />
              Real development requires the human element.
            </p>
          </div>

          <div className="prose prose-invert prose-lg text-gray-300">
            <p>
              The era of "collecting dots" is over. Every facility has a sensor. Every kid has an iPad.
              Yet batting averages are dropping, and injury rates are climbing. Why?
            </p>
            <p>
              Because raw data is noise without context. A 90mph exit velocity means nothing if
              your kinetic sequence is a ticking time bomb for your lower back.
            </p>
            <p className="border-l-4 border-cb-gold pl-4 italic text-white">
              "We don't build robots. We build <strong>Human 3.0</strong> Athletes."
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
              className="group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-cb-dark transition-all duration-200 bg-cb-gold font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <div className="absolute -inset-3 transition-all duration-1000 opacity-30 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:duration-200 animate-tilt"></div>
              <span className="relative">Start Human 3.0 Audit</span>
              <svg className="relative w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Free 2-minute assessment. No credit card required.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div>&copy; 2026 Catching Barrels Pro. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
