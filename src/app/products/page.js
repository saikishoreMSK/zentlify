// Products catalog — Server Component. Fetches the full list on the server (so
// product names/links are in the initial HTML for SEO) and hands it to the
// client ProductsBrowser for search / filter / pagination.

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
  const search = sp?.q || "";
  const products = await getAllProducts();

  return (
    <>
      <AffiliateDisclosure style={{ textAlign: "center" }} />
      <ProductsBrowser
        key={`${category || "all"}-${search}`}
        initialProducts={products}
        initialCategory={category}
        initialSearch={search}
      />
    </>
  );
}
