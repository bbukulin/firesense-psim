import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema/users-schema";
import { eq } from "drizzle-orm";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const result = await db.select().from(users).where(eq(users.email, credentials.email));
        const user = result[0];

        if (!user) return null;
        
        const isValid = await verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) return null;
        
        if (!user.active) return null;

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.uid;
      }
      return session;
    }
  },
  pages: {
    signIn: '/account',
    error: '/account/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 