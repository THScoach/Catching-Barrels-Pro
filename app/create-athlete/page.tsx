"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAthletePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch("/api/create-athlete", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create athlete");
            }

            router.push("/parent-dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
                <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    Create Athlete Profile
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    Set up a new account for your athlete. They will complete their profile on first login.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Login Credentials */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                            Login Information
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    name="athleteName"
                                    type="text"
                                    placeholder="Athlete's Full Name"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                <input
                                    name="athleteEmail"
                                    type="email"
                                    placeholder="Athlete's Email (for login)"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Temporary Password</label>
                                <input
                                    name="athletePassword"
                                    type="password"
                                    placeholder="Create a temporary password"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The athlete will be required to change this password on their first login.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Physical Attributes */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                            Physical Attributes <span className="text-sm font-normal text-gray-500">(Required)</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                                <input
                                    name="birthDate"
                                    type="date"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Height (inches)</label>
                                <input
                                    name="height"
                                    type="number"
                                    step="0.5"
                                    placeholder="e.g. 72"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Weight (lbs)</label>
                                <input
                                    name="weight"
                                    type="number"
                                    step="0.5"
                                    placeholder="e.g. 185"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Baseball Details */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                            Baseball Details <span className="text-sm font-normal text-gray-500">(Optional)</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Primary Position</label>
                                <select
                                    name="position"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Select Position</option>
                                    <option value="C">Catcher</option>
                                    <option value="1B">First Base</option>
                                    <option value="2B">Second Base</option>
                                    <option value="3B">Third Base</option>
                                    <option value="SS">Shortstop</option>
                                    <option value="OF">Outfielder</option>
                                    <option value="P">Pitcher</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Batting Stance</label>
                                <select
                                    name="stance"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Select Stance</option>
                                    <option value="right">Right Handed</option>
                                    <option value="left">Left Handed</option>
                                    <option value="switch">Switch Hitter</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Bats</label>
                                <select
                                    name="batHand"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Select Hand</option>
                                    <option value="right">Right</option>
                                    <option value="left">Left</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Throws</label>
                                <select
                                    name="throwHand"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Select Hand</option>
                                    <option value="right">Right</option>
                                    <option value="left">Left</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Profile..." : "Create Athlete Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
