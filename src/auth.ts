import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from 'db';
import { userSchema } from 'db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          throw new Error('Missing credentials');
        }
        const email = credentials.email as string;
        const password = credentials.password as string;

        const [user] = await db
          .select()
          .from(userSchema)
          .where(eq(userSchema.email, email))
          .limit(1);

        const isValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValid);

        const userReturn = {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        return userReturn;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = (user as any).isAdmin;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  basePath: '/api/auth',
  secret: process.env.AUTH_SECRET,
});
