"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function CheckoutHeader({ freeShippingThreshold, currency }: { freeShippingThreshold: number | null; currency: string }) {
  const { t, isAr } = useLanguage();
  return (
    <div dir={isAr ? "rtl" : "ltr"} style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
      <h1 className="font-serif text-3xl font-semibold text-ink md:text-4xl" style={isAr ? { fontFamily: '"Cairo", serif' } : undefined}>
        {t("checkout.title")}
      </h1>
      <p className="mt-2 text-sm text-ink/50">{t("checkout.subtitle")}</p>
      {freeShippingThreshold ? (
        <p className="mt-2 text-xs text-olive-600">
          {t("checkout.freeShipping")} {(freeShippingThreshold / 100).toFixed(0)} {currency}
        </p>
      ) : null}
    </div>
  );
}
