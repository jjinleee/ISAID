import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { LoginSchema } from './schemas/auth';
import { getUserByEmail } from '@/data/user';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("함수호출");
        const result = LoginSchema.safeParse(credentials);
        if (!result.success) {
          console.log('❌ 유효성 검사 실패:', result.error);
          return null;
        }

        const { email, password } = result.data;
        const user = await getUserByEmail(email);

        if (!user) {
          console.log('❌ 사용자 없음:', email);
          return null;
        }

        if (!user.password) {
          console.log('❌ 사용자에 비밀번호 없음');
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          console.log('❌ 비밀번호 불일치');
          return null;
        }

        console.log('✅ 로그인 성공:', email);
        return {
          id: user.user_id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  // pages: {
  //   signIn: '/login',
  // },
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
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email ?? '';
      return session;
    },
  },
};