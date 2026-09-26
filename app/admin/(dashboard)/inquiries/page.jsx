import { getInquiries, markInquiriesAsRead } from "@/actions/inquiries";
import InquiriesPageClient from "@/components/admin/InquiriesPageClient";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();
  await markInquiriesAsRead();
  return <InquiriesPageClient inquiries={inquiries} />;
}
