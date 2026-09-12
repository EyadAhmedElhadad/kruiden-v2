"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/components/LanguageProvider";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const { lang, toggle, t, isAr } = useLanguage();

  const NAV_LINKS = [
    { label: t("header.about"), href: "/#ritual" },
    { label: t("header.theOil"), href: "/product" },
    { label: t("header.benefits"), href: "/#benefits" },
    { label: t("header.faq"), href: "/#faq" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-cream/90 backdrop-blur">
      <div className="container-editorial flex h-16 items-center justify-between md:h-20">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-ink md:text-2xl"
        >
          Kruiden
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium uppercase tracking-wide text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={toggle}
            aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
            className="hidden items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:border-ink/20 hover:text-ink md:inline-flex"
            style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden>
              language
            </span>
            {isAr ? "English" : "العربية"}
          </button>
          <Link
            href="/product"
            className="btn-primary hidden md:inline-flex"
            style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
          >
            {t("header.shopNow")}
          </Link>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-olive-100"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-olive-700 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-olive-100 md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-ink/8 bg-cream md:hidden">
          <nav className="container-editorial flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-ink/6 py-3.5 text-[13px] font-medium uppercase tracking-wide text-ink/80"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggle();
                setMenuOpen(false);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-widest text-ink/70"
              style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden>
                language
              </span>
              {isAr ? "English" : "العربية"}
            </button>
            <Link
              href="/product"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-4 w-full"
              style={isAr ? { fontFamily: '"Cairo", system-ui, sans-serif' } : undefined}
            >
              {t("header.shopNow")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.8h8.4a2 2 0 0 0 2-1.6L21.6 9H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="21.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="21.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
