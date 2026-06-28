// Products catalog — Server Component. Fetches the full list on the server (so
// product names/links are in the initial HTML for SEO) and hands it to the
// client ProductsBrowser for search / filter / pagination.

import Header from "@/components/Header";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import ProductsBrowser from "./ProductsBrowser";
import { getAllProducts } from "@/lib/products";

export const metadata = {
  title: "All Products",
  description: "Browse all trending and best-selling products curated by Zentlify.",
};

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const category = sp?.category || null;
  const products = await getAllProducts();

  return (
    <>
      <Header />
      <AffiliateDisclosure style={{ textAlign: "center" }} />
      <ProductsBrowser initialProducts={products} initialCategory={category} />
    </>
  );
}
