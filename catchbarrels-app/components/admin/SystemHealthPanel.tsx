'use client';

import { useState, useEffect } from 'react';

interface HealthMetric {
    status: 'healthy' | 'degraded' | 'down';
    latency?: number;
    message?: string;
}

interface SystemHealth {
    api: HealthMetric;
    database: HealthMetric;
    storage: {
        used: string;
        total: string;
        percent: number;
    };
    queue: {
        pending: number;
        processing: number;
    };
}

export default function SystemHealthPanel() {
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching health data
        // In a real app, this would call /api/system/health
        setTimeout(() => {
            setHealth({
                api: { status: 'healthy', latency: 45 },
                database: { status: 'healthy', latency: 12 },
                storage: { used: '45GB', total: '67GB', percent: 67 },
                queue: { pending: 0, processing: 1 }
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="animate-pulse h-48 bg-slate-800 rounded-xl"></div>;

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-2xl">🖥️</span> System Health
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API Status */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm font-bold uppercase">Video Analysis API</span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/30">
                            ONLINE
                        </span>
                    </div>
                    <div className="text-2xl font-mono text-white">{health?.api.latency}ms</div>
                    <div className="text-xs text-slate-500">Latency</div>
                </div>

                {/* Database Status */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm font-bold uppercase">Database</span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/30">
                            HEALTHY
                        </span>
                    </div>
                    <div className="text-2xl font-mono text-white">{health?.database.latency}ms</div>
                    <div className="text-xs text-slate-500">Response Time</div>
                </div>

                {/* Storage */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm font-bold uppercase">Storage</span>
                        <span className="text-slate-300 text-xs">{health?.storage.used} / {health?.storage.total}</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{ width: `${health?.storage.percent}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">{health?.storage.percent}% Used</div>
                </div>

                {/* Queue */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm font-bold uppercase">Analysis Queue</span>
                        <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold">
                            IDLE
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <div className="text-2xl font-mono text-white">{health?.queue.pending}</div>
                            <div className="text-xs text-slate-500">Pending</div>
                        </div>
                        <div>
                            <div className="text-2xl font-mono text-mustard-400">{health?.queue.processing}</div>
                            <div className="text-xs text-slate-500">Processing</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
