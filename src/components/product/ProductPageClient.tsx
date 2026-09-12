"use client";

import { useLanguage } from "@/components/LanguageProvider";
import Gallery from "@/components/product/Gallery";
import DetailAccordion from "@/components/product/DetailAccordion";
import PurchasePanel from "@/components/product/PurchasePanel";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getEffectivePrice, isDiscountActive } from "@/lib/product";

export default function ProductPageClient({ product }: { product: ProductDTO }) {
  const { t, isAr } = useLanguage();
  const discount = isDiscountActive(product);
  const effective = getEffectivePrice(product);

  return (
    <div dir={isAr ? "rtl" : "ltr"} style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined} className="container-editorial py-10 pb-28 sm:pb-16 md:py-16">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <Gallery images={product.images} name={product.name} />

        <div className="max-w-lg">
          <p className="eyebrow" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
            {t("product.signature")}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-ink md:text-5xl" style={isAr ? { fontFamily: '"Cairo", serif' } : undefined}>
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-olive-600" aria-hidden="true">
              {"★".repeat(Math.round(product.rating))}
              <span className="text-ink/20">{"★".repeat(5 - Math.round(product.rating))}</span>
            </span>
            <span className="text-xs text-ink/50" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
              {product.rating.toFixed(1)} ({product.reviewCount} {t("product.reviews")})
            </span>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink/60" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
            {product.description}
          </p>

          {discount ? (
            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="font-serif text-2xl font-semibold text-ink">{formatPrice(effective, product.currency)}</span>
              <span className="text-lg text-ink/40 line-through">{formatPrice(product.price, product.currency)}</span>
              <span className="rounded-none bg-olive-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {product.discountLabel || `${Math.round((1 - effective / product.price) * 100)}% OFF`}
              </span>
            </div>
          ) : (
            <p className="mt-6 font-serif text-2xl font-semibold text-ink">{formatPrice(product.price, product.currency)}</p>
          )}

          <PurchasePanel product={product} />

          <div className="mt-8">
            <DetailAccordion
              sections={[
                {
                  title: t("product.ingredients"),
                  content: (
                    <ul className="list-disc space-y-1 pl-4">
                      {product.ingredients.map((ing) => (
                        <li key={ing}>{ing}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  title: t("product.benefits"),
                  content: (
                    <ul className="list-disc space-y-1 pl-4">
                      {product.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ),
                },
                {
                  title: t("product.usage"),
                  content: <p>{product.usage}</p>,
                },
                {
                  title: isAr ? "التوصيل والدفع" : "Delivery & Payment",
                  content: (
                    <ul className="space-y-1">
                      <li>{isAr ? "توصيل لجميع المحافظات، 2–5 أيام عمل." : "Nationwide delivery, 2–5 business days."}</li>
                      <li>{isAr ? "الدفع عند الاستلام متاح في كل مكان." : "Cash on Delivery available everywhere."}</li>
                      <li>{isAr ? "دفع إلكتروني آمن عبر Paymob عند إتمام الطلب." : "Secure online payment via Paymob at checkout."}</li>
                    </ul>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
