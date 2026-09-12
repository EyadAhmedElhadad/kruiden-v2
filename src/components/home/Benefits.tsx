"use client";

import type { ProductDTO } from "@/lib/types";
import { useLanguage } from "@/components/LanguageProvider";

export default function Benefits({ product }: { product: ProductDTO }) {
  const { t, tr, isAr } = useLanguage();
  return (
    <section
      id="benefits"
      dir={isAr ? "rtl" : "ltr"}
      style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
      className="bg-apos-surfaceContainer py-20 md:py-28"
    >
      <div className="container-editorial">
        <div className="mb-14 max-w-lg md:mb-16">
          <p className="apo-eyebrow">{t("benefits.eyebrow")}</p>
          <h2
            className="mt-5 font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]"
            style={isAr ? { fontFamily: '"Cairo", serif' } : undefined}
          >
            {t("benefits.headline")}
          </h2>
        </div>

        <div className="grid gap-x-8 gap-y-10 md:grid-cols-4">
          {product.benefits.map((benefit, i) => (
            <div key={benefit} className="border-t border-apos-outlineVariant pt-5">
              <span className="font-noto text-sm text-apos-primaryContainer">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="mt-3 text-[15px] font-medium leading-snug text-apos-onSurface"
                style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
              >
                {tr(benefit)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
