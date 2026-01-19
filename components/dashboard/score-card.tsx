import React from "react";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "@heroicons/react/24/solid";

interface ScoreCardProps {
    title: string;
    score: number | null;
    maxScore?: number;
    icon: React.ReactNode;
    color: "green" | "blue" | "purple" | "orange";
    trend?: number; // Difference from average
}

export default function ScoreCard({ title, score, icon, color, trend = 0 }: ScoreCardProps) {
    if (score === null) {
        return (
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <div className="text-gray-500 mb-2">{icon}</div>
                <div className="text-sm text-gray-600">No Data</div>
            </div>
        );
    }

    const getGradient = (c: string) => {
        switch (c) {
            case "green": return "from-emerald-500/20 to-teal-600/20 border-emerald-500/30";
            case "blue": return "from-blue-500/20 to-indigo-600/20 border-blue-500/30";
            case "purple": return "from-purple-500/20 to-violet-600/20 border-purple-500/30";
            case "orange": return "from-orange-500/20 to-red-600/20 border-orange-500/30";
            default: return "from-gray-800 to-gray-900 border-gray-700";
        }
    };

    const getTextColor = (c: string) => {
        switch (c) {
            case "green": return "text-emerald-400";
            case "blue": return "text-blue-400";
            case "purple": return "text-purple-400";
            case "orange": return "text-orange-400";
            default: return "text-gray-400";
        }
    };

    const gradient = getGradient(color);
    const textColor = getTextColor(color);

    // Determine status text
    let statusText = "Average";
    if (score >= 90) statusText = "Elite";
    else if (score >= 80) statusText = "Great";
    else if (score >= 70) statusText = "Good";
    else if (score < 60) statusText = "Needs Work";

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} border p-6 flex flex-col justify-between h-full transition-all hover:scale-[1.02] duration-300`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-black/20 backdrop-blur-sm ${textColor}`}>
                    {icon}
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm ${textColor}`}>
                    {statusText}
                </div>
            </div>

            <div>
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">{title}</h3>
                <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-white tracking-tighter">{score}</span>
                    <span className="text-lg text-gray-500 ml-1">/100</span>
                </div>
            </div>

            <div className="mt-4 flex items-center text-sm font-medium">
                {trend > 0 ? (
                    <span className="text-green-400 flex items-center">
                        <ArrowUpIcon className="w-3 h-3 mr-1" />
                        +{trend} pts
                    </span>
                ) : trend < 0 ? (
                    <span className="text-red-400 flex items-center">
                        <ArrowDownIcon className="w-3 h-3 mr-1" />
                        {trend} pts
                    </span>
                ) : (
                    <span className="text-gray-500 flex items-center">
                        <MinusIcon className="w-3 h-3 mr-1" />
                        No change
                    </span>
                )}
                <span className="text-gray-600 ml-2">vs avg</span>
            </div>
        </div>
    );
}
