import React from 'react';

interface Alert {
    id: string;
    athleteName: string | null; // Update to match Prisma optional
    alertType: string;
    priority: string; // Changed from severity
    message: string;
    createdAt: Date;
}

interface AIAlertsPanelProps {
    alerts: Alert[];
}

export function AIAlertsPanel({ alerts }: AIAlertsPanelProps) {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-full flex flex-col justify-center items-center text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-xl font-bold text-white mb-1">All Clear</h3>
                <p className="text-gray-400 text-sm">No critical alerts requiring your attention.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>⚠️</span> AI Alerts
                </h3>
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full">
                    {alerts.length} New
                </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {alerts.map((alertItem) => (
                    <div key={alertItem.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-white text-sm">{alertItem.athleteName || 'Unknown Athlete'}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${alertItem.priority === 'high' ? 'bg-red-500 text-white' :
                                    alertItem.priority === 'medium' ? 'bg-yellow-500 text-black' :
                                        'bg-blue-500 text-white'
                                }`}>
                                {alertItem.alertType}
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{alertItem.message}</p>
                        <div className="text-xs text-gray-500 flex justify-between">
                            <span>{new Date(alertItem.createdAt).toLocaleDateString()}</span>
                            <button className="text-indigo-400 hover:text-indigo-300 font-medium">
                                Review →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
