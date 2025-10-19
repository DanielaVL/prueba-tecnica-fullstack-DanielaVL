import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  events: {
    // Este evento se ejecuta cuando se crea un nuevo usuario
    onUserCreate: async (user: { id: any; }) => {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' } as any, // Asigna rol ADMIN automáticamente
      });
    },
  },
  callbacks: {
    // Añade el rol al objeto de sesión que se envía al frontend
    session: async ({ session, user }: { session: any; user: { role?: string } }) => {
      if (user.role) {
        session.user = session.user || {};
        session.user.role = user.role;
      }
      return session;
    },
  },
});

export type Session = typeof auth.$Infer.Session;
