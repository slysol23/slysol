import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from 'db';
import { userSchema } from 'db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: '/api/auth',
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          return null; // ✅ Return null instead of throwing
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // ✅ Find user
        const [user] = await db
          .select()
          .from(userSchema)
          .where(eq(userSchema.email, email))
          .limit(1);

        // ✅ Check if user exists
        if (!user) {
          console.error('User not found:', email);
          return null;
        }

        // ✅ Verify password
        const isValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValid);

        // ✅ CRITICAL: Return null if password is invalid
        if (!isValid) {
          console.error('Invalid password for user:', email);
          return null;
        }

        // ✅ Only return user if password is correct
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
});
