import Link from "next/link";
import { PlusCircle, Star, Quote, MapPin } from "lucide-react";
import { getTestimonials } from "@/lib/actions/content-actions";
import TestimonialRowActions from "@/components/admin/content/TestimonialRowActions";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  let testimonials = [];
  try {
    testimonials = await getTestimonials();
  } catch (err) {
    console.error("Failed to load testimonials:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#b38b4d]/20 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">Testimonials</h1>
          <p className="text-base text-[#1a1a1a]/50 mt-1">
            Manage customer feedback and reviews showcased on your site.
          </p>
        </div>
        <Link
          href="/admin/content/testimonials/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#b38b4d] hover:bg-[#967440] text-white font-semibold px-5 py-2.5 transition-colors self-start sm:self-auto shadow-sm"
        >
          <PlusCircle className="h-4 w-4" /> Add Testimonial
        </Link>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {!testimonials || testimonials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#b38b4d]/30 bg-white/50 p-12 text-center">
            <Quote className="mx-auto h-10 w-10 text-[#b38b4d]/30 mb-3" />
            <p className="text-base font-semibold text-[#1a1a1a]">No testimonials yet</p>
            <p className="text-sm text-[#1a1a1a]/50 mt-1 max-w-sm mx-auto">
              Add client testimonials to highlight social proof and satisfaction on your storefront.
            </p>
            <div className="mt-5">
              <Link
                href="/admin/content/testimonials/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#b38b4d] text-white font-semibold px-5 py-2 text-sm hover:bg-[#967440] transition-colors"
              >
                <PlusCircle className="h-4 w-4" /> Add First Testimonial
              </Link>
            </div>
          </div>
        ) : (
          testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#b38b4d]/20 bg-white/90 p-5 shadow-sm transition-all hover:border-[#b38b4d]/40"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Info & Quote */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-[#1a1a1a] text-base">
                      {item.name}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1 text-xs text-[#1a1a1a]/50 bg-stone-100 rounded-full px-2.5 py-0.5">
                        <MapPin className="h-3 w-3 text-[#b38b4d]" /> {item.location}
                      </span>
                    )}
                    <span className="text-xs font-medium text-[#b38b4d] bg-[#b38b4d]/10 rounded-full px-2.5 py-0.5">
                      Order: #{item.display_order ?? 0}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (item.rating ?? 5)
                            ? "fill-[#b38b4d] text-[#b38b4d]"
                            : "text-stone-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Message (truncated if long) */}
                  <p className="text-sm text-[#1a1a1a]/75 line-clamp-2 italic">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                  <TestimonialRowActions
                    id={item.id}
                    isActive={item.is_active}
                    name={item.name}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
