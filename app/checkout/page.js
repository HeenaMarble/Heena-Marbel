import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/actions/customer-auth";
import { getShippingSettings } from "@/lib/actions/shipping-actions";
import { getActiveQuantityDiscount } from "@/lib/actions/quantity-discount";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout | Heena Marble",
  description: "Secure checkout for authentic Makrana marble artifacts.",
};

export default async function CheckoutPage({ searchParams }) {
  const customer = await getCurrentCustomer();
  const sp = await searchParams;
  const mode = sp?.mode;

  if (!customer) {
    const redirectUrl = mode ? `/checkout?mode=${encodeURIComponent(mode)}` : "/checkout";
    redirect(`/signin?redirect=${encodeURIComponent(redirectUrl)}`);
  }

  const [shippingSettings, quantityDiscount] = await Promise.all([
    getShippingSettings().catch(() => ({ flat_rate: 79, free_shipping_above: 1499, cod_fee: 40 })),
    getActiveQuantityDiscount().catch(() => ({ enabled: false, tiers: [] })),
  ]);

  return (
    <Suspense fallback={null}>
      <CheckoutClient
        customer={customer}
        shippingSettings={shippingSettings}
        initialQuantityDiscount={quantityDiscount}
      />
    </Suspense>
  );
}
