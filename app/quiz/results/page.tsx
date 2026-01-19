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
        <div className="min-h-screen bg-cb-dark text-white flex flex-col items-center justify-center p-6 py-20">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">

                {/* Left Column: The Result */}
                <div className="space-y-6">
                    <div className="inline-block px-4 py-1 rounded-full bg-cb-gold/10 text-cb-gold text-sm font-bold tracking-widest uppercase">
                        Audit Complete
                    </div>
                    <h1 className="text-5xl font-bold leading-tight">
                        {name}, you are a <br />
                        <span className="text-cb-gold">{profile.title}.</span>
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        {profile.desc}
                    </p>
                    <div className="p-4 bg-gray-800 rounded-lg border-l-4 border-cb-gold">
                        <span className="text-gray-400 text-sm uppercase font-bold block mb-1">Pro Comparison</span>
                        <span className="text-lg font-medium text-white">{profile.pro}</span>
                    </div>

                    <div className="pt-6">
                        <Link
                            href="/auth/signup"
                            className="inline-block w-full text-center px-8 py-4 bg-cb-gold text-cb-dark font-bold rounded-xl text-lg hover:bg-cb-gold-dark transition-all shadow-lg shadow-cb-gold/20"
                        >
                            Start Full Analysis Program
                        </Link>
                        <p className="text-center text-sm text-gray-500 mt-3">
                            Get your full biomechanics score inside.
                        </p>
                    </div>
                </div>

                {/* Right Column: The Lead Magnet (AI Prompt) */}
                <div className="bg-cb-dark-card border border-cb-dark-accent rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-50 text-6xl">🤖</div>

                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-cb-gold">🎁</span> Your Custom AI Prompt
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                        Copy and paste this into ChatGPT or Claude to get a customized training plan based on your Kinetic Fingerprint.
                    </p>

                    <div className="bg-black/50 rounded-lg p-5 font-mono text-sm text-green-400 border border-white/10 relative">
                        {profile.prompt}
                    </div>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(profile.prompt);
                            alert("Prompt copied to clipboard!");
                        }}
                        className="mt-6 w-full py-3 border border-gray-600 rounded-lg font-medium hover:border-cb-gold hover:text-cb-gold transition-colors"
                    >
                        Copy Prompt
                    </button>
                </div>

            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cb-dark flex items-center justify-center text-white">Loading Blueprint...</div>}>
            <ResultsContent />
        </Suspense>
    )
}
