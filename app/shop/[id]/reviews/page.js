import { getAllApprovedReviews } from "@/actions/reviews";
import { getShopProduct } from "@/actions/shop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default async function AllReviewsPage({ params }) {
  const { id } = await params;

  const [product, reviews] = await Promise.all([
    getShopProduct(id).catch(() => null),
    getAllApprovedReviews(id).catch(() => []),
  ]);

  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
      : null;

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30)
      return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
    if (days < 365)
      return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {/* Back link */}
        <Link
          href={`/shop/${id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-light)",
            fontWeight: 500,
            fontSize: "0.92rem",
            textDecoration: "none",
            marginBottom: "28px",
          }}
        >
          ← Back to {product?.name || "Product"}
        </Link>

        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "24px",
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "2rem",
              color: "var(--text-dark)",
              marginBottom: "6px",
            }}
          >
            Customer Reviews
          </h1>
          {product && (
            <p style={{ color: "var(--text-light)", fontSize: "0.95rem" }}>
              {product.name}
            </p>
          )}

          {/* Rating summary */}
          {avgRating && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 700,
                  color: "var(--text-dark)",
                  lineHeight: 1,
                }}
              >
                {avgRating}
              </span>
              <div>
                <div style={{ display: "flex", gap: "3px", marginBottom: "4px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: "1.3rem",
                        color:
                          s <= Math.round(Number(avgRating))
                            ? "#f5b041"
                            : "#e0e0e0",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ color: "var(--text-light)", fontSize: "0.88rem", margin: 0 }}>
                  Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ color: "var(--text-light)", fontSize: "1rem" }}>
              No approved reviews yet for this product.
            </p>
            <Link
              href={`/shop/${id}`}
              className="btn-primary"
              style={{ display: "inline-block", marginTop: "20px" }}
            >
              Be the first to review
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: "24px 0",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                {/* Reviewer + date */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--text-dark)",
                      fontSize: "1.02rem",
                    }}
                  >
                    {r.customers?.name || "Customer"}
                  </span>
                  <span style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>
                    {timeAgo(r.created_at)}
                  </span>
                </div>

                {/* Stars */}
                <div style={{ display: "flex", gap: "3px", marginBottom: "10px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: "1.1rem",
                        color: s <= r.rating ? "#f5b041" : "#e0e0e0",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Comment */}
                <p
                  style={{
                    color: "var(--text-main)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
