"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define the shape of our data (mirroring Prisma model)
type VideoItem = {
    id: string;
    title: string;
    videoUrl: string;
    transcript: string | null;
    vectorTag: string | null;
    status: string;
    createdAt: Date;
};

export default function VideoDashboardClient({ initialVideos }: { initialVideos: VideoItem[] }) {
    const [items, setItems] = useState<VideoItem[]>(initialVideos);
    const [filter, setFilter] = useState("pending");
    const router = useRouter();

    const filteredItems = items.filter((item) => item.status === filter);

    // Mock function to simulate API call (we'll implement the real API next)
    const handleAction = async (id: string, action: "approved" | "rejected") => {
        // Optimistic Update
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: action } : item))
        );

        try {
            const response = await fetch("/api/videos/action", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, action }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }
            router.refresh(); // Sync server state
        } catch (error) {
            alert("Error updating status");
            // Revert optimistic update if needed, or just refresh
            router.refresh();
        }
    };

    return (
        <div className="p-8 font-barrels bg-black min-h-screen text-white selection:bg-barrels-red selection:text-white">
            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
                        Command Center <span className="text-barrels-red">//</span> Video Library
                    </h1>
                    <p className="text-gray-400 font-medium">
                        Review and categorize incomign Meta Glasses footage.
                    </p>
                </div>
                <div className="flex gap-4">
                    {["pending", "approved", "rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-none border ${filter === status
                                    ? "bg-barrels-red border-barrels-red text-white"
                                    : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-500 hover:text-white"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredItems.length === 0 ? (
                    <div className="col-span-full py-20 text-center border border-gray-800 border-dashed rounded-none">
                        <p className="text-gray-500 uppercase tracking-widest font-bold">No videos found in "{filter}"</p>
                    </div>
                ) : (
                    filteredItems.map((video) => (
                        <div key={video.id} className="bg-barrels-grey border border-gray-800 p-6 flex flex-col gap-6 shadow-2xl relative group">
                            {/* Status Badge */}
                            <div className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${video.status === 'pending' ? 'border-yellow-500 text-yellow-500' :
                                    video.status === 'approved' ? 'border-green-500 text-green-500' :
                                        'border-red-500 text-red-500'
                                }`}>
                                {video.status}
                            </div>

                            {/* Video Placeholder / Player */}
                            <div className="aspect-video bg-black border border-gray-800 relative flex items-center justify-center overflow-hidden">
                                {/* In a real app, this would be a <video> tag */}
                                <video src={video.videoUrl} controls className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Metadata */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight truncate" title={video.title}>{video.title}</h3>
                                    <p className="text-xs text-gray-500 font-mono mt-1">{new Date(video.createdAt).toLocaleDateString()}</p>
                                </div>

                                {/* AI Analysis */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-black border border-gray-800">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-2">AI Tag</span>
                                        <div className="text-barrels-red font-black uppercase text-lg">{video.vectorTag || "Unclassified"}</div>
                                    </div>
                                    <div className="p-4 bg-black border border-gray-800 overflow-y-auto max-h-32 scrollbar-hide">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Transcript Snippet</span>
                                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                            "{video.transcript ? video.transcript.substring(0, 150) + "..." : "No transcript available..."}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {video.status === 'pending' && (
                                <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-800">
                                    <button
                                        onClick={() => handleAction(video.id, "rejected")}
                                        className="py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-red-900/20 hover:text-red-500 transition-colors border border-transparent hover:border-red-900"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(video.id, "approved")}
                                        className="py-3 text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-barrels-red hover:text-white transition-colors border border-white hover:border-barrels-red"
                                    >
                                        Approve & Library
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
