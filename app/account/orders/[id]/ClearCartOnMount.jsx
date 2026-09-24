"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnMount() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { clearCart, clearBuyNowItem } = useCart();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      clearCart?.();
      clearBuyNowItem?.();
      router.replace(pathname); // strip ?new=1 so refresh doesn't re-clear
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
