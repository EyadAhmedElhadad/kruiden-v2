"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { translations, type Lang, type TranslationKey } from "@/lib/translations";

type LanguageContextValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  isAr: boolean;
  t: (key: TranslationKey) => string;
  tr: (enText: string) => string;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Map common English strings to translation keys for DB-driven content
const enToKey: Record<string, TranslationKey> = {
  "Botanical Hair Ritual": "hero.eyebrow",
  "Naturally better": "hero.headline1",
  "hair days.": "hero.headline2",
  "A cold-pressed hair oil made from a short, transparent list of botanicals — crafted to nourish the scalp and strengthen every strand.": "hero.description",
  "Purchase the Oil": "hero.primaryCta",
  "Shop the Oil": "hero.primaryCta",
  "Discover the Ritual": "hero.secondaryCta",
  "100% Botanical": "hero.trust.100",
  "No Fillers": "hero.trust.noFillers",
  "Cruelty-Free": "hero.trust.cruelty",
  "100% Natural Ingredients": "features.100natural",
  "Cold-Pressed": "features.coldPressed",
  "Fast Delivery": "features.fastDelivery",
  "The Ritual": "ritual.eyebrow",
  "Simple ingredients.\nBetter hair days.": "ritual.headline",
  "We started with one question: what would this oil look like with nothing to hide? The answer is a short list of cold-pressed botanicals, blended in small batches and bottled without dilution — so every drop does the work.": "ritual.description",
  "No synthetic fillers, ever": "ritual.bullet1",
  "Cold-pressed to preserve nutrients": "ritual.bullet2",
  "Formulated for daily scalp care": "ritual.bullet3",
  "Nourishes the scalp": "benefits.b1",
  "Helps strengthen hair": "benefits.b2",
  "Adds natural shine": "benefits.b3",
  "Supports a healthy hair routine": "benefits.b4",
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const saved = localStorage.getItem("kruiden_lang") as Lang | null;
    if (saved === "ar" || saved === "en") setLang(saved);
    else if (navigator.language?.toLowerCase().startsWith("ar")) setLang("ar");
  }, []);

  useEffect(() => {
    localStorage.setItem("kruiden_lang", lang);
    document.documentElement.lang = lang;
    // Keep admin always LTR
    if (isAdminRoute) {
      document.documentElement.dir = "ltr";
      document.body.style.fontFamily = "";
      return;
    }
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    // Apply Arabic font to body when ar (storefront only)
    if (lang === "ar") {
      document.body.style.fontFamily = "'Cairo', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', system-ui, sans-serif";
    } else {
      document.body.style.fontFamily = "";
    }
  }, [lang, isAdminRoute]);

  const t = (key: TranslationKey) => translations[lang][key] ?? translations.en[key] ?? key;

  // Translate arbitrary English text if known
  const tr = (enText: string) => {
    if (lang === "en") return enText;
    const key = enToKey[enText] ?? enToKey[enText.trim()];
    if (key) return translations.ar[key] ?? enText;
    // Also try direct lookup in translations.en values
    const found = (Object.entries(translations.en) as [TranslationKey, string][]).find(([, v]) => v === enText);
    if (found) return translations.ar[found[0]] ?? enText;
    return enText;
  };

  const toggle = () => setLang((l) => (l === "en" ? "ar" : "en"));

  const value: LanguageContextValue = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    isAr: lang === "ar",
    t,
    tr,
    setLang,
    toggle,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
