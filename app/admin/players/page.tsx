'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AddProModelForm from '@/components/admin/AddProModelForm';

export default function PlayersPage() {
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const res = await fetch('/api/admin/players');
            const data = await res.json();
            setPlayers(data.players || []);
        } catch (error) {
            console.error('Failed to fetch players:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleField = async (id: string, field: 'isProModel' | 'featured', value: boolean) => {
        try {
            const res = await fetch(`/api/admin/players/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            });
            if (res.ok) {
                setPlayers(players.map(p => p.id === id ? { ...p, [field]: value } : p));
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const handleEdit = (player: any) => {
        setEditingPlayer(player);
        setShowAddForm(true);
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingPlayer(null);
    };

    const handleSaved = () => {
        handleCloseForm();
        fetchPlayers();
    };

    if (loading) return <div className="p-8 text-white">Loading players...</div>;

    return (
        <div className="p-8 text-white max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-mustard-400">Player Management</h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-mustard-500 hover:bg-mustard-600 text-black font-bold py-2 px-6 rounded"
                >
                    + Add Pro Model
                </button>
            </div>

            {/* Players Table */}
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                <table className="w-full text-left">
                    <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name / ID</th>
                            <th className="px-6 py-4">Team / Pos</th>
                            <th className="px-6 py-4">Scores (A/C/W)</th>
                            <th className="px-6 py-4 text-center">Pro Model?</th>
                            <th className="px-6 py-4 text-center">Featured?</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {players.map(player => (
                            <tr key={player.id} className="hover:bg-slate-800/50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white">{player.name}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    {player.team || '-'} <span className="text-slate-500">•</span> {player.position || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2 text-sm">
                                        <span className="text-blue-400" title="Anchor">{player.anchorScore?.toFixed(1) || '-'}</span>
                                        <span className="text-slate-600">/</span>
                                        <span className="text-green-400" title="Core">{player.coreScore?.toFixed(1) || '-'}</span>
                                        <span className="text-slate-600">/</span>
                                        <span className="text-red-400" title="Whip">{player.whipScore?.toFixed(1) || '-'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={player.isProModel}
                                        onChange={(e) => toggleField(player.id, 'isProModel', e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-mustard-500 focus:ring-mustard-500"
                                    />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={player.featured}
                                        onChange={(e) => toggleField(player.id, 'featured', e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-mustard-500 focus:ring-mustard-500"
                                    />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleEdit(player)}
                                        className="text-sm text-mustard-400 hover:text-mustard-300 mr-4"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {players.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                    No players found. Add a Pro Model to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showAddForm && (
                <AddProModelForm
                    player={editingPlayer}
                    onClose={handleCloseForm}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
