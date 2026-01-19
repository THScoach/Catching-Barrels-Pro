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
            <div className="min-h-screen bg-cb-dark text-white flex items-center justify-center p-6">
                <div className="max-w-2xl w-full text-center space-y-8">
                    <div className="text-cb-gold text-lg font-bold tracking-widest uppercase mb-4">The Human 3.0 Audit</div>
                    <h1 className="text-4xl md:text-6xl font-bold">Discover Your <br />Kinetic Fingerprint.</h1>
                    <p className="text-xl text-gray-400 max-w-lg mx-auto">
                        Are you a Spinner, a Slingshotter, or a Whipper? <br />
                        Take this 6-question assessment to unlock your custom Hitter Blueprint.
                    </p>
                    <button
                        onClick={() => setStep(1)}
                        className="px-10 py-5 bg-cb-gold text-cb-dark font-bold rounded-xl text-xl hover:bg-cb-gold-dark transition-all transform hover:scale-105 shadow-lg shadow-cb-gold/20"
                    >
                        Start Assessment →
                    </button>
                    <div className="pt-8">
                        <Link href="/" className="text-sm text-gray-500 hover:text-white">Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Email / Submit Screen
    if (step > QUESTIONS.length) {
        return (
            <div className="min-h-screen bg-cb-dark text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-cb-dark-card border border-cb-dark-accent p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl font-bold mb-2 text-center">Audit Complete.</h2>
                    <p className="text-gray-400 text-center mb-8">
                        Enter your details to generate your Custom Blueprint.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-cb-dark border border-gray-700 rounded-lg focus:ring-2 focus:ring-cb-gold focus:border-transparent outline-none text-white"
                                placeholder="Shohei"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-cb-dark border border-gray-700 rounded-lg focus:ring-2 focus:ring-cb-gold focus:border-transparent outline-none text-white"
                                placeholder="shohei@dh.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-cb-gold text-cb-dark font-bold rounded-xl hover:bg-cb-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Generating Blueprint..." : "Reveal My Fingerprint"}
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
        <div className="min-h-screen bg-cb-dark text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                        <span>Question {step} of {QUESTIONS.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-cb-gold transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <h2 className="text-3xl font-bold mb-8 leading-tight">{question.text}</h2>

                {/* Options */}
                <div className="space-y-4">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option.type)}
                            className="w-full text-left p-6 rounded-xl border border-gray-700 hover:border-cb-gold hover:bg-gray-800 transition-all group flex items-center justify-between"
                        >
                            <span className="text-lg text-gray-200 group-hover:text-white">{option.text}</span>
                            <span className="text-gray-500 group-hover:text-cb-gold">→</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
