import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { conversationId, content } = body;

        if (!conversationId || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // 1. Get Conversation to find User Phone
        const conversation = await prisma.coachingConversation.findUnique({
            where: { id: conversationId },
            include: { user: true }
        });

        if (!conversation || !conversation.user.phoneNumber) {
            return NextResponse.json({ error: "Conversation or Phone not found" }, { status: 404 });
        }

        // 2. Send SMS via Twilio (Real Implementation)
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const client = require('twilio')(accountSid, authToken);

            await client.messages.create({
                body: content,
                from: process.env.TWILIO_PHONE_NUMBER, // Ensure this env var is set
                to: conversation.user.phoneNumber
            });
        } else {
            console.log(`[Mock SMS] To ${conversation.user.phoneNumber}: ${content}`);
        }

        // 3. Log Message to DB
        const newMessage = await prisma.coachingMessage.create({
            data: {
                conversationId,
                sender: "coach",
                content
            }
        });

        // 4. Update Conversation Status
        await prisma.coachingConversation.update({
            where: { id: conversationId },
            data: { status: "manual_override" }
        });

        return NextResponse.json({ success: true, data: newMessage });

    } catch (error) {
        console.error("[Manual Reply Error]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
