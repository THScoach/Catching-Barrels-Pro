"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Types based on Prisma include
type Message = {
    id: string;
    sender: string; // 'user' | 'ai' | 'coach'
    content: string;
    createdAt: Date;
};

type Conversation = {
    id: string;
    userId: string | null;
    phoneNumber: string;
    status: string;
    messages: Message[];
    user: {
        name: string;
        email: string; // fallback if no name
        phoneNumber: string | null;
        Player: {
            motorProfile: string | null;
        } | null;
    } | null;
    updatedAt: Date;
};

export default function InboxClient({ conversations }: { conversations: any[] }) {
    const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const router = useRouter();

    const selectedConv = conversations.find(c => c.id === selectedId);

    const handleSend = async () => {
        if (!replyText.trim() || !selectedId) return;
        setSending(true);

        try {
            const res = await fetch("/api/chat/manual-reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversationId: selectedId, content: replyText })
            });
            if (res.ok) {
                setReplyText("");
                router.refresh();
            } else {
                alert("Failed to send");
            }
        } catch (e) {
            console.error(e);
            alert("Error sending message");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-black text-white font-barrels">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-gray-800 overflow-y-auto">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-xl font-black uppercase text-barrels-red">Inbox</h2>
                </div>
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => setSelectedId(conv.id)}
                        className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors ${selectedId === conv.id ? 'bg-gray-900 border-l-4 border-l-barrels-red' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-white truncate">
                                {conv.user?.name || conv.phoneNumber || "Unknown"}
                            </span>
                            <span className="text-[10px] text-gray-500">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest border ${conv.user?.Player?.motorProfile === 'Slingshotter' ? 'border-blue-500 text-blue-500' :
                                conv.user?.Player?.motorProfile === 'Spinner' ? 'border-yellow-500 text-yellow-500' :
                                    conv.user?.Player?.motorProfile === 'Whipper' ? 'border-red-500 text-red-500' :
                                        'border-gray-500 text-gray-500'
                                }`}>
                                {conv.user?.Player?.motorProfile || "LEAD"}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">
                            {conv.messages[conv.messages.length - 1]?.content || "No messages"}
                        </p>
                    </div>
                ))}
            </div>

            {/* Chat View */}
            <div className="flex-1 flex flex-col bg-gray-900/50">
                {selectedConv ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black">
                            <div>
                                <h3 className="font-black text-lg uppercase">{selectedConv.user?.name || selectedConv.phoneNumber}</h3>
                                <p className="text-xs text-gray-500">{selectedConv.user ? selectedConv.user.phoneNumber : "Lead"}</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                {!selectedConv.user && (
                                    <button className="bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 hover:bg-yellow-400">
                                        ⚠️ Lead Captured (Send Audit)
                                    </button>
                                )}
                                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                    Status: <span className="text-white">{selectedConv.status}</span>
                                </div>
                            </div>
                            Status: <span className="text-white">{selectedConv.status}</span>
                        </div>
                    </div>
            </div>

            {/* Action Bar */}
            <div className="bg-gray-800 p-2 flex justify-end">
                <button
                    onClick={async () => {
                        if (!confirm("Start Live Session? This will text the link to the player.")) return;
                        const res = await fetch("/api/meet/create", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ conversationId: selectedConv.id })
                        });
                        if (res.ok) {
                            alert("Live Lab Started. Link sent.");
                            router.refresh(); // Refresh to show system message with link
                        } else {
                            alert("Failed to start session.");
                        }
                    }}
                    className="bg-red-600 text-white text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-red-500 flex items-center gap-2"
                >
                    🎥 Start Live Lab
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedConv.messages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[70%] p-4 rounded-none border ${msg.sender === 'user'
                            ? 'bg-gray-800 border-gray-700 text-gray-300'
                            : msg.sender === 'ai'
                                ? 'bg-black border-barrels-red text-white' // AI
                                : 'bg-barrels-red text-white border-barrels-red' // Coach
                            }`}>
                            <div className="flex justify-between items-center mb-2 gap-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                                    {msg.sender === 'user' ? 'Player' : msg.sender === 'ai' ? 'Rick AI' : 'Coach Rick'}
                                </span>
                                <span className="text-[10px] opacity-50">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 bg-black">
                <div className="flex gap-4">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Override AI and reply manually..."
                        className="flex-1 bg-gray-900 border border-gray-800 p-3 text-sm text-white focus:outline-none focus:border-barrels-red min-h-[80px]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending}
                        className="bg-white text-black font-black uppercase tracking-widest px-6 py-2 hover:bg-barrels-red hover:text-white transition-colors disabled:opacity-50"
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </>
    ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 uppercase font-bold tracking-widest">
            Select a conversation
        </div>
    )
}
            </div >
        </div >
    );
}
