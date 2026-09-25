import { getShopProduct, getRelatedProducts } from "@/actions/shop";
import { getApprovedReviews } from "@/actions/reviews";
import { getCurrentCustomer } from "@/actions/customer-auth";
import ProductDetailClient from "@/components/ProductDetailClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let product = null;

  try {
    product = await getShopProduct(id);
  } catch (err) {
    console.error("Error fetching shop product:", err);
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>Product Not Found</h1>
          <Link
            href="/shop"
            className="btn-primary"
            style={{ marginTop: "20px" }}
          >
            Return to Shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Fetch related products (excluding current product), top 4 approved reviews, and current customer in parallel
  const [relatedProducts, initialReviews, currentCustomer] = await Promise.all([
    getRelatedProducts(product.id, 4).catch((err) => {
      console.error("Error fetching related products:", err);
      return [];
    }),
    getApprovedReviews(product.id, 4).catch(() => []),
    getCurrentCustomer().catch(() => null),
  ]);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts || []}
      initialReviews={initialReviews}
      currentCustomer={currentCustomer}
    />
  );
}
