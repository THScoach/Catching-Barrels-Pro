import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function RecentComparisons({ userId }: { userId: string }) {
    const comparisons = await prisma.comparison.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            lesson1: { select: { name: true } },
            lesson2: { select: { name: true } },
        },
    });

    if (comparisons.length === 0) {
        return (
            <div className="text-center p-8 bg-cb-dark-card rounded-xl border border-cb-dark-accent text-gray-500">
                No recent comparisons found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comparisons.map((comp) => (
                <Link
                    key={comp.id}
                    href={`/comparison/${comp.lessonId1}/${comp.lessonId2}`}
                    className="block bg-cb-dark-card rounded-xl p-4 border border-cb-dark-accent hover:border-cb-gold transition-colors"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cb-dark flex items-center justify-center text-xl">
                                🔄
                            </div>
                            <div>
                                <div className="font-medium text-white">
                                    {comp.lesson1?.name || "Unknown"} vs {comp.lesson2?.name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-400">
                                    {new Date(comp.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-cb-gold font-medium text-sm">
                            View Results →
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
