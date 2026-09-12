"use client";

import Image from "next/image";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getEffectivePrice, isDiscountActive } from "@/lib/product";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProductShowcase({ product }: { product: ProductDTO }) {
  const { t, isAr } = useLanguage();
  const images = product.images.slice(0, 3);
  const captions = [t("showcase.caption1"), t("showcase.caption2"), t("showcase.caption3")];
  const discount = isDiscountActive(product);
  const effective = getEffectivePrice(product);

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
      className="bg-apos-surface py-20 md:py-28"
    >
      <div className="container-editorial">
        <div className="mb-12 max-w-xl md:mb-16">
          <p className="apo-eyebrow">{t("showcase.eyebrow")}</p>
          <h2
            className="mt-5 font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]"
            style={isAr ? { fontFamily: '"Cairo", serif' } : undefined}
          >
            {t("showcase.headline")}
          </h2>
          <p
            className="mt-5 text-[15px] leading-relaxed text-apos-onSurfaceVariant"
            style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
          >
            {t("showcase.description")}
          </p>
          {discount && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold text-apos-onSurface">
                {formatPrice(effective, product.currency)}
              </span>
              <span className="text-base text-apos-onSurfaceVariant line-through">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="bg-[#a9d389] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#12140f]">
                {product.discountLabel || `${Math.round((1 - effective / product.price) * 100)}% OFF`}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {images.map((src, i) => (
            <figure key={src + i} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-apos-surfaceContainer">
                {discount && i === 0 && (
                  <span className="absolute left-3 top-3 z-10 rounded-none bg-[#a9d389] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[#12140f]">
                    {product.discountLabel || `${Math.round((1 - effective / product.price) * 100)}% OFF`}
                  </span>
                )}
                <Image
                  src={src}
                  alt={captions[i] ?? product.name}
                  fill
                  sizes="(min-width: 768px) 360px, 90vw"
                  className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]"
                />
              </div>
              <figcaption
                className="mt-4 text-[14px] font-medium text-apos-onSurfaceVariant"
                style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
              >
                {captions[i]}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
