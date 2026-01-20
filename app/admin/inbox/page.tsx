import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InboxClient from "./inbox-client";

export const dynamic = 'force-dynamic';

export default async function AdminInboxPage() {
    const session = await getServerSession(authOptions);

    // Auth Check
    if (!session?.user?.email) redirect('/auth/signin');
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== 'admin') redirect('/dashboard');

    // Fetch Conversations with latest message and User details
    // Needed: Order by updatedAt desc
    const conversations = await prisma.coachingConversation.findMany({
        include: {
            user: {
                include: {
                    Player: true
                }
            },
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return <InboxClient conversations={conversations} />;
}
