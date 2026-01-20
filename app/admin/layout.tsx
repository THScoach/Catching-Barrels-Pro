import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect('/auth/signin');
    }

    // Check if user is admin or coach
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || (user.role !== 'admin' && user.role !== 'coach')) {
        redirect('/dashboard'); // Redirect unauthorized users to regular dashboard
    }

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-xl font-bold text-cb-gold">ADMIN CONSOLE</h1>
                    <p className="text-xs text-gray-400 mt-1">
                        {user.role === 'admin' ? 'Super Admin' : 'Coach Admin'}
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/admin" icon="📊" label="Overview" />
                    <NavLink href="/admin/ai-assistant" icon="🤖" label="AI Assistant" />
                    <NavLink href="/admin/athletes" icon="👥" label="Athletes" />
                    <NavLink href="/admin/players" icon="⚾️" label="Pro Players" />
                    <NavLink href="/admin/analytics" icon="📈" label="Analytics" />
                    <NavLink href="/admin/content" icon="📚" label="Content" />
                    <NavLink href="/admin/videos" icon="🎥" label="Video Library" />
                    <NavLink href="/admin/inbox" icon="📨" label="Inbox" />
                    <NavLink href="/admin/lessons" icon="🎓" label="Lessons" />
                    <NavLink href="/admin/messages" icon="💬" label="Messages" />
                    <NavLink href="/admin/system" icon="⚙️" label="System Health" />
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cb-gold text-cb-dark flex items-center justify-center font-bold">
                            {user.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{user.name}</p>
                            <Link href="/api/auth/signout" className="text-xs text-gray-400 hover:text-white">
                                Sign Out
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
