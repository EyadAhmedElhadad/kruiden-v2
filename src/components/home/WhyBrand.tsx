"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProductDTO } from "@/lib/types";
import { FALLBACK_RITUAL } from "@/lib/site-content";
import { useLanguage } from "@/components/LanguageProvider";

type Ritual = typeof FALLBACK_RITUAL;

export default function WhyBrand({ product }: { product: ProductDTO }) {
  const { t, tr, isAr } = useLanguage();
  const [ritual, setRitual] = useState<Ritual>(FALLBACK_RITUAL as Ritual);

  useEffect(() => {
    fetch("/api/ritual")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ritual) setRitual(d.ritual);
      })
      .catch(() => {});
  }, []);
  return (
    <section
      id="ritual"
      dir={isAr ? "rtl" : "ltr"}
      style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
      className="bg-apos-surfaceContainer"
    >
      <div className="container-editorial grid gap-10 py-20 md:grid-cols-2 md:items-center md:gap-16 md:py-28">
        <div className="relative order-2 aspect-[4/5] w-full overflow-hidden rounded-xl md:order-1 apo-shadow">
          <Image
            src={ritual.imageUrl || product.images[1] || product.images[0]}
            alt="Botanical ingredients used in the oil"
            fill
            sizes="(min-width: 768px) 560px, 90vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 max-w-lg md:order-2">
          <p className="apo-eyebrow">{tr(ritual.eyebrow) || t("ritual.eyebrow")}</p>
          <h2
            className="mt-5 whitespace-pre-line font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]"
            style={isAr ? { fontFamily: '"Cairo", serif' } : undefined}
          >
            {tr(ritual.headline) || t("ritual.headline")}
          </h2>
          <p
            className="mt-6 text-[15px] leading-relaxed text-apos-onSurfaceVariant"
            style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
          >
            {tr(ritual.description) || t("ritual.description")}
          </p>

          <ul className="mt-8 space-y-5">
            {(ritual.bullets as string[]).map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-[15px] text-apos-onSurfaceVariant"
                style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-apos-primary" />
                {tr(item)}
              </li>
            ))}
          </ul>

          <Link href={ritual.ctaHref} className="apo-btn mt-9" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
            {tr(ritual.ctaLabel) || t("ritual.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
