import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define an array of paths that require authentication.
// The wildcard '*' protects all sub-paths (e.g., /admin/AddProduct, /admin/ManageProducts).
const protectedPaths = ["/admin/:path*"];

// `withAuth` wraps your middleware function, allowing you to access the session.
// It handles the redirection to the sign-in page if no valid token is found.
export default withAuth(
  // Custom middleware logic runs after successful authentication.
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Check if the user is authenticated AND if they have the necessary 'admin' role.
    // The role was added to the JWT/token in Step 2.
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      // If the user is authenticated but IS NOT an admin (shouldn't happen with our current setup)
      // or if you later add other user roles, you can redirect them away.
      
      // For simplicity, we just redirect them to the homepage if they aren't an admin.
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If the path is protected AND the user is an admin, the request continues.
    return NextResponse.next();
  },
  
  // Configuration for withAuth
  {
    // The `callbacks` define what happens if the user is unauthenticated
    callbacks: {
      authorized: ({ token }) => {
        // Return true if the user has a token, otherwise NextAuth redirects them to the sign-in page.
        // If the token check passes, the custom `middleware` function above runs next.
        return !!token;
      },
    },
    // The `pages` option tells NextAuth where your custom login page is
    pages: {
      signIn: "/login",
    },
    
    // The `matcher` tells Next.js which paths to run the middleware on.
    // We only run it on our protected paths AND the /login page (to prevent
    // signed-in users from seeing the login page).
    matcher: [...protectedPaths, "/login"],
  }
);