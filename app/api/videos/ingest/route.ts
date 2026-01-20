import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock AI Service (Replace with actual OpenAI calls when keys are available)
async function processWithAI(fileUrl: string, providedTranscript?: string) {
    // 1. Download file -> (Buffer) => await fetch(fileUrl)
    // 2. Whisper API -> Transcript (If not provided in payload for testing)

    // Use provided transcript for testing, otherwise mock extraction
    const transcript = providedTranscript || "This is a mock transcript where the hitter is spinning off the ball.";

    // 3. GPT-4o -> Tag (Simulated Rule-Based Logic)
    // Rules based on Rick's keywords
    let tag = "General";

    const lowerText = transcript.toLowerCase();

    // Spinner (Lateral)
    if (lowerText.includes("spin") || lowerText.includes("rotation") || lowerText.includes("front side") || lowerText.includes("clear the hips")) {
        tag = "Spinner";
    }
    // Slingshotter (Horizontal)
    else if (lowerText.includes("stretch") || lowerText.includes("tension") || lowerText.includes("linear") || lowerText.includes("scap load")) {
        tag = "Slingshotter";
    }
    // Whipper (Vertical)
    else if (lowerText.includes("upward") || lowerText.includes("tilt") || lowerText.includes("posture") || lowerText.includes("whip")) {
        tag = "Whipper";
    }

    return {
        transcript,
        tag
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Expected payload from Google Drive Webhook or Manual Trigger
        const { fileId, fileName, fileUrl, transcript } = body;

        if (!fileName || !fileUrl) {
            return NextResponse.json({ error: "Missing file metadata" }, { status: 400 });
        }

        console.log(`[Ingest] Processing file: ${fileName}`);

        // Check if already exists
        const existing = await prisma.videoLibraryItem.findFirst({
            where: { driveFileId: fileId }
        });

        if (existing) {
            return NextResponse.json({ message: "File already ingested", id: existing.id });
        }

        // Run AI Pipeline (Simulated)
        const aiResult = await processWithAI(fileUrl, transcript);

        // Save to DB
        const newItem = await prisma.videoLibraryItem.create({
            data: {
                title: fileName,
                videoUrl: fileUrl,
                driveFileId: fileId,
                transcript: aiResult.transcript,
                vectorTag: aiResult.tag,
                status: "pending"
            }
        });

        return NextResponse.json({
            success: true,
            message: "Video ingested and analyzed",
            data: newItem
        });

    } catch (error) {
        console.error("[Ingest Error]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
