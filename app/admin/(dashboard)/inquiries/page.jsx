import { getInquiries } from "@/actions/inquiries";
import InquiriesPageClient from "@/components/admin/InquiriesPageClient";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();
  return <InquiriesPageClient inquiries={inquiries} />;
}
