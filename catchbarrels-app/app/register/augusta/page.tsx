'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AugustaRegistrationPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Player
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        height: '',
        weight: '',
        handedness: '',
        position: '',

        // Parent
        parentName: '',
        parentEmail: '',
        parentPhone: '',

        // Program
        program: 'Augusta',
        teamName: '',
        season: 'Winter 2025'
    });

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/athletes/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                router.push(`/success?athleteId=${data.athlete.id}`);
            } else {
                alert(`Registration failed: ${data.error}`);
            }

        } catch (error) {
            console.error('Submit error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-mustard-400 mb-2">Player Registration</h1>
                    <p className="text-xl text-slate-300">Augusta Program • Winter 2025</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 md:p-10 border border-slate-700 shadow-2xl space-y-8">

                    {/* Player Info */}
                    <section>
                        <h2 className="text-xl font-bold text-mustard-400 mb-4 border-b border-slate-700 pb-2">Player Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">First Name *</label>
                                <input
                                    required
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Last Name *</label>
                                <input
                                    required
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-1">Player Email (Optional)</label>
                            <input
                                type="email"
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-1">Date of Birth *</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none text-white"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Height (inches)</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Weight (lbs)</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Handedness</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none text-white"
                                    value={formData.handedness}
                                    onChange={(e) => setFormData({ ...formData, handedness: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="R">Right</option>
                                    <option value="L">Left</option>
                                    <option value="S">Switch</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Primary Position</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Parent Info */}
                    <section>
                        <h2 className="text-xl font-bold text-mustard-400 mb-4 border-b border-slate-700 pb-2">Parent/Guardian Information</h2>

                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-1">Parent Name *</label>
                            <input
                                required
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                value={formData.parentName}
                                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-1">Parent Email *</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                value={formData.parentEmail}
                                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-1">Parent Phone *</label>
                            <input
                                type="tel"
                                required
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                value={formData.parentPhone}
                                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                            />
                        </div>
                    </section>

                    {/* Program Info */}
                    <section>
                        <h2 className="text-xl font-bold text-mustard-400 mb-4 border-b border-slate-700 pb-2">Program Details</h2>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Team Name (if applicable)</label>
                            <input
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:border-mustard-500 outline-none"
                                value={formData.teamName}
                                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                placeholder="e.g. Augusta Eagles 14u"
                            />
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-mustard-500 hover:bg-mustard-400 text-black font-bold text-lg py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    >
                        {submitting ? 'Registering...' : 'Register for Augusta Program'}
                    </button>

                    <p className="text-center text-slate-500 text-sm">
                        By registering, you agree to the CatchBarrels terms of service and privacy policy.
                    </p>
                </form>
            </div>
        </div>
    );
}
