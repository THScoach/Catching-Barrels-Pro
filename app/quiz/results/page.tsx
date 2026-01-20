"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

// Content for each profile
const BLUEPRINTS: Record<string, { title: string; desc: string; pro: string; prompt: string }> = {
    Spinner: {
        title: "The Spinner",
        desc: "You generate force through extreme rotational velocity. You turn in a phone booth. Your superpower is time-to-contact, but your kryptonite is being 'around' the ball.",
        pro: "Jose Altuve / Mookie Betts",
        prompt: "Act as a Biomechanics Expert. I am a 'Spinner' type hitter who relies on high rotational velocity and core engagement. Create a 4-week drill progression to improve my direction without sacrificing my turn speed. Focus on staying inside the ball.",
    },
    Slingshotter: {
        title: "The Slingshotter",
        desc: "You are an elastic athlete. You create massive separation between your hips and shoulders. Your swing is violent and loose. You risk getting stuck back or disconnected.",
        pro: "Shohei Ohtani / Bryce Harper",
        prompt: "Act as a Biomechanics Expert. I am a 'Slingshotter' type hitter who uses high elastic separation (X-Factor). Create a 4-week warm-up and drill routine to ensure my 'Stretch-Shortening Cycle' is clean and I don't get stuck on my backside.",
    },
    Whipper: {
        title: "The Whipper",
        desc: "You are a leverage monster. You use length and tilt to destroy baseballs. You don't just turn; you deliver the barrel heavy. Your risk is casting or dumping the barrel.",
        pro: "Freddie Freeman / Aaron Judge",
        prompt: "Act as a Biomechanics Expert. I am a 'Whipper' type hitter who relies on leverage and barrel tilt. Design a constraint drill series to keep my barrel path tight while maximizing my natural leverage. Prevent 'casting'.",
    },
};

function ResultsContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "Spinner";
    const name = searchParams.get("name") || "Athlete";

    const profile = BLUEPRINTS[type] || BLUEPRINTS["Spinner"];

    return (
        <div className="min-h-screen bg-barrels-black text-white flex flex-col items-center justify-center p-6 py-20 font-barrels">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">

                {/* Left Column: The Result */}
                <div className="space-y-8">
                    <div className="inline-block px-4 py-2 bg-barrels-red text-white text-xs font-black tracking-widest uppercase rounded-none">
                        Audit Complete
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter">
                        {name}, you are a <br />
                        <span className="text-barrels-red">{profile.title}.</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed font-medium max-w-lg border-l-2 border-gray-800 pl-6">
                        {profile.desc}
                    </p>
                    <div className="p-8 bg-barrels-grey border border-gray-800 border-l-4 border-l-barrels-red shadow-2xl">
                        <span className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-2">Pro Comparison</span>
                        <div className="w-full h-48 bg-black mb-4 border border-gray-800 relative">
                            <img
                                src={`/assets/media/reports/${type.toLowerCase()}-pro.jpg`}
                                alt={profile.pro}
                                className="w-full h-full object-cover opacity-90"
                            />
                        </div>
                        <span className="text-2xl font-black text-white uppercase italic">{profile.pro}</span>
                    </div>

                    <div className="pt-8">
                        <Link
                            href="/auth/signup"
                            className="inline-block w-full text-center px-8 py-5 bg-white text-black font-black uppercase tracking-widest text-lg hover:bg-barrels-red hover:text-white transition-all rounded-none"
                        >
                            Start Full Analysis Program
                        </Link>
                        <p className="text-center text-xs font-bold text-gray-600 mt-4 uppercase tracking-widest">
                            Get your full biomechanics score inside
                        </p>
                    </div>
                </div>

                {/* Right Column: The Lead Magnet (AI Prompt) */}
                <div className="bg-barrels-grey border border-gray-800 p-10 relative overflow-hidden group shadow-2xl rounded-none">
                    <div className="absolute top-0 right-0 p-6 opacity-10 text-9xl text-white font-black select-none">AI</div>

                    <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 tracking-wide">
                        <span className="text-barrels-red">🎁</span> Your Custom AI Prompt
                    </h3>
                    <p className="text-sm text-gray-400 mb-8 font-medium leading-relaxed">
                        Copy and paste this into ChatGPT or Claude to get a customized training plan based on your Kinetic Fingerprint.
                    </p>

                    <div className="bg-black p-6 font-mono text-xs text-barrels-red border border-gray-800 relative rounded-none shadow-inner">
                        {profile.prompt}
                    </div>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(profile.prompt);
                            alert("Prompt copied to clipboard!");
                        }}
                        className="mt-8 w-full py-4 border border-gray-700 font-bold uppercase tracking-widest hover:border-barrels-red hover:text-barrels-red hover:bg-black transition-all text-sm rounded-none"
                    >
                        Copy Prompt
                    </button>
                </div>

            </div>

            {/* PRICING ARCHITECTURE */}
            <div className="max-w-6xl w-full mt-32">
                <h2 className="text-4xl font-black uppercase text-center mb-16 tracking-tighter">
                    Unlock Your <span className="text-barrels-red">Human 3.0</span> Potential
                </h2>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">

                    {/* OPTION 1: THE ACADEMY ($99/mo) - HERO PRODUCT */}
                    <div className="border border-gray-800 bg-barrels-grey p-8 flex flex-col relative group hover:border-barrels-red transition-colors">
                        <div className="absolute top-0 right-0 bg-barrels-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1">
                            Most Popular
                        </div>
                        <h3 className="text-3xl font-black uppercase mb-2">The Academy</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-black text-white">$99</span>
                            <span className="text-gray-500 font-bold text-sm uppercase">/ Month</span>
                        </div>

                        {/* BADGE: SENSOR INCLUDED */}
                        <div className="bg-white text-black text-center py-3 font-black uppercase tracking-widest text-xs mb-8 border border-gray-200">
                            🎁 Free Smart Sensor Kit Included
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex gap-3 text-sm font-bold text-gray-300">
                                <span className="text-barrels-red">✓</span> Coach Rick AI (24/7 Access)
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-gray-300">
                                <span className="text-barrels-red">✓</span> Weekly Drill Assignments
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-gray-300">
                                <span className="text-barrels-red">✓</span> Force Vector Analysis
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-gray-300">
                                <span className="text-barrels-red">✓</span> Live Lab Session Access
                            </li>
                        </ul>

                        <Link
                            href="https://whop.com/checkout/academy-link"
                            className="w-full text-center px-6 py-4 bg-barrels-red text-white font-black uppercase tracking-widest hover:bg-white hover:text-barrels-red transition-all rounded-none"
                        >
                            Join The Academy
                        </Link>
                    </div>

                    {/* OPTION 2: VIP PRIVATE ($297/mo) - THE PIVOT */}
                    <div className="border border-gray-800 bg-black p-8 flex flex-col relative group hover:border-gray-600 transition-colors opacity-90 hover:opacity-100">
                        {/* WARNING BADGE */}
                        <div className="bg-red-900/50 text-red-500 text-center py-2 font-black uppercase tracking-widest text-[10px] mb-6 border border-red-900">
                            ⚠️ Limited to 20 Players
                        </div>

                        <h3 className="text-3xl font-black uppercase mb-2 text-gray-300">Private Coaching</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl font-black text-white">$297</span>
                            <span className="text-gray-500 font-bold text-sm uppercase">/ Month</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex gap-3 text-sm font-bold text-gray-300">
                                <span className="text-white">★</span> Everything in Academy
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-gray-300">
                                <span className="text-white">★</span> 1-on-1 Zoom Swing Audits
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-gray-300">
                                <span className="text-white">★</span> Direct Text Line to Rick
                            </li>
                            <li className="flex gap-3 text-sm font-bold text-gray-300">
                                <span className="text-white">★</span> Priority Video Analysis
                            </li>
                        </ul>

                        <Link
                            href="https://whop.com/checkout/vip-link"
                            className="w-full text-center px-6 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-all rounded-none"
                        >
                            Apply for VIP
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ProcessingState() {
    return (
        <div className="min-h-screen bg-barrels-black flex flex-col items-center justify-center p-6 text-center font-barrels">
            <div className="w-16 h-16 border-4 border-gray-800 border-t-barrels-red rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-black uppercase text-white tracking-widest mb-2 animate-pulse">
                Processing Biomechanics...
            </h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                Analyzing Kinetic Fingerprint // <span className="text-barrels-red">Athlete Profile</span>
            </p>
            {/* Privacy Bar Visual */}
            <div className="mt-8 bg-gray-900 px-8 py-4 border border-gray-800 opacity-50">
                <div className="h-2 w-32 bg-gray-800 mb-2"></div>
                <div className="h-2 w-48 bg-gray-800 mb-2"></div>
                <div className="h-2 w-24 bg-gray-800"></div>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<ProcessingState />}>
            <ResultsContent />
        </Suspense>
    )
}
