'use client';

import { useState, useEffect } from 'react';

interface HealthMetric {
    status: 'optimal' | 'warning' | 'risk';
    value: number | string;
    label: string;
}

interface FunctionalHealth {
    headStability: HealthMetric;
    spineAngle: HealthMetric;
    leadLegBlock: HealthMetric;
    recovery: HealthMetric;
}

export default function FunctionalHealthPanel() {
    const [health, setHealth] = useState<FunctionalHealth | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching biomechanics health data
        setTimeout(() => {
            setHealth({
                headStability: { status: 'optimal', value: '1.2in', label: 'Head Drift' },
                spineAngle: { status: 'warning', value: '12°', label: 'Spine Ext.' },
                leadLegBlock: { status: 'risk', value: 'Weak', label: 'Knee Flexion' },
                recovery: { status: 'optimal', value: '95%', label: 'Readiness' }
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="animate-pulse h-48 bg-slate-800 rounded-xl"></div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'optimal': return 'text-green-400 border-green-500/30 bg-green-500/20';
            case 'warning': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/20';
            case 'risk': return 'text-red-400 border-red-500/30 bg-red-500/20';
            default: return 'text-slate-400 border-slate-500/30 bg-slate-500/20';
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🏥</span> Functional Health
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Head Stability */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm font-bold uppercase">Head Stability</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(health?.headStability.status || '')}`}>
                            {health?.headStability.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-2xl font-mono text-white">{health?.headStability.value}</div>
                    <div className="text-xs text-slate-500">{health?.headStability.label}</div>
                </div>

                {/* Spine Angle */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm font-bold uppercase">Spine Control</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(health?.spineAngle.status || '')}`}>
                            {health?.spineAngle.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-2xl font-mono text-white">{health?.spineAngle.value}</div>
                    <div className="text-xs text-slate-500">{health?.spineAngle.label}</div>
                </div>

                {/* Lead Leg Block */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm font-bold uppercase">Lead Leg</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(health?.leadLegBlock.status || '')}`}>
                            {health?.leadLegBlock.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-2xl font-mono text-white">{health?.leadLegBlock.value}</div>
                    <div className="text-xs text-slate-500">{health?.leadLegBlock.label}</div>
                </div>

                {/* Recovery/Readiness */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm font-bold uppercase">Recovery</span>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(health?.recovery.status || '')}`}>
                            {health?.recovery.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="text-2xl font-mono text-white">{health?.recovery.value}</div>
                    <div className="text-xs text-slate-500">{health?.recovery.label}</div>
                </div>
            </div>
        </div>
    );
}
