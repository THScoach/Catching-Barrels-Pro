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

          {/* Hero Image */}
          <div className="w-full h-64 sm:h-96 bg-gray-800 relative mt-8 border border-gray-700">
            <img
              src="/assets/media/coach/hero-rick.jpg"
              alt="Coach Rick Strickland"
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
            />
            <div className="absolute bottom-0 left-0 bg-barrels-red text-white text-xs font-black uppercase tracking-widest px-4 py-2">
              Rick Strickland // Founder
            </div>
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
      </main >

    {/* 2. THE BIG LEAGUE TRUST BAR */ }
    < section className = "border-y border-gray-800 bg-barrels-grey py-16" >
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-center text-barrels-red text-sm font-black uppercase tracking-[0.3em] mb-12">
          Trusted by The World's Best
        </h3>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {/* Benintendi */}
          <div className="space-y-4">
            <p className="text-white text-lg font-medium italic">"Rick doesn't guess. He knows. The data he gives me isn't noise—it's the blueprint for my swing."</p>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
              <span className="text-white block mb-1">Andrew Benintendi</span>
              MLB All-Star / White Sox
            </div>
          </div>
          {/* Adams */}
          <div className="space-y-4">
            <p className="text-white text-lg font-medium italic">"The Human 3.0 system saved my career. We rebuilt my force vectors from the ground up."</p>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
              <span className="text-white block mb-1">Matt Adams</span>
              World Series Champion
            </div>
          </div>
          {/* Odorizzi */}
          <div className="space-y-4">
            <p className="text-white text-lg font-medium italic">"Pitchers study hitters. Rick studies physics. He found leakages in my delivery that no computer saw."</p>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
              <span className="text-white block mb-1">Jake Odorizzi</span>
              MLB All-Star
            </div>
          </div>
        </div>
      </div>
      </section >

    {/* 3. THE KINEMATIC BLUEPRINT (Privacy Anonymized) */ }
    < section className = "py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center" >
      <div className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.85]">
          The <span className="text-barrels-red">Blueprint.</span><br />
          See what they can't.
        </h2>
        <p className="text-xl text-gray-400">
          We don't give you a spreadsheet. We give you a visual map of your kinetic chain.
          Our 4B Report creates a clear, actionable feedback loop.
        </p>
        <ul className="space-y-4 pt-4">
          <li className="flex items-center gap-4 text-white font-bold uppercase tracking-wider text-sm">
            <div className="w-2 h-2 bg-barrels-red"></div>
            Rotational Foundation Score
          </li>
          <li className="flex items-center gap-4 text-white font-bold uppercase tracking-wider text-sm">
            <div className="w-2 h-2 bg-barrels-red"></div>
            Temporal Sync (Timing)
          </li>
          <li className="flex items-center gap-4 text-white font-bold uppercase tracking-wider text-sm">
            <div className="w-2 h-2 bg-barrels-red"></div>
            Force Vector Efficiency
          </li>
        </ul>
      </div>

  {/* Anonymized Report Visual */ }
  <div className="relative border border-gray-800 bg-gray-900 p-2 shadow-2xl group">
    <div className="absolute top-0 left-0 bg-barrels-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 z-10">
      Sample Report
    </div>
    <img
      src="/assets/media/reports/human-3-0-diagnostic-sample.png"
      alt="Kinematic Blueprint Sample"
      className="w-full opacity-90"
    />
    {/* PRIVACY BAR OVERLAY */}
    <div className="absolute top-12 left-8 w-48 h-6 bg-black flex items-center justify-center border border-gray-800">
      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Athlete Profile #303</span>
    </div>
  </div>
      </section >

    {/* 4. META POV GALLERY */ }
    < section className = "py-24 bg-black border-t border-gray-800" >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-black uppercase">
            The Meta <span className="text-gray-600">POV.</span>
          </h2>
          <div className="text-right hidden md:block">
            <div className="text-barrels-red text-xs font-black uppercase tracking-widest mb-1">Coach's Eye</div>
            <div className="text-gray-500 text-sm">See the game through the lens.</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video bg-gray-900 border border-gray-800 relative group overflow-hidden">
              <img
                src={`/assets/media/coach/pov-sample-${i}.jpg`}
                alt={`Coaching POV ${i}`}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4">
                <div className="text-white font-bold uppercase tracking-wider text-sm">Session #{800 + i}</div>
                <div className="text-barrels-red text-[10px] font-black uppercase tracking-widest">Analysis Mode</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </section >

    {/* Footer */ }
    < footer className = "border-t border-barrels-grey mt-20 bg-barrels-grey/20" >
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs font-bold tracking-widest uppercase">
        <div>&copy; 2026 Catching Barrels Pro.</div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
      </footer >
    </div >
  );
}
