import type { ProductDTO } from "@/lib/types";
import { getHeroSection } from "@/lib/site-content";
import HeroClient from "./HeroClient";

export default async function Hero({ product }: { product: ProductDTO }) {
  const hero = await getHeroSection();
  const heroImage = hero.imageUrl || product.images[0];
  return <HeroClient hero={hero} heroImage={heroImage} productName={product.name} />;
}
