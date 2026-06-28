const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zentlify.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
