export function generateComparisonInsights(lesson1: any, lesson2: any) {
    const improvements: string[] = [];
    const regressions: string[] = [];
    const drillIds: string[] = [];

    // Helper to check improvement
    const checkMetric = (
        metricKey: string,
        label: string,
        goodDirection: "higher" | "lower" = "higher",
        threshold: number = 0
    ) => {
        const val1 = lesson1[metricKey] || 0;
        const val2 = lesson2[metricKey] || 0;
        const diff = val2 - val1;

        if (goodDirection === "higher") {
            if (diff > threshold) {
                improvements.push(`${label} improved by ${diff.toFixed(1)}`);
            } else if (diff < -threshold) {
                regressions.push(`${label} decreased by ${Math.abs(diff).toFixed(1)}`);
            }
        } else {
            if (diff < -threshold) {
                improvements.push(`${label} improved by ${Math.abs(diff).toFixed(1)}`);
            } else if (diff > threshold) {
                regressions.push(`${label} worsened by ${diff.toFixed(1)}`);
            }
        }
    };

    // Check Core Metrics
    checkMetric("overallScore", "Overall Score", "higher", 2);
    checkMetric("barrelScore", "Barrel Score", "higher", 2);
    checkMetric("groundScore", "Ground Score", "higher", 2);
    checkMetric("coreScore", "Core Score", "higher", 2);
    checkMetric("whipScore", "Whip Score", "higher", 2);
    checkMetric("avgExitVelo", "Exit Velocity", "higher", 1);
    checkMetric("avgBatSpeed", "Bat Speed", "higher", 1);

    // Generate Summary
    let summary = "";
    if (improvements.length > regressions.length) {
        summary = `Great work! You're showing solid progress in ${improvements.length} key areas. Your ${improvements[0].split(" improved")[0]} is trending in the right direction. Keep focusing on these mechanics.`;
    } else if (regressions.length > improvements.length) {
        summary = `I'm seeing some regression in your mechanics, specifically with ${regressions[0].split(" decreased")[0]}. Let's get back to basics and focus on the drills below to clean this up.`;
    } else {
        summary = "You're maintaining consistent performance. To break through to the next level, try increasing the intensity of your core drills.";
    }

    // Recommend Drills (Placeholder logic - would map to real Drill IDs)
    if (lesson2.barrelScore < 70) drillIds.push("drill-barrel-1");
    if (lesson2.groundScore < 70) drillIds.push("drill-ground-1");
    if (lesson2.coreScore < 70) drillIds.push("drill-core-1");
    if (lesson2.whipScore < 70) drillIds.push("drill-whip-1");

    return {
        summary,
        improvements,
        regressions,
        drillIds,
    };
}
