export function ImprovementHighlight({ improvements, regressions }: { improvements: string[]; regressions: string[] }) {
    if (improvements.length === 0 && regressions.length === 0) return null;

    return (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Improvements */}
            {improvements.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                        <span>📈</span> Improvements
                    </h3>
                    <ul className="space-y-2">
                        {improvements.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300">
                                <span className="text-green-500 mt-1">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Regressions */}
            {regressions.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                        <span>📉</span> Needs Attention
                    </h3>
                    <ul className="space-y-2">
                        {regressions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300">
                                <span className="text-red-500 mt-1">⚠</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
