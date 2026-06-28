import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect ONLY the /admin area. The matcher below guarantees this middleware
// runs solely on /admin routes, so the public site (home, products, etc.)
// stays open to everyone.
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // The matcher only lets /admin paths reach here, so any non-admin token
    // gets bounced to the homepage.
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    // Unauthenticated users (no token) are redirected to the sign-in page.
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// IMPORTANT: the matcher MUST be exported as a static `config` literal — it is
// NOT a valid option inside withAuth(), and Next.js ignores any matcher built
// from a variable. Only these paths run the middleware; everything else is public.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
