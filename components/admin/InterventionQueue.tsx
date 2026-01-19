import React from 'react';

interface Intervention {
    id: string;
    athleteName: string;
    reason: string;
    urgency: string;
    scheduledBy: string;
    createdAt: Date;
}

interface InterventionQueueProps {
    interventions: Intervention[];
}

export function InterventionQueue({ interventions }: InterventionQueueProps) {
    if (!interventions || interventions.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full flex flex-col justify-center items-center text-center">
                <div className="text-4xl mb-2">👍</div>
                <h3 className="text-xl font-bold text-white mb-1">Queue Empty</h3>
                <p className="text-gray-400 text-sm">No pending interventions to approve.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>📉</span> Intervention Queue
                </h3>
                <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded-full">
                    {interventions.length} Pending
                </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {interventions.map((item) => (
                    <div key={item.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-white text-sm">{item.athleteName}</span>
                            <span className="text-xs text-gray-400 italic">via {item.scheduledBy}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{item.reason}</p>
                        <div className="flex gap-2">
                            <button className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded transition-colors">
                                Approve
                            </button>
                            <button className="flex-1 px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs font-bold rounded transition-colors">
                                Dismiss
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
