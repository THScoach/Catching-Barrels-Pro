import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

interface OverallScoreProps {
    score: number | null;
    trend?: number; // Difference from average
    totalSwings?: number;
    lastTestedDate?: string;
}

export default function OverallScore({ score, trend = 0, totalSwings = 0, lastTestedDate }: OverallScoreProps) {
    if (score === null) {
        return (
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <div className="text-gray-500 mb-2">No Data Available</div>
                <div className="text-sm text-gray-600">Add swing data to see your Function Health Score</div>
            </div>
        );
    }

    // Determine color based on score
    // Function Health uses a teal/green for good scores
    const getGradient = (s: number) => {
        if (s >= 90) return "from-emerald-500 to-teal-600";
        if (s >= 80) return "from-teal-500 to-cyan-600";
        if (s >= 70) return "from-blue-500 to-indigo-600";
        if (s >= 60) return "from-yellow-500 to-orange-600";
        return "from-red-500 to-pink-600";
    };

    const gradient = getGradient(score);

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-8 text-white shadow-2xl h-full flex flex-col justify-between`}>
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <h2 className="text-lg font-medium opacity-90 uppercase tracking-wide">Overall Swing Score</h2>

                <div className="flex items-baseline mt-4">
                    <span className="text-8xl font-bold tracking-tighter">{score}</span>
                    <span className="text-2xl opacity-80 ml-1">/100</span>
                </div>

                <div className="mt-6 flex items-center space-x-2">
                    {trend > 0 ? (
                        <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                            <ArrowUpIcon className="w-4 h-4 mr-1" />
                            {trend} pts above avg
                        </div>
                    ) : trend < 0 ? (
                        <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                            <ArrowDownIcon className="w-4 h-4 mr-1" />
                            {Math.abs(trend)} pts below avg
                        </div>
                    ) : (
                        <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                            Average
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/20 flex justify-between items-end text-sm font-medium opacity-80">
                <div>
                    <div className="uppercase text-xs opacity-70 mb-1">Last Tested</div>
                    <div>{lastTestedDate || "Just now"}</div>
                </div>
                <div className="text-right">
                    <div className="uppercase text-xs opacity-70 mb-1">Total Swings</div>
                    <div>{totalSwings} swings analyzed</div>
                </div>
            </div>
        </div>
    );
}
