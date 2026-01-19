import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, name, hitterType, answers } = body;

        // Validation
        if (!email || !hitterType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Save to DB
        const attempt = await prisma.quizAttempt.create({
            data: {
                email,
                name: name || "Anonymous",
                hitterType,
                answers: answers || {},
            },
        });

        return NextResponse.json({ success: true, id: attempt.id });
    } catch (error) {
        console.error("Quiz Submit Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
