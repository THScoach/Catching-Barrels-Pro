'use client';

import { useState } from 'react';

interface ProModel {
    id?: string;
    name: string;
    team: string;
    position: string;
    handedness: string;
    anchorScore: number;
    coreScore: number;
    whipScore: number;
    isProModel: boolean;
    featured: boolean;
    thumbnailUrl: string;
    videoUrl: string;
}

interface AddProModelFormProps {
    player?: ProModel;
    onClose: () => void;
    onSaved: () => void;
}

export default function AddProModelForm({ player, onClose, onSaved }: AddProModelFormProps) {
    const [data, setData] = useState<ProModel>(player || {
        name: '',
        team: '',
        position: '',
        handedness: 'R',
        anchorScore: 9.0,
        coreScore: 9.5,
        whipScore: 9.0,
        isProModel: true,
        featured: false,
        thumbnailUrl: '',
        videoUrl: ''
    });

    const [saving, setSaving] = useState(false);

    const overallScore = ((data.anchorScore + data.coreScore + data.whipScore) / 3).toFixed(2);

    async function handleSave() {
        setSaving(true);
        try {
            const endpoint = player ? `/api/admin/players/${player.id}` : '/api/admin/players';
            const method = player ? 'PATCH' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to save');

            onSaved();
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save player');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{player ? 'Edit' : 'Add'} Pro Model</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm uppercase text-slate-500 font-bold tracking-wider">Player Info</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Player Name</label>
                                <input
                                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-mustard-500 outline-none"
                                    placeholder="e.g. Freddie Freeman"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Team</label>
                                <input
                                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-mustard-500 outline-none"
                                    placeholder="e.g. Dodgers"
                                    value={data.team}
                                    onChange={(e) => setData({ ...data, team: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Position</label>
                                <input
                                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-mustard-500 outline-none"
                                    placeholder="e.g. 1B"
                                    value={data.position}
                                    onChange={(e) => setData({ ...data, position: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Handedness</label>
                                <select
                                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-mustard-500 outline-none"
                                    value={data.handedness}
                                    onChange={(e) => setData({ ...data, handedness: e.target.value })}
                                >
                                    <option value="R">Right</option>
                                    <option value="L">Left</option>
                                    <option value="S">Switch</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm uppercase text-slate-500 font-bold tracking-wider">Biomechanics Scores (0-10)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between mb-2">
                                    <span className="text-blue-400 font-bold">⚓ Anchor</span>
                                    <span className="text-white font-mono">{data.anchorScore}</span>
                                </div>
                                <input
                                    type="range"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    className="w-full accent-blue-500"
                                    value={data.anchorScore}
                                    onChange={(e) => setData({ ...data, anchorScore: parseFloat(e.target.value) })}
                                />
                                <div className="text-xs text-slate-500 mt-2">Ground connection & stability</div>
                            </label>

                            <label className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between mb-2">
                                    <span className="text-green-400 font-bold">⚡ Core</span>
                                    <span className="text-white font-mono">{data.coreScore}</span>
                                </div>
                                <input
                                    type="range"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    className="w-full accent-green-500"
                                    value={data.coreScore}
                                    onChange={(e) => setData({ ...data, coreScore: parseFloat(e.target.value) })}
                                />
                                <div className="text-xs text-slate-500 mt-2">Rotation & sequence</div>
                            </label>

                            <label className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="flex justify-between mb-2">
                                    <span className="text-red-400 font-bold">⚔️ Whip</span>
                                    <span className="text-white font-mono">{data.whipScore}</span>
                                </div>
                                <input
                                    type="range"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    className="w-full accent-red-500"
                                    value={data.whipScore}
                                    onChange={(e) => setData({ ...data, whipScore: parseFloat(e.target.value) })}
                                />
                                <div className="text-xs text-slate-500 mt-2">Bat speed generation</div>
                            </label>
                        </div>

                        <div className="bg-slate-800/50 p-3 rounded text-center border border-slate-700">
                            <span className="text-slate-400 mr-2">Calculated Overall Score:</span>
                            <span className="text-xl font-bold text-mustard-400">{overallScore}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm uppercase text-slate-500 font-bold tracking-wider">Media</h3>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Thumbnail URL (Optional)</label>
                            <input
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-mustard-500 outline-none"
                                placeholder="https://..."
                                value={data.thumbnailUrl || ''}
                                onChange={(e) => setData({ ...data, thumbnailUrl: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Video URL (Optional)</label>
                            <input
                                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-mustard-500 outline-none"
                                placeholder="https://..."
                                value={data.videoUrl || ''}
                                onChange={(e) => setData({ ...data, videoUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm uppercase text-slate-500 font-bold tracking-wider">Display Options</h3>

                        <div className="flex gap-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-mustard-500 focus:ring-mustard-500"
                                    checked={data.isProModel}
                                    onChange={(e) => setData({ ...data, isProModel: e.target.checked })}
                                />
                                <span className="text-white">Enable as Pro Model</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-mustard-500 focus:ring-mustard-500"
                                    checked={data.featured}
                                    onChange={(e) => setData({ ...data, featured: e.target.checked })}
                                />
                                <span className="text-white">Feature on Homepage</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white font-medium"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-mustard-500 hover:bg-mustard-600 text-black font-bold py-2 px-6 rounded disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : (player ? 'Update Pro Model' : 'Add Pro Model')}
                    </button>
                </div>
            </div>
        </div>
    );
}
