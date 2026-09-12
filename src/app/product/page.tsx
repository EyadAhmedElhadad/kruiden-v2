import type { Metadata } from "next";
import { getPrimaryProduct } from "@/lib/product";
import ProductPageClient from "@/components/product/ProductPageClient";

export const metadata: Metadata = {
  title: "The Oil — Kruiden",
};

export default async function ProductPage() {
  const product = await getPrimaryProduct();
  return <ProductPageClient product={product} />;
}
