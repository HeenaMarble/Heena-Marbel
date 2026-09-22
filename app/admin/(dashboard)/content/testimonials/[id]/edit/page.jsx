import { notFound } from "next/navigation";
import { getTestimonials } from "@/lib/actions/content-actions";
import TestimonialForm from "@/components/admin/content/TestimonialForm";

export const metadata = {
  title: "Edit Testimonial | Heena Marble Admin",
};

export default async function EditTestimonialPage({ params }) {
  const { id } = await params;
  let testimonial = null;

  try {
    const testimonials = await getTestimonials();
    testimonial = testimonials?.find((t) => String(t.id) === String(id));
  } catch (err) {
    console.error("Error fetching testimonial:", err);
  }

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Edit Testimonial</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Update the testimonial details below.
        </p>
      </div>

      <div className="mt-8">
        <TestimonialForm initialData={testimonial} />
      </div>
    </div>
  );
}
