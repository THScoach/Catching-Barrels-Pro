"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddSwingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddSwingModal({ isOpen, onClose }: AddSwingModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0], // Default to today
        exitVelocity: "",
        launchAngle: "",
        batSpeed: "",
        notes: "",
        overallScore: "",
        barrelScore: "",
        groundScore: "",
        coreScore: "",
        whipScore: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/swings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to save swing data");
            }

            // Success
            router.refresh(); // Refresh server components to show new data
            onClose();
            // Reset form (optional, but good practice if modal is reused)
            setFormData({
                date: new Date().toISOString().split("T")[0],
                exitVelocity: "",
                launchAngle: "",
                batSpeed: "",
                notes: "",
                overallScore: "",
                barrelScore: "",
                groundScore: "",
                coreScore: "",
                whipScore: "",
            });
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-4">Add Swing Data</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Exit Velocity (mph)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="exitVelocity"
                                value={formData.exitVelocity}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="e.g. 85.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Launch Angle (deg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                name="launchAngle"
                                value={formData.launchAngle}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                placeholder="e.g. 15"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Bat Speed (mph)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            name="batSpeed"
                            value={formData.batSpeed}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                            placeholder="e.g. 70.2"
                        />
                    </div>

                    {/* Function Health Scores */}
                    <div className="space-y-4 pt-4 border-t border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Function Health Scores (0-100)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-blue-400 mb-1">
                                    Overall Swing Score
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    name="overallScore"
                                    value={formData.overallScore}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="0-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-green-400 mb-1">
                                    Barrel Score
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    name="barrelScore"
                                    value={formData.barrelScore}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-green-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                                    placeholder="0-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-purple-400 mb-1">
                                    Core Score
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    name="coreScore"
                                    value={formData.coreScore}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="0-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-orange-400 mb-1">
                                    Whip Score
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    name="whipScore"
                                    value={formData.whipScore}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-orange-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                                    placeholder="0-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-400 mb-1">
                                    Ground Score
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    name="groundScore"
                                    value={formData.groundScore}
                                    onChange={handleChange}
                                    className="w-full bg-gray-800 border border-blue-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="0-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 h-24 resize-none"
                            placeholder="How did it feel?"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                        >
                            {isSubmitting ? "Saving..." : "Save Swing"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
