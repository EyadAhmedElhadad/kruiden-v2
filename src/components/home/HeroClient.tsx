"use client";

import Image from "next/image";
import Link from "next/link";
import TrustIcon from "./TrustIcon";
import { useLanguage } from "@/components/LanguageProvider";

type HeroData = {
  eyebrow: string;
  headline1: string;
  headline2: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string | null;
  trustBadges: { icon: string; label: string }[];
};

type Props = {
  hero: HeroData;
  heroImage: string;
  productName: string;
};

export default function HeroClient({ hero, heroImage, productName }: Props) {
  const { lang, isAr, t, tr } = useLanguage();

  // Translate hero fields using global dictionary (fallback to tr for DB values)
  const eyebrow = lang === "ar" ? tr(hero.eyebrow) || t("hero.eyebrow") : hero.eyebrow;
  let headline1 = lang === "ar" ? tr(hero.headline1) || t("hero.headline1") : hero.headline1;
  let headline2 = lang === "ar" ? tr(hero.headline2) || t("hero.headline2") : hero.headline2;
  if (isAr && hero.headline1 === "Naturally better" && hero.headline2 === "hair days.") {
    headline1 = t("hero.headline1");
    headline2 = t("hero.headline2");
  }
  const description = lang === "ar" ? tr(hero.description) || t("hero.description") : hero.description;
  const primaryLabel = lang === "ar" ? tr(hero.primaryCtaLabel) || t("hero.primaryCta") : hero.primaryCtaLabel;
  const secondaryLabel = lang === "ar" ? tr(hero.secondaryCtaLabel) || t("hero.secondaryCta") : hero.secondaryCtaLabel;
  const badges = hero.trustBadges.map((b) => ({ ...b, label: lang === "ar" ? tr(b.label) : b.label }));

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      style={isAr ? { fontFamily: '"Cairo", "IBM Plex Sans Arabic", "Noto Sans Arabic", system-ui, sans-serif' } : undefined}
      className="relative overflow-hidden bg-apos-surface"
    >

      <div className="container-editorial grid items-center gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <div className="order-2 md:order-1">
          <p className="apo-eyebrow">{eyebrow}</p>
          <h1
            className="mt-5 font-noto text-4xl font-semibold leading-[1.08] tracking-tight text-apos-onSurface md:text-[56px]"
            style={isAr ? { fontFamily: '"Cairo", "IBM Plex Sans Arabic", serif', lineHeight: "1.25" } : undefined}
          >
            {headline1}
            <br />
            {headline2}
          </h1>
          <p
            className="mt-6 max-w-md text-[15px] leading-relaxed text-apos-onSurfaceVariant"
            style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
          >
            {description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={hero.primaryCtaHref} className="apo-btn">
              {primaryLabel}
            </Link>
            <Link href={hero.secondaryCtaHref} className="apo-btn-ghost">
              {secondaryLabel}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-5">
            {badges.map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <TrustIcon name={t.icon} className="text-apos-primary" />
                <span
                  className="text-[12px] font-medium text-apos-onSurfaceVariant"
                  style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
                >
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-xl md:order-2 apo-shadow">
          <Image
            src={heroImage}
            alt={productName}
            fill
            priority
            sizes="(min-width: 768px) 560px, 90vw"
            className="object-cover"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 text-apos-primary/15"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M100 10c40 30 60 70 40 130-30 20-70 20-90-10C30 90 50 40 100 10Z"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path d="M100 10c0 60 0 100 0 130" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  );
}
