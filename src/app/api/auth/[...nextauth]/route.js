// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// The authorize function is where your login logic goes.
const authOptions = {
  // 1. Configure the session strategy to use JSON Web Tokens (JWT)
  // This is required when using the CredentialsProvider without a database.
  session: {
    strategy: "jwt",
  },
  
  // 2. Define the providers (login methods)
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g. "Sign in with...")
      name: "Admin Credentials",
      
      // Define the fields you expect to be submitted on the form
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      // This is the function called when a user attempts to sign in
      async authorize(credentials) {
        // IMPORTANT: We check the credentials against the secure ENV variables.
        const VALID_USER = process.env.ADMIN_USER;
        const VALID_PASS = process.env.ADMIN_PASS;
        
        // --- Security Check: ALWAYS use a timing-safe comparison in production ---
        // For simplicity, we'll use a standard comparison here, but in production, 
        // you would use hashing (e.g., bcrypt) and timing-safe string comparison.
        
        if (credentials.username === VALID_USER && credentials.password === VALID_PASS) {
          // If the credentials match:
          // Return a user object. This object will be encrypted into the session JWT.
          // Note: DO NOT return the password here.
          return {
            id: "admin-user", // A unique identifier
            name: "Zentlify Admin",
            email: "admin@zentlify.com",
            role: "admin", // Crucial for authorization checks later
          };
        }
        
        // If login fails, return null to show an error on the sign-in page
        return null;
      },
    }),
  ],

  // 3. Define custom pages
  pages: {
    // Redirect unauthenticated users to our custom login page
    signIn: "/login",
  },
  
  // 4. Callbacks: Used to customize the session and JWT content
  callbacks: {
    // This runs whenever a token is created or updated
    async jwt({ token, user }) {
      // If a user object is passed during sign-in, add the user data to the JWT
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // This runs whenever a session is accessed (client-side via useSession)
    async session({ session, token }) {
      // Add the role from the JWT token to the session object
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// Export the handler for Next.js to use for both GET and POST requests
export { handler as GET, handler as POST };