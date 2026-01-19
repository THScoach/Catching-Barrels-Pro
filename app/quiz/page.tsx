"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Profile = "Spinner" | "Slingshotter" | "Whipper";

interface Question {
    id: number;
    text: string;
    options: {
        text: string;
        type: Profile;
    }[];
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "When you crush a ball, what does it usually feel like?",
        options: [
            { text: "Tight and fast. Like I spun really quick in a phone booth.", type: "Spinner" },
            { text: "Stretchy. Like a rubber band snapping.", type: "Slingshotter" },
            { text: "Heavy leverage. Like using a crowbar or an axe.", type: "Whipper" },
        ],
    },
    {
        id: 2,
        text: "Where do you feel the most power coming from?",
        options: [
            { text: "My glutes and ground connection (Linear push).", type: "Slingshotter" },
            { text: "My core and obliques (Rotation).", type: "Spinner" },
            { text: "My hands and wrists (Whip/Direct).", type: "Whipper" },
        ],
    },
    {
        id: 3,
        text: "Which MLB player's swing do you relate to most?",
        options: [
            { text: "Jose Altuve or Mookie Betts (Quick, rotational).", type: "Spinner" },
            { text: "Shohei Ohtani or Bryce Harper (Big stride, elastic).", type: "Slingshotter" },
            { text: "Freddie Freeman or Aaron Judge (Tall, leverage, tilt).", type: "Whipper" },
        ],
    },
    {
        id: 4,
        text: "Reviewing video, what is your most common flaw?",
        options: [
            { text: "Spinning off the ball / Pulling off.", type: "Spinner" },
            { text: "Getting stuck back / Lunging.", type: "Slingshotter" },
            { text: "Dumping the barrel / Casting.", type: "Whipper" },
        ],
    },
    {
        id: 5,
        text: "In the weight room, you are strongest at:",
        options: [
            { text: "Squats/Deadlifts.", type: "Spinner" },
            { text: "Medicine Ball Throws/Sprints.", type: "Slingshotter" },
            { text: "Pull-ups/Rows/Back work.", type: "Whipper" },
        ],
    },
    {
        id: 6,
        text: "What is your mindset at the plate?",
        options: [
            { text: "Turn fast, be quick.", type: "Spinner" },
            { text: "Create separation, drive through.", type: "Slingshotter" },
            { text: "Stay connected, let it fly.", type: "Whipper" },
        ],
    },
];

export default function QuizPage() {
    const router = useRouter();
    const [step, setStep] = useState(0); // 0 = Intro, 1-6 = Questions, 7 = Email Form
    const [answers, setAnswers] = useState<Record<number, Profile>>({});
    const [scores, setScores] = useState<Record<Profile, number>>({
        Spinner: 0,
        Slingshotter: 0,
        Whipper: 0,
    });

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswer = (type: Profile) => {
        const currentQ = QUESTIONS[step - 1]; // step starts at 1 for Qs
        setAnswers((prev) => ({ ...prev, [currentQ.id]: type }));
        setScores((prev) => ({ ...prev, [type]: prev[type] + 1 }));

        if (step < QUESTIONS.length) {
            setStep(step + 1);
        } else {
            setStep(QUESTIONS.length + 1); // Go to Email Form
        }
    };

    const calculateWinner = (): Profile => {
        let winner: Profile = "Spinner";
        let max = -1;
        Object.entries(scores).forEach(([key, val]) => {
            if (val > max) {
                max = val;
                winner = key as Profile;
            }
        });
        return winner;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const winner = calculateWinner();

        try {
            const res = await fetch("/api/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    name,
                    hitterType: winner,
                    answers,
                }),
            });

            if (res.ok) {
                router.push(`/quiz/results?type=${winner}&name=${encodeURIComponent(name)}`);
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting quiz.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER ---

    // Intro Screen
    if (step === 0) {
        return (
            <div className="min-h-screen bg-barrels-black text-white flex items-center justify-center p-6 font-barrels selection:bg-barrels-red selection:text-white">
                <div className="max-w-2xl w-full text-center space-y-8">
                    <div className="text-barrels-red text-sm font-black tracking-[0.2em] uppercase mb-4">The Human 3.0 Audit</div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
                        Discover Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">Kinetic Fingerprint.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-lg mx-auto font-medium">
                        Are you a <span className="text-white">Spinner</span>, a <span className="text-white">Slingshotter</span>, or a <span className="text-white">Whipper</span>? <br />
                        Take this 6-question assessment to unlock your custom Hitter Blueprint.
                    </p>
                    <button
                        onClick={() => setStep(1)}
                        className="px-12 py-6 bg-barrels-red text-white font-black uppercase tracking-widest text-xl hover:bg-white hover:text-barrels-red transition-all rounded-none"
                    >
                        Start Assessment
                    </button>
                    <div className="pt-8">
                        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Email / Submit Screen
    if (step > QUESTIONS.length) {
        return (
            <div className="min-h-screen bg-barrels-black text-white flex items-center justify-center p-6 font-barrels">
                <div className="max-w-md w-full bg-barrels-grey border border-gray-800 p-10 shadow-2xl">
                    <h2 className="text-3xl font-black uppercase mb-2 text-center text-white">Audit Complete.</h2>
                    <p className="text-gray-400 text-center mb-8 font-medium">
                        Enter your details to generate your Custom Blueprint.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-4 bg-black border border-gray-700 focus:border-barrels-red focus:ring-1 focus:ring-barrels-red outline-none text-white placeholder-gray-600 transition-all rounded-none"
                                placeholder="Shohei"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-black border border-gray-700 focus:border-barrels-red focus:ring-1 focus:ring-barrels-red outline-none text-white placeholder-gray-600 transition-all rounded-none"
                                placeholder="shohei@dh.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-barrels-red hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                        >
                            {isSubmitting ? "Generating..." : "Reveal My Fingerprint"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Question Screen
    const question = QUESTIONS[step - 1];
    const progress = (step / QUESTIONS.length) * 100;

    return (
        <div className="min-h-screen bg-barrels-black text-white flex flex-col items-center justify-center p-6 font-barrels">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                        <span>Question {step} / {QUESTIONS.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-900 overflow-hidden">
                        <div
                            className="h-full bg-barrels-red transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <h2 className="text-4xl md:text-5xl font-black uppercase mb-12 leading-none text-white tracking-tight">{question.text}</h2>

                {/* Options */}
                <div className="space-y-4">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option.type)}
                            className="w-full text-left p-8 bg-barrels-grey border border-gray-800 hover:border-barrels-red hover:bg-[#222] transition-all group flex items-center justify-between rounded-none"
                        >
                            <span className="text-xl font-bold text-white group-hover:text-barrels-red transition-colors">{option.text}</span>
                            <span className="text-gray-600 font-bold group-hover:text-barrels-red transition-colors">→</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
