import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, action } = body;

        if (!id || !["approved", "rejected"].includes(action)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const updatedItem = await prisma.videoLibraryItem.update({
            where: { id },
            data: { status: action }
        });

        // Loophole: If approved, we might want to also create a "Lesson" or "SwingVideo" from this item automatically?
        // or just keep it in the library. For now, just status update.

        return NextResponse.json({ success: true, data: updatedItem });

    } catch (error) {
        console.error("[Action Error]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
