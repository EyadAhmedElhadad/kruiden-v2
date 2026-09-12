import type { Metadata } from "next";
import { isPaymobConfigured } from "@/lib/paymob";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { getCartSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Kruiden",
};

export default async function CheckoutPage() {
  const cartSettings = await getCartSettings();
  const paymobEnabled = isPaymobConfigured();
  // If COD disabled in settings, hide it even if paymob is off -> will show error in form
  return (
    <div className="container-editorial max-w-2xl py-12 md:py-16">
      <CheckoutHeader freeShippingThreshold={cartSettings.freeShippingThreshold} currency={cartSettings.currency} />
      <div className="mt-10">
        <CheckoutForm paymobEnabled={paymobEnabled} codEnabled={cartSettings.codEnabled} />
      </div>
    </div>
  );
}
