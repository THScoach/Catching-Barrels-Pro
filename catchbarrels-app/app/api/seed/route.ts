import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@catchbarrels.app" }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Users already seeded" });
    }

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@catchbarrels.app",
        password: adminPassword,
        role: "admin"
      }
    });

    // Create test player
    const playerPassword = await bcrypt.hash("player123", 10);
    await prisma.user.create({
      data: {
        name: "Test Player",
        email: "player@test.com",
        password: playerPassword,
        role: "player"
      }
    });

    return NextResponse.json({ message: "Users seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed users" },
      { status: 500 }
    );
  }
}
