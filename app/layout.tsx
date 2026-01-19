import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CatchBarrels - Swing Analysis",
  description: "Baseball swing analysis app"
};

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import TopNav from "@/components/layout/TopNav";
import { prisma } from "@/lib/prisma";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Get user if authenticated to pass role/name to TopNav
  let user = null;
  if (session?.user?.email) {
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { name: true, email: true, role: true },
      });
    } catch (e) {
      console.error("RootLayout DB Error:", e);
      // User remains null, app renders without top nav user info, avoiding crash.
    }
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-cb-dark text-white min-h-screen`}>
        {user && <TopNav user={user} />}
        {children}
      </body>
    </html>
  );
}
