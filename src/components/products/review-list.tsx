import { Rating } from "@/components/ui/rating";
import type { Review } from "@/types/product";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="divide-border divide-y">
      {reviews.map((review) => (
        <li key={review.id} className="space-y-1 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">{review.author}</p>
            <time dateTime={review.date} className="text-muted text-xs">
              {dateFormatter.format(new Date(review.date))}
            </time>
          </div>
          <Rating value={review.rating} />
          <p className="text-muted text-sm">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
