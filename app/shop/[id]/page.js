import { getShopProduct, getRelatedProducts } from "@/actions/shop";
import { getApprovedReviews } from "@/actions/reviews";
import { getCurrentCustomer } from "@/actions/customer-auth";
import { PRODUCTS } from "@/data/products";
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

  let relatedProducts = [];

  if (product) {
    try {
      relatedProducts = await getRelatedProducts(product.id, product.category_id);
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
    if (!relatedProducts || relatedProducts.length === 0) {
      relatedProducts = PRODUCTS.filter((p) => p.id !== id).slice(0, 4);
    }
  } else {
    // Fallback for static mock items if tested by ID
    const staticProduct = PRODUCTS.find((p) => p.id === id);
    if (staticProduct) {
      product = {
        ...staticProduct,
        images: [staticProduct.img],
        dimensions: [],
      };
      relatedProducts = PRODUCTS.filter((p) => p.id !== id).slice(0, 4);
    }
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

  // Fetch top 4 approved reviews and current customer in parallel
  const [initialReviews, currentCustomer] = await Promise.all([
    getApprovedReviews(product.id, 4).catch(() => []),
    getCurrentCustomer().catch(() => null),
  ]);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      initialReviews={initialReviews}
      currentCustomer={currentCustomer}
    />
  );
}
