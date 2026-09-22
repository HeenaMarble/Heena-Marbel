import TestimonialForm from "@/components/admin/content/TestimonialForm";

export const metadata = {
  title: "Add Testimonial | Heena Marble Admin",
};

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Add Testimonial</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">
          Add a new customer review to the website.
        </p>
      </div>

      <div className="mt-8">
        <TestimonialForm />
      </div>
    </div>
  );
}
