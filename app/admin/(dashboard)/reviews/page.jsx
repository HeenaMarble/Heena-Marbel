import { getReviews } from "@/actions/reviews";
import ReviewsPageClient from "@/components/admin/ReviewsPageClient";

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return <ReviewsPageClient reviews={reviews} />;
}
