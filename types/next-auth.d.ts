/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  }
}

export {};
