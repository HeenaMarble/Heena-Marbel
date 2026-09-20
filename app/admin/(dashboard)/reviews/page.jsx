import { Star } from "lucide-react";
import { getReviews } from "@/actions/reviews";
import ReviewRowActions from "@/components/admin/ReviewRowActions";

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Reviews</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">Approve or remove customer reviews.</p>
      </div>

      <div className="mt-8 space-y-3">
        {reviews.length === 0 ? (
          <p className="text-center py-12 text-[#1a1a1a]/50 font-semibold">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-[#b38b4d] text-[#b38b4d]" : "text-[#1a1a1a]/20"}`} />
                    ))}
                    <span className="ml-2 text-xs font-semibold text-[#1a1a1a]/50">
                      {r.customers?.name || "Anonymous"} on {r.products?.name || "a product"}
                    </span>
                  </div>
                  <p className="text-sm text-[#1a1a1a]/80">{r.comment}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.is_approved ? "bg-green-400/15 text-green-700" : "bg-[#1a1a1a]/10 text-[#1a1a1a]/50"}`}>
                    {r.is_approved ? "Approved" : "Pending"}
                  </span>
                  <ReviewRowActions id={r.id} isApproved={r.is_approved} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
