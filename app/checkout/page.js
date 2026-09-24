import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/actions/customer-auth";
import { getShippingSettings } from "@/lib/actions/shipping-actions";
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

  const shippingSettings = await getShippingSettings();

  return (
    <Suspense fallback={null}>
      <CheckoutClient customer={customer} shippingSettings={shippingSettings} />
    </Suspense>
  );
}
