export function MetricsDiff({ lesson1, lesson2 }: { lesson1: any; lesson2: any }) {
    const metrics = [
        {
            label: "Overall Score",
            value1: lesson1.overallScore,
            value2: lesson2.overallScore,
            unit: "",
        },
        {
            label: "Barrel Score",
            value1: lesson1.barrelScore,
            value2: lesson2.barrelScore,
            unit: "",
            icon: "💥",
        },
        {
            label: "Ground Score",
            value1: lesson1.groundScore,
            value2: lesson2.groundScore,
            unit: "",
            icon: "⚡",
        },
        {
            label: "Core Score",
            value1: lesson1.coreScore,
            value2: lesson2.coreScore,
            unit: "",
            icon: "🌪️",
        },
        {
            label: "Whip Score",
            value1: lesson1.whipScore,
            value2: lesson2.whipScore,
            unit: "",
            icon: "🔥",
        },
        {
            label: "Exit Velocity",
            value1: lesson1.avgExitVelo,
            value2: lesson2.avgExitVelo,
            unit: " mph",
        },
        {
            label: "Bat Speed",
            value1: lesson1.avgBatSpeed,
            value2: lesson2.avgBatSpeed,
            unit: " mph",
        },
        {
            label: "Launch Angle",
            value1: lesson1.avgLaunchAngle,
            value2: lesson2.avgLaunchAngle,
            unit: "°",
        },
    ];

    return (
        <div className="bg-cb-dark-card rounded-2xl p-6 border border-cb-dark-accent mb-6">
            <h3 className="text-2xl font-bold text-white mb-6">Metrics Comparison</h3>

            <div className="space-y-4">
                {metrics.map((metric) => {
                    const val1 = metric.value1 || 0;
                    const val2 = metric.value2 || 0;
                    const diff = val2 - val1;
                    const percentChange =
                        val1 ? ((diff / val1) * 100).toFixed(1) : "0";
                    const isImprovement = diff > 0;

                    return (
                        <div
                            key={metric.label}
                            className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center"
                        >
                            {/* Before */}
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-400">
                                    {metric.value1 ? Math.round(metric.value1) : "--"}
                                    {metric.unit}
                                </div>
                            </div>

                            {/* Middle (Label + Diff) */}
                            <div className="flex flex-col items-center min-w-[140px]">
                                <div className="text-sm text-gray-500 mb-1">
                                    {metric.icon} {metric.label}
                                </div>
                                <div
                                    className={`text-lg font-bold ${isImprovement ? "text-green-500" : diff < 0 ? "text-red-500" : "text-gray-500"
                                        }`}
                                >
                                    {isImprovement ? "↗" : diff < 0 ? "↘" : "→"}{" "}
                                    {diff > 0 ? "+" : ""}
                                    {diff.toFixed(1)}
                                    {metric.unit} ({percentChange}%)
                                </div>
                            </div>

                            {/* After */}
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {metric.value2 ? Math.round(metric.value2) : "--"}
                                    {metric.unit}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
