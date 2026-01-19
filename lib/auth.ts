import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          return null;
        }

        // Explicitly casting to any to avoid Prisma type issues during build
        const userAny = user as any;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          firstLoginCompleted: userAny.firstLoginCompleted,
          profileCompleted: userAny.profileCompleted
        } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.firstLoginCompleted = user.firstLoginCompleted;
        token.profileCompleted = user.profileCompleted;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userAny = session.user as any;
        userAny.role = token.role as string;
        userAny.id = token.id as string;
        userAny.firstLoginCompleted = token.firstLoginCompleted as boolean;
        userAny.profileCompleted = token.profileCompleted as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};
