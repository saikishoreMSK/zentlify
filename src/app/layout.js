import "./globals.css";
import AuthSessionProvider from "@/components/AuthSessionProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zentlify.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zentlify — Trending & Bestselling Products",
    template: "%s | Zentlify",
  },
  description:
    "Discover trending and best-selling products across tech, home, pets and more. Curated picks with direct links to buy on Amazon.",
  openGraph: {
    title: "Zentlify — Trending & Bestselling Products",
    description:
      "Discover trending and best-selling products curated by Zentlify.",
    url: siteUrl,
    siteName: "Zentlify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zentlify — Trending & Bestselling Products",
    description:
      "Discover trending and best-selling products curated by Zentlify.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
