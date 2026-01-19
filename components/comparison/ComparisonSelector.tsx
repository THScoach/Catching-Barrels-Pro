"use client";

import { useState } from "react";
import Link from "next/link";

export function ComparisonSelector({ lessons }: { lessons: any[] }) {
    const [selected1, setSelected1] = useState<string>("");
    const [selected2, setSelected2] = useState<string>("");

    const canCompare = selected1 && selected2 && selected1 !== selected2;

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Lesson 1 Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Lesson 1 (Baseline)
                    </label>
                    <select
                        value={selected1}
                        onChange={(e) => setSelected1(e.target.value)}
                        className="w-full px-4 py-3 bg-cb-dark border border-cb-dark-accent text-white rounded-lg focus:ring-2 focus:ring-cb-gold focus:border-cb-gold"
                    >
                        <option value="">Select a lesson...</option>
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.name} ({new Date(lesson.createdAt).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Lesson 2 Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Lesson 2 (Comparison)
                    </label>
                    <select
                        value={selected2}
                        onChange={(e) => setSelected2(e.target.value)}
                        className="w-full px-4 py-3 bg-cb-dark border border-cb-dark-accent text-white rounded-lg focus:ring-2 focus:ring-cb-gold focus:border-cb-gold"
                    >
                        <option value="">Select a lesson...</option>
                        {lessons.map((lesson) => (
                            <option key={lesson.id} value={lesson.id}>
                                {lesson.name} ({new Date(lesson.createdAt).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <Link
                    href={canCompare ? `/comparison/${selected1}/${selected2}` : "#"}
                    className={`px-8 py-3 rounded-lg font-bold transition-all ${canCompare
                            ? "bg-cb-gold text-cb-dark hover:bg-cb-gold-dark shadow-lg"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                    aria-disabled={!canCompare}
                >
                    Compare Swings
                </Link>
            </div>
        </div>
    );
}
