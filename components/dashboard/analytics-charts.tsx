"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    ReferenceLine,
    ScatterChart,
    Scatter,
    ZAxis,
} from "recharts";

interface AnalyticsChartsProps {
    swings: any[]; // Using any to avoid strict type issues with Prisma includes
}

export default function AnalyticsCharts({ swings }: AnalyticsChartsProps) {
    // Filter for valid swings with metrics
    const validSwings = swings.filter((s) => s.swingMetrics).reverse(); // Reverse to show chronological order

    if (validSwings.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 flex flex-col items-center justify-center text-center h-64">
                <p className="text-gray-400 mb-2">No chart data available yet.</p>
                <p className="text-sm text-gray-500">Add more swings to see your trends!</p>
            </div>
        );
    }

    // Prepare data for Overall Score Trend
    const scoreTrendData = validSwings.map((s) => ({
        date: new Date(s.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        overall: s.swingMetrics.overallScore || 0,
        barrel: s.swingMetrics.barrelScore || 0,
        ground: s.swingMetrics.groundScore || 0,
        core: s.swingMetrics.coreScore || 0,
        whip: s.swingMetrics.whipScore || 0,
    }));

    // Prepare data for Exit Velocity Trend
    const exitVeloData = validSwings.map((s) => ({
        date: new Date(s.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: s.swingMetrics.exitVelocity || 0,
    }));

    // Prepare data for Bat Speed Trend
    const batSpeedData = validSwings.map((s) => ({
        date: new Date(s.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: s.swingMetrics.batSpeed || 0,
    }));

    // Prepare data for Launch Angle Distribution
    const launchAngleData = validSwings.map((s) => ({
        name: new Date(s.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: s.swingMetrics.launchAngle || 0,
    }));

    // Prepare data for Sweet Spot Analysis (Exit Velo vs Launch Angle)
    const sweetSpotData = validSwings.map((s) => ({
        x: s.swingMetrics.launchAngle || 0,
        y: s.swingMetrics.exitVelocity || 0,
        z: 1, // Size
    }));

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 border border-gray-700 p-3 rounded-xl shadow-xl">
                    <p className="text-gray-400 text-xs mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-gray-300 text-sm capitalize">{entry.name}:</span>
                            <span className="text-white font-bold text-sm">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Score Trend */}
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 lg:col-span-2">
                <h3 className="text-lg font-medium text-white mb-6">Overall Score Trend</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={scoreTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="overall"
                                name="Overall"
                                stroke="#10B981" // Emerald-500
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="barrel"
                                name="Barrel"
                                stroke="#3B82F6" // Blue-500
                                strokeWidth={2}
                                strokeOpacity={0.5}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Exit Velocity Trend */}
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-6">Exit Velocity Trend</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={exitVeloData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                name="Exit Velo"
                                stroke="#F59E0B" // Amber-500
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#F59E0B", strokeWidth: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bat Speed Trend */}
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-6">Bat Speed Trend</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={batSpeedData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                name="Bat Speed"
                                stroke="#8B5CF6" // Purple-500
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sweet Spot Analysis */}
            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 lg:col-span-2">
                <h3 className="text-lg font-medium text-white mb-6">Sweet Spot Analysis</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis
                                type="number"
                                dataKey="x"
                                name="Launch Angle"
                                unit="°"
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                domain={[-10, 50]}
                            />
                            <YAxis
                                type="number"
                                dataKey="y"
                                name="Exit Velo"
                                unit=" mph"
                                stroke="#9CA3AF"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                            />
                            <ZAxis type="number" dataKey="z" range={[60, 60]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                            <Scatter name="Swings" data={sweetSpotData} fill="#F59E0B" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
