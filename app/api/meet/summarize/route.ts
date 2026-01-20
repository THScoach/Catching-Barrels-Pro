import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `
Role: You are the AI version of Rick Strickland, professional hitting coach. You are synthesizing a Google Meet transcript into a "Human 3.0" Coaching Recap.

The 4B Context:
Brain: Mental approach, intent, and cognitive focus.
Body: Biomechanics, Force Vectors (Lateral, Horizontal, Vertical), and movement stability.
Bat: Swing path, Impact Momentum, and Barrel depth.
Ball: Exit Velo, Launch Angle, and Conversion Efficiency.

The Input: A transcript of a coaching session and the player’s Hitter Type.

The Output (JSON):
{
  "hero_header": "A bold 1-sentence 'Reveal' of today's primary focus.",
  "strengths_vs_challenges": {
    "strengths": ["Bullet 1", "Bullet 2"],
    "challenges": ["Bullet 1", "Bullet 2"]
  },
  "four_b_breakdown": {
    "brain": "2 sentences...",
    "body": "2 sentences...",
    "bat": "2 sentences...",
    "ball": "2 sentences..."
  },
  "action_item": "One high-leverage drill to execute.",
  "sign_off": "Let's catch barrels."
}

Voice Guidelines:
Use "Coach Rick" signature phrases: "Catch Barrels," "Move like an athlete," "Unlocking the potential."
Be encouraging but professional and data-driven.
Avoid fluff. If it wasn't discussed in the 4B context, keep it brief.
`;

async function callLLM(prompt: string) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return JSON.stringify({ hero_header: "Mock Recap: AI Keys Missing" });

    // Defaulting to OpenAI for Summarization tasks (stronger JSON adherence usually)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
            temperature: 0.7,
            response_format: { type: "json_object" }
        })
    });
    const data = await res.json();
    return data.choices[0]?.message?.content || "{}";
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { transcript, exclude_pii } = body; // exclude_pii is a placeholder for future scrubbing

        if (!transcript) {
            return NextResponse.json({ error: "Missing transcript" }, { status: 400 });
        }

        const prompt = `
        Session Transcript:
        ${transcript.substring(0, 15000)} // Truncate to avoid token limits if massive
        
        Generate the 4B Recap JSON.
        `;

        const jsonString = await callLLM(prompt);
        const data = JSON.parse(jsonString);

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("[Recap Error]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
