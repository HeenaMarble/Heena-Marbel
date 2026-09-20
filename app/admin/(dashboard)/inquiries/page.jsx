import { getInquiries } from "@/actions/inquiries";
import InquiryRowActions from "@/components/admin/InquiryRowActions";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <div className="border-b border-[#b38b4d]/20 pb-6">
        <h1 className="text-3xl font-semibold text-[#1a1a1a]">Inquiries</h1>
        <p className="text-base text-[#1a1a1a]/50 mt-1">Contact form submissions and quote requests.</p>
      </div>

      <div className="mt-8 space-y-3">
        {inquiries.length === 0 ? (
          <p className="text-center py-12 text-[#1a1a1a]/50 font-semibold">No inquiries yet.</p>
        ) : (
          inquiries.map((i) => (
            <div key={i.id} className="rounded-2xl border border-[#b38b4d]/20 bg-white/85 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-[#1a1a1a]">{i.name}</p>
                  <p className="text-xs text-[#1a1a1a]/50">{i.email} {i.phone ? `• ${i.phone}` : ""}</p>
                  <p className="text-sm text-[#1a1a1a]/80 mt-2">{i.message}</p>
                  <p className="text-xs text-[#1a1a1a]/40 mt-2">{new Date(i.created_at).toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${i.is_resolved ? "bg-green-400/15 text-green-700" : "bg-blue-400/15 text-blue-700"}`}>
                    {i.is_resolved ? "Resolved" : "Open"}
                  </span>
                  <InquiryRowActions id={i.id} isResolved={i.is_resolved} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
