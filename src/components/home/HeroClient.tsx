"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import TrustIcon from "./TrustIcon";

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

const translations: Record<string, Record<string, string>> = {
  en: {},
  ar: {
    "Botanical Hair Ritual": "طقوس العناية النباتية بالشعر",
    "Naturally better": "أيام أفضل لشعرك،",
    "hair days.": "بطبيعتها.",
    "A cold-pressed hair oil made from a short, transparent list of botanicals — crafted to nourish the scalp and strengthen every strand.":
      "زيت شعر معصور على البارد من مكونات نباتية نقية ومختارة بعناية — صُمم ليغذي فروة الرأس ويقوي كل خصلة شعر.",
    "Purchase the Oil": "اشتري الزيت",
    "Shop the Oil": "اشتري الزيت",
    "PURCHASE THE OIL": "اشتري الزيت",
    "Discover the Ritual": "اكتشف الطقوس",
    "100% Botanical": "نباتي 100%",
    "No Fillers": "خالٍ من المواد المالئة",
    "Cruelty-Free": "لم يُجرب على الحيوانات",
  },
};

function t(en: string, lang: "en" | "ar"): string {
  if (lang === "en") return en;
  return translations.ar[en] ?? translations.ar[en.trim()] ?? en;
}

export default function HeroClient({ hero, heroImage, productName }: Props) {
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const saved = localStorage.getItem("kruiden_lang") as "en" | "ar" | null;
    if (saved === "ar" || saved === "en") setLang(saved);
    else {
      const browser = navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en";
      setLang(browser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kruiden_lang", lang);
  }, [lang]);

  const isAr = lang === "ar";

  // Translate hero fields
  const eyebrow = t(hero.eyebrow, lang);
  // Special handling for headline combined
  let headline1 = t(hero.headline1, lang);
  let headline2 = t(hero.headline2, lang);
  // Fallback if DB still has old combined logic: when en hero is "Purchase the Oil" etc we already map
  // For headline, ensure ar splits correctly
  if (isAr) {
    // If original en was the fallback, we have mapped above to ar parts
    // Ensure headline1/headline2 are not empty after translation
    if (hero.headline1 === "Naturally better" && hero.headline2 === "hair days.") {
      headline1 = "أيام أفضل لشعرك،";
      headline2 = "بطبيعتها.";
    }
  }

  const description = t(hero.description, lang);
  const primaryLabel = t(hero.primaryCtaLabel, lang);
  const secondaryLabel = t(hero.secondaryCtaLabel, lang);
  const badges = hero.trustBadges.map((b) => ({ ...b, label: t(b.label, lang) }));

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      style={isAr ? { fontFamily: '"Cairo", "IBM Plex Sans Arabic", "Noto Sans Arabic", system-ui, sans-serif' } : undefined}
      className="relative overflow-hidden bg-apos-surface"
    >
      {/* Language switcher - top corner */}
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <button
          onClick={() => setLang(isAr ? "en" : "ar")}
          aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
          className="inline-flex items-center gap-2 rounded-full border border-apos-primary/30 bg-white/80 px-4 py-2 text-xs font-semibold tracking-widest backdrop-blur transition-colors hover:bg-apos-primary hover:text-white"
          style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden>
            language
          </span>
          {isAr ? "English" : "العربية"}
        </button>
      </div>

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
