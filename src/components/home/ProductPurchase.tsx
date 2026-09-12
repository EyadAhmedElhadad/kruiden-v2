"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import TrustIcon from "./TrustIcon";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getEffectivePrice, isDiscountActive } from "@/lib/product";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProductPurchase({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();
  const router = useRouter();
  const { t, isAr } = useLanguage();
  const effectivePrice = getEffectivePrice(product);
  const discount = isDiscountActive(product);

  const handleAdd = () =>
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: effectivePrice,
      currency: product.currency,
    });

  const handleBuy = () => {
    handleAdd();
    router.push("/checkout");
  };

  const filled = Math.round(product.rating);

  return (
    <section
      id="shop"
      dir={isAr ? "rtl" : "ltr"}
      style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
      className="bg-apos-surface py-16 md:py-24"
    >
      <div className="container-editorial grid items-start gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-apos-surfaceContainer apo-shadow">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 560px, 90vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="apo-eyebrow" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
            {t("product.signature")}
          </p>
          <h1 className="mt-4 font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} filled={i < filled} />
              ))}
            </div>
            <span className="text-[13px] text-apos-onSurfaceVariant" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
              {product.reviewCount} {t("product.reviews")}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            {discount ? (
              <>
                <span className="text-3xl font-semibold text-apos-onSurface">
                  {formatPrice(effectivePrice, product.currency)}
                </span>
                <span className="text-lg text-apos-onSurfaceVariant line-through">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.discountLabel ? (
                  <span className="rounded-none bg-[#a9d389] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#12140f]">
                    {product.discountLabel}
                  </span>
                ) : (
                  <span className="rounded-none bg-[#a9d389] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#12140f]">
                    {Math.round((1 - effectivePrice / product.price) * 100)}% OFF
                  </span>
                )}
              </>
            ) : (
              <span className="text-3xl font-semibold text-apos-onSurface">
                {formatPrice(product.price, product.currency)}
              </span>
            )}
          </div>

          {product.tagline ? (
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-apos-onSurfaceVariant">
              {product.tagline}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAdd}
              className="apo-btn-ghost"
              disabled={!product.inStock}
              style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
            >
              {t("product.addToCart")}
            </button>
            <button
              onClick={handleBuy}
              className="apo-btn"
              disabled={!product.inStock}
              style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
            >
              {t("product.buyNow")}
            </button>
          </div>

          <p className="mt-3 text-[13px] text-apos-onSurfaceVariant" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
            {product.inStock ? t("product.inStock") : t("product.outOfStock")}
          </p>

          <div className="mt-8 flex flex-col gap-3 border-t border-apos-outlineVariant pt-6">
            <div className="flex items-center gap-3">
              <TrustIcon name="leaf" className="text-apos-primary" />
              <span className="text-[14px] text-apos-onSurfaceVariant" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
                {t("product.botanical")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <TrustIcon name="truck" className="text-apos-primary" />
              <span className="text-[14px] text-apos-onSurfaceVariant" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
                {t("product.freeShipping")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <TrustIcon name="shield" className="text-apos-primary" />
              <span className="text-[14px] text-apos-onSurfaceVariant" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
                {t("product.cod")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className={filled ? "text-apos-primary" : "text-apos-onSurface/20"}
    >
      <path
        d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 20l1-6.1L3.2 9.5l6.1-.9L12 3z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
