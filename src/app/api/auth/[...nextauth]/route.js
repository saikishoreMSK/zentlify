// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// Export the handler for Next.js to use for both GET and POST requests
export { handler as GET, handler as POST };
