import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { conversationId } = body;

        if (!conversationId) {
            return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
        }

        const conversation = await prisma.coachingConversation.findUnique({
            where: { id: conversationId },
            include: { user: true }
        });

        if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

        // 1. Generate Meet Link (Mock for now, would use Google Calendar API in prod)
        // Format: meet.google.com/xxx-yyyy-zzz
        const randomCode = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
        const meetUrl = `https://meet.google.com/${randomCode}`;

        // 2. Create LiveSession Record
        await prisma.liveSession.create({
            data: {
                conversationId: conversation.id,
                meetUrl: meetUrl,
                meetCode: randomCode, // Store this to match recording filenames later
                status: "scheduled"
            }
        });

        // 3. Send SMS (Twilio)
        const messageText = `(Coach Rick): I'm opening the Live Lab. Join me here: ${meetUrl}`;

        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && conversation.phoneNumber) {
            const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await client.messages.create({
                body: messageText,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: conversation.phoneNumber
            });
        }

        // 4. Log to Chat
        await prisma.coachingMessage.create({
            data: {
                conversationId: conversation.id,
                sender: "coach",
                content: messageText
            }
        });

        return NextResponse.json({ success: true, meetUrl });

    } catch (error) {
        console.error("[Meet Error]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
