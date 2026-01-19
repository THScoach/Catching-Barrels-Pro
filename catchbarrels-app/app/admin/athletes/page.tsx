'use client';

import { useState, useEffect } from 'react';

interface Athlete {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    position: string;
    parentName: string;
    parentEmail: string;
    program: string;
    registeredAt: string;
    status: string;
    _count?: {
        swings: number;
    };
}

export default function AdminAthletesPage() {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterProgram, setFilterProgram] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchAthletes();
    }, []);

    const fetchAthletes = async () => {
        try {
            const res = await fetch('/api/athletes');
            const data = await res.json();
            setAthletes(data.athletes || []);
        } catch (error) {
            console.error('Error fetching athletes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAthletes = athletes.filter(athlete => {
        if (filterProgram !== 'all' && athlete.program !== filterProgram) return false;
        if (filterStatus !== 'all' && athlete.status !== filterStatus) return false;
        return true;
    });

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString();
    };

    if (loading) return <div className="p-8 text-white">Loading athletes...</div>;

    return (
        <div className="p-8 text-white max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-mustard-400">Registered Athletes</h1>
                    <p className="text-slate-400">Manage program registrations</p>
                </div>

                <div className="flex gap-4">
                    <select
                        value={filterProgram}
                        onChange={(e) => setFilterProgram(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white rounded px-4 py-2 outline-none focus:border-mustard-500"
                    >
                        <option value="all">All Programs</option>
                        <option value="Augusta">Augusta</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white rounded px-4 py-2 outline-none focus:border-mustard-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Age / Pos</th>
                            <th className="px-6 py-4">Parent Info</th>
                            <th className="px-6 py-4">Program</th>
                            <th className="px-6 py-4">Registered</th>
                            <th className="px-6 py-4 text-center">Videos</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filteredAthletes.map(athlete => (
                            <tr key={athlete.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white text-lg">{athlete.firstName} {athlete.lastName}</div>
                                    <div className="text-xs text-slate-500 font-mono">{athlete.id.substring(0, 8)}...</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-white">{calculateAge(athlete.dateOfBirth)} years</div>
                                    <div className="text-xs text-slate-400">{athlete.position || '-'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-white font-bold">{athlete.parentName}</div>
                                    <div className="text-xs text-slate-400">{athlete.parentEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-900 text-mustard-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-600">
                                        {athlete.program}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-300 text-sm">
                                    {formatDate(athlete.registeredAt)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold">
                                        {athlete._count?.swings || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-sm font-bold text-mustard-400 hover:text-mustard-300 mr-4">
                                        View
                                    </button>
                                    <button className="text-sm font-bold text-blue-400 hover:text-blue-300">
                                        Upload
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAthletes.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                    No athletes found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="text-3xl font-bold text-white mb-1">{athletes.length}</div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider">Total Athletes</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="text-3xl font-bold text-mustard-400 mb-1">
                        {athletes.filter(a => a.program === 'Augusta').length}
                    </div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider">Augusta Program</div>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                        {athletes.reduce((sum, a) => sum + (a._count?.swings || 0), 0)}
                    </div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider">Total Videos</div>
                </div>
            </div>
        </div>
    );
}
