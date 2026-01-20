
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const email = 'swingrehabcoach@gmail.com';
        const password = 'Barrels2026!';
        const name = 'Rick Strickland';
        const role = 'admin';  // The schema allows "admin"

        console.log(`[API] Initializing Admin User: ${email}`);

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: { role },
            create: {
                email,
                name,
                password: hashedPassword,
                role,
                profileCompleted: true,
                firstLoginCompleted: true
            }
        });

        return NextResponse.json({
            success: true,
            user: { email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("[API] Error creating admin user:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
