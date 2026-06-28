"use client";
// Renders the shared Navbar + Footer on public pages, and nothing on the
// admin/login areas (which have their own chrome). Keeping this as a thin client
// island lets the pages themselves stay Server Components.

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteChrome({ children }) {
  const pathname = usePathname() || "";
  const bare =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (bare) return <>{children}</>;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
