"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const FAQ_KEYS = [
  { q: "faq.q1" as const, a: "faq.a1" as const },
  { q: "faq.q2" as const, a: "faq.a2" as const },
  { q: "faq.q3" as const, a: "faq.a3" as const },
  { q: "faq.q4" as const, a: "faq.a4" as const },
  { q: "faq.q5" as const, a: "faq.a5" as const },
  { q: "faq.q6" as const, a: "faq.a6" as const },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t, isAr } = useLanguage();

  return (
    <section
      id="faq"
      dir={isAr ? "rtl" : "ltr"}
      style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
      className="bg-apos-surfaceContainer py-20 md:py-28"
    >
      <div className="container-editorial max-w-2xl">
        <p className="apo-eyebrow text-center">{t("faq.eyebrow")}</p>
        <h2
          className="mt-5 text-center font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]"
          style={isAr ? { fontFamily: '"Cairo", serif' } : undefined}
        >
          {t("faq.headline")}
        </h2>

        <div className="mt-12 divide-y divide-apos-outlineVariant border-t border-b border-apos-outlineVariant">
          {FAQ_KEYS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                >
                  <span className="text-[15px] font-medium text-apos-onSurface" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
                    {t(item.q)}
                  </span>
                  <span
                    className={`shrink-0 text-lg text-apos-primary transition-transform duration-300 ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-editorial ${
                    open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                  }`}
                >
                  <p className="min-h-0 text-[14px] leading-relaxed text-apos-onSurfaceVariant" style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}>
                    {t(item.a)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
