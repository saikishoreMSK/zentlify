// Shared NextAuth configuration.
//
// Extracted from the route handler so server-side API routes can call
// getServerSession(authOptions) to verify the admin before writing to Firestore.

import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Required for CredentialsProvider without a database.
  session: {
    strategy: "jwt",
  },

  // NEXTAUTH_SECRET must be set in production to sign/verify the session JWT.
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const VALID_USER = process.env.ADMIN_USER;
        const VALID_PASS = process.env.ADMIN_PASS;

        // Guard against misconfiguration: never authenticate when the expected
        // credentials are not set on the server.
        if (!VALID_USER || !VALID_PASS) {
          console.error("ADMIN_USER / ADMIN_PASS are not configured.");
          return null;
        }

        if (
          credentials?.username === VALID_USER &&
          credentials?.password === VALID_PASS
        ) {
          return {
            id: "admin-user",
            name: "Zentlify Admin",
            email: "admin@zentlify.com",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
