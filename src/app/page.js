// Homepage — now a Server Component. Product data is fetched on the server and
// passed into the (client) carousels/sliders, so product names and links are in
// the initial HTML for SEO, and the "Trending" query runs once instead of being
// fetched separately by each component in the browser.

import { EmblaCarousel } from "@/components/Carousel";
import BannerHero from "@/components/BannerHero";
import Categories from "@/components/Categories";
import Bestseller from "@/components/Bestseller";
import ImageSlider from "@/components/ImageSlider";
import Trending from "@/components/Trending";
import IntroOverlay from "@/components/IntroOverlay";
import { getProductsByCategory, getPopularProducts } from "@/lib/products";
import { getActiveBanners } from "@/lib/banners";

export default async function Home() {
  const [banners, trending, popular] = await Promise.all([
    getActiveBanners(),
    getProductsByCategory("Trending"),
    getPopularProducts(10),
  ]);

  return (
    <>
      <IntroOverlay />
      {banners.length > 0 ? (
        <BannerHero banners={banners} />
      ) : (
        <EmblaCarousel products={trending} />
      )}
      <Categories />
      <ImageSlider products={trending} />
      <Trending />
      <Bestseller products={popular} />
    </>
  );
}
