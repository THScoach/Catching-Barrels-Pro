'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PlayerDetailPage({ params }: { params: { id: string } }) {
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchPlayer();
    }, []);

    const fetchPlayer = async () => {
        try {
            const res = await fetch(`/api/admin/players/${params.id}`);
            if (!res.ok) throw new Error('Failed to fetch player');
            const data = await res.json();
            setPlayer(data.player);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleField = async (field: 'isProModel' | 'featured', value: boolean) => {
        try {
            const res = await fetch(`/api/admin/players/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            });
            if (res.ok) {
                setPlayer({ ...player, [field]: value });
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading player details...</div>;
    if (!player) return <div className="p-8 text-white">Player not found</div>;

    return (
        <div className="p-8 text-white max-w-7xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <Link href="/admin/players" className="text-slate-400 hover:text-white">
                    ← Back to Players
                </Link>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 mb-8 border border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-mustard-400 mb-2">{player.name}</h1>
                        <div className="flex gap-4 text-slate-400 text-sm mb-4">
                            <span>{player.team}</span>
                            <span>•</span>
                            <span>{player.position}</span>
                            <span>•</span>
                            <span>{player.handedness}</span>
                        </div>
                        <div className="text-xs font-mono text-slate-500">
                            Reboot ID: {player.rebootPlayerId}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-4 py-2 rounded border border-slate-700">
                            <input
                                type="checkbox"
                                checked={player.isProModel}
                                onChange={(e) => toggleField('isProModel', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-600 text-mustard-500 focus:ring-mustard-500"
                            />
                            <span className="font-bold">Pro Model</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-4 py-2 rounded border border-slate-700">
                            <input
                                type="checkbox"
                                checked={player.featured}
                                onChange={(e) => toggleField('featured', e.target.checked)}
                                className="w-5 h-5 rounded border-slate-600 text-mustard-500 focus:ring-mustard-500"
                            />
                            <span className="font-bold">Featured</span>
                        </label>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-4">
                    <ScoreCard label="Anchor" value={player.groundScore} color="text-blue-400" />
                    <ScoreCard label="Core" value={player.coreScore} color="text-green-400" />
                    <ScoreCard label="Whip" value={player.whipScore} color="text-red-400" />
                    <ScoreCard label="Overall" value={player.overallScore} color="text-mustard-400" />
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4 text-white">Imported Sessions ({player.rebootSessions?.length || 0})</h2>
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Session ID</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Scores (A/C/W)</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {player.rebootSessions?.map((session: any) => (
                            <tr key={session.id} className="hover:bg-slate-800/50">
                                <td className="px-6 py-4 text-white">
                                    {session.date || 'Unknown Date'}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                    {session.sessionId}
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    {session.sessionType || 'Hitting'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-blue-400">{session.anchorScore?.toFixed(1) || '-'}</span>
                                        <span className="text-slate-600">/</span>
                                        <span className="text-green-400">{session.coreScore?.toFixed(1) || '-'}</span>
                                        <span className="text-slate-600">/</span>
                                        <span className="text-red-400">{session.whipScore?.toFixed(1) || '-'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded border border-slate-600">
                                        View Data
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!player.rebootSessions || player.rebootSessions.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No sessions imported for this player yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ScoreCard({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
            <div className="text-slate-400 text-xs uppercase font-bold mb-1">{label}</div>
            <div className={`text-3xl font-bold ${color}`}>{value?.toFixed(1) || '0.0'}</div>
        </div>
    );
}
