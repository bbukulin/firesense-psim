import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    role: 'admin' | 'operator';
  }

  interface Session {
    user: User & {
      id: string;
      role: 'admin' | 'operator';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'admin' | 'operator';
    uid: string;
  }
} 