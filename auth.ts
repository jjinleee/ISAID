import NextAuth from 'next-auth';
import type { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './data/user';
import { prisma } from './lib/prisma';
import { LoginSchema } from './lib/schemas/auth';

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const result = LoginSchema.safeParse(credentials);
        if (!result.success) return null;

        const { email, password } = result.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        } satisfies User;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET ?? '',
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 24 hours
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = String(user.id);
        token.name = user.name;
        token.email = user.email;
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token?.id ? String(token.id) : '';
      session.user.name = token?.name ?? '';
      session.user.email = token?.email ?? '';
      return session;
    },
  },
});
