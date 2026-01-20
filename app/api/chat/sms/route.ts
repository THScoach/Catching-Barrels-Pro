import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// System Prompt: The "Rick Strickland" Style Guide
const SYSTEM_PROMPT = `
You are Rick Strickland. You are not a generic AI. You are a high-performance hitting coach building "Human 3.0" athletes.

Your goal is to provide a direct, authoritative coaching response based on the user's "Force Vector" (Spinner, Slingshotter, or Whipper).

---
### The Voice Guardrails:
1. **The "Hormozi" Opener:** Start with the "Why" or the "Result." No "Hello" or "Good question."
   - *Bad:* "Hi there! I think you are popping up because..."
   - *Good:* "The reason you're popping up is your rear hip is sliding."

2. **The "Mike Adams" Anatomy:** Always reference the force vector / specific anatomy.
   - *Example:* "Your vertical force is firing too early," or "You lost tension in the scap."

3. **The "Dan Koe" System:** Frame the advice as part of the "Human 3.0" journey.
   - *Example:* "We're moving you from a reactive hitter to a systematic one."

4. **The Sign-off:** ALways end with: "Let's catch barrels."

---
### Context:
User Profile: {USER_PROFILE} (Spinner, Slingshotter, or Whipper)
Relevant Video Drill: {VIDEO_URL}
User Question: "{USER_MESSAGE}"

### Instruction:
Write the response text (max 3 sentences before the sign-off).
Include the drill URL naturally or at the end.
`;

async function callOpenAI(prompt: string) {
    if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "system", content: prompt }],
            temperature: 0.7
        })
    });

    const data = await res.json();
    return data.choices[0]?.message?.content || "AI Error (OpenAI)";
}

async function callClaude(prompt: string) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("Missing ANTHROPIC_API_KEY");

    // Quick adapter for system prompt in Claude if using ‘messages’ endpoints efficiently
    // Re-doing fetch with proper system param
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 300,
            system: prompt, // Pass the full prompt as the system instruction
            messages: [{ role: "user", content: "Generate the coaching response based on the system prompt." }]
        })
    });

    const data = await res.json();
    return data.content[0]?.text || "AI Error (Claude)";
}


async function generateCoachResponse(userProfile: string, userMessage: string, videoContext: any[], userId?: string) {
    const video = videoContext[0];
    // Construct Tracking Link
    const baseUrl = process.env.NEXTAUTH_URL || "https://catchingbarrels.com";
    const trackingUrl = video ? `${baseUrl}/api/t/${video.id}${userId ? `?u=${userId}` : ''}` : "https://catchingbarrels.com/drills/default";

    // Use Tracking URL in prompt context
    const videoUrl = trackingUrl;

    // Inject Context
    const filledPrompt = SYSTEM_PROMPT
        .replace("{USER_PROFILE}", userProfile)
        .replace("{VIDEO_URL}", videoUrl)
        .replace("{USER_MESSAGE}", userMessage);

    // Mock Fallback if no keys (for local testing without keys)
    if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
        return `(Mock ${process.env.LLM_PROVIDER || "Default"}): The reason you're late is because you're a ${userProfile} and you lost your scap load. Fix the tension here: ${videoUrl}. Let's catch barrels.`;
    }

    // Switch Logic
    const provider = process.env.LLM_PROVIDER || "openai"; // default to openai

    try {
        if (provider === "anthropic") {
            return await callClaude(filledPrompt);
        } else {
            return await callOpenAI(filledPrompt);
        }
    } catch (e) {
        console.error("LLM Call Failed", e);
        return "Coach Rick is offline right now. Check your setup.";
    }
}

async function logKeywords(text: string) {
    const stopWords = ["the", "is", "a", "an", "and", "or", "but", "to", "for", "in", "on", "at", "with", "my", "i", "im", "of", "it", "this", "that"];
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);

    for (const word of words) {
        if (word.length > 2 && !stopWords.includes(word)) {
            await prisma.messageAnalytics.upsert({
                where: { keyword: word },
                update: {
                    count: { increment: 1 },
                    lastSeen: new Date()
                },
                create: {
                    keyword: word,
                    count: 1,
                    lastSeen: new Date()
                }
            });
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get("content-type") || "";
        let body: any = {};

        if (contentType.includes("application/x-www-form-urlencoded")) {
            const formData = await req.formData();
            body = Object.fromEntries(formData.entries());
        } else {
            body = await req.json();
        }

        const { From, Body } = body;
        const fromNumber = From;
        const userMessage = Body;

        console.log(`[SMS] Received from ${fromNumber}: ${userMessage}`);

        // Async Keyword Logging (Fire & Forget)
        logKeywords(userMessage).catch(e => console.error("Keyword Log Error", e));

        // 1. Identify User (if exists)
        const user = await prisma.user.findFirst({
            where: { phoneNumber: fromNumber },
            include: { Player: true }
        });

        // 2. Determine Profile
        const hitterType = user?.Player?.motorProfile || "General";

        // 3. Search Video Library
        const relevantVideos = await prisma.videoLibraryItem.findMany({
            where: {
                vectorTag: hitterType,
                status: "approved"
            },
            take: 1
        });

        // 4. Generate AI Response
        let responseText = "";
        if (!user || !user.Player) {
            // New Lead Logic: Direct them to the Audit
            // We can still give a generic tip, but priority is capturing the lead.
            // Persona: "You're new. I need your data before I can coach you."
            responseText = `(Coach Rick AI): I don't have your swing DNA yet. I can't guess. Go here, take the 2-minute audit, and I'll know if you're a Spinner or Slingshotter: https://catchingbarrels.com/quiz . Once you're done, text me back.`;
        } else {
            // Existing Athlete Logic
            responseText = await generateCoachResponse(hitterType, userMessage, relevantVideos, user.id);
        }

        // 5. Update/Create Conversation (DB)
        const conversation = await prisma.coachingConversation.upsert({
            where: { phoneNumber: fromNumber }, // Now creating by phone number
            update: {
                status: "replied",
                user: user ? { connect: { id: user.id } } : undefined // Link user if found
            },
            create: {
                phoneNumber: fromNumber,
                userId: user?.id,
                status: "replied"
            }
        });

        // Log User Message
        await prisma.coachingMessage.create({
            data: {
                conversationId: conversation.id,
                sender: "user",
                content: userMessage
            }
        });

        // Log AI Response
        await prisma.coachingMessage.create({
            data: {
                conversationId: conversation.id,
                sender: "ai",
                content: responseText
            }
        });

        // 6. Respond (TwiML)
        const xmlResponse = `
        <Response>
            <Message>${responseText}</Message>
        </Response>
        `;

        return new NextResponse(xmlResponse, {
            headers: { "Content-Type": "text/xml" }
        });

    } catch (error) {
        console.error("[SMS Error]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
