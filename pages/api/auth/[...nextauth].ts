import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define el callbackUrl basado en el entorno
const callbackUrl = process.env.NODE_ENV === 'production'
  ? 'https://prueba-tecnica-fullstack-d-git-0decda-daniela-vasquezs-projects.vercel.app/api/auth/callback/github'
  : 'http://localhost:3000/api/auth/callback/github';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role || 'ADMIN';
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          console.error("No email provided by GitHub");
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
};

export default NextAuth(authOptions);