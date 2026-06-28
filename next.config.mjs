/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        // Existing product images were stored as http:// URLs, so allow both.
        // New uploads are saved as https (secure_url) going forward.
        { protocol: "https", hostname: "res.cloudinary.com" },
        { protocol: "http", hostname: "res.cloudinary.com" },
      ],
    },
  };
export default nextConfig;
