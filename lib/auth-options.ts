import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from '@/data/user';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined
      ) {
        console.log('🔍 받은 credentials:', credentials);
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password?.trim();

        if (!email || !password) {
          console.log('❌ 이메일 또는 비밀번호 누락');
          return null;
        }

        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          console.log('❌ 사용자 없음 또는 비밀번호 미설정');
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log('❌ 비밀번호 불일치');
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id =
        typeof token.id === 'string' ? token.id : String(token.id ?? '');
      session.user.name = token.name;
      session.user.email = token.email ?? '';
      return session;
    },
  },
};
