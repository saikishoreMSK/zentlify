// Guard for server-side API routes: returns the session only if the caller is
// an authenticated admin, otherwise null. Route handlers should respond 401
// when this returns null.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return null;
  }
  return session;
}
