# Zentlify

Zentlify is a modern Amazon affiliate website built with [Next.js](https://nextjs.org/), designed to help users discover trending and best-selling products across various categories. The platform features a sleek, responsive UI, an admin dashboard for product management, and seamless integration with Amazon affiliate links.

## Features

- 🔥 **Trending & Bestsellers:** Highlight top products with carousels and sliders.
- 🛒 **Category Browsing:** Filter products by category for easy discovery.
- 📦 **Product Details:** View detailed product info and buy directly on Amazon.
- 🛠️ **Admin Panel:** Add, edit, and delete products with image uploads.
- ☁️ **Cloudinary Integration:** Fast and reliable image hosting.
- 🔒 **Firebase Backend:** Secure product storage and management.
- 📱 **Responsive Design:** Optimized for mobile and desktop.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/) (Firestore & Storage)
- [Cloudinary](https://cloudinary.com/) (Image uploads)
- [Swiper](https://swiperjs.com/) & [Embla](https://www.embla-carousel.com/) (Carousels)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/zentlify.git
   cd zentlify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Firebase and Cloudinary credentials.

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the site.

## Folder Structure

- `src/app/` - Main application pages and routing
- `src/components/` - Reusable UI components
- `src/app/admin/` - Admin dashboard for product management
- `src/app/api/` - API routes for backend operations

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred platform. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more info.

## Contributing

Pull requests and feedback are welcome! Please open an issue to discuss changes or improvements.

## License

[MIT](LICENSE)

---

> Zentlify is not affiliated with Amazon.com, Inc. All rights reserved.
