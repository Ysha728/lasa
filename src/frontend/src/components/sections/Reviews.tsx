
import { Section } from "@/components/Section";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FOODS } from "@/data/foods";
import {
  AlertCircle,
  MessageSquareHeart,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";

type LocalReview = {
  id: string;
  foodId: number;
  reviewerName: string;
  rating: number;
  text: string;
  createdAt: number;
};

const STORAGE_KEY = "lasa-reviews";

function loadReviews(): LocalReview[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is LocalReview =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.foodId === "number" &&
        typeof item.reviewerName === "string" &&
        typeof item.rating === "number" &&
        item.rating >= 1 &&
        item.rating <= 5 &&
        typeof item.text === "string" &&
        typeof item.createdAt === "number",
    );
  } catch {
    return [];
  }
}

export function Reviews() {
  const [reviews, setReviews] = useState<LocalReview[]>([]);
  const [foodId, setFoodId] = useState<number>(FOODS[0]?.id ?? 1);
  const [rating, setRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [text, setText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setReviews(loadReviews());
  }, []);

  const dishReviews = reviews.filter(
    (review) => review.foodId === foodId,
  );

  const average =
    dishReviews.length > 0
      ? dishReviews.reduce((sum, review) => sum + review.rating, 0) /
        dishReviews.length
      : 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccess(false);

    if (rating < 1 || rating > 5) {
      setFormError("Please pick a star rating first.");
      return;
    }

    if (!reviewerName.trim()) {
      setFormError("Please add your name so we know who to thank.");
      return;
    }

    if (!text.trim()) {
      setFormError("Please write a short review.");
      return;
    }

    const newReview: LocalReview = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      foodId,
      reviewerName: reviewerName.trim(),
      rating,
      text: text.trim(),
      createdAt: Date.now(),
    };

    const updated = [newReview, ...reviews];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setReviews(updated);
      setReviewerName("");
      setText("");
      setRating(0);
      setSuccess(true);
    } catch {
      setFormError(
        "We couldn't save your review. Please check your browser storage.",
      );
    }
  };

  return (
    <Section id="reviews" label="Reviews" className="bg-gradient-subtle">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Community
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Reviews &amp; Ratings
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Share your LASA experience! Rate a dish, tell us what you loved,
            and help the next hungry visitor decide.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col gap-6">
            <div
              data-ocid="review.stats_panel"
              className="rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Average rating
              </p>
              <div className="mt-2 flex items-end gap-3">
                <span className="font-display text-5xl font-semibold leading-none text-gradient">
                  {average > 0 ? average.toFixed(1) : "—"}
                </span>
                <span className="pb-1 text-sm text-muted-foreground">
                  out of 5
                </span>
              </div>
              <div className="mt-3">
                <StarRating value={Math.round(average)} readOnly size={20} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {dishReviews.length === 0
                  ? "No reviews for this dish yet — be the first!"
                  : `Based on ${dishReviews.length} review${dishReviews.length === 1 ? "" : "s"}.`}
              </p>
              <p className="mt-4 font-display text-lg font-semibold text-primary">
                Share your LASA experience!
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              data-ocid="review.form"
              className="rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle"
            >
              <h3 className="font-display text-xl font-semibold text-card-foreground">
                Write a review
              </h3>

              <div className="mt-5 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="review-food">Which dish?</Label>
                  <Select
                    value={String(foodId)}
                    onValueChange={(value) => setFoodId(Number(value))}
                  >
                    <SelectTrigger
                      id="review-food"
                      data-ocid="review.food_select"
                      className="w-full rounded-md"
                    >
                      <SelectValue placeholder="Pick a dish" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOODS.map((food) => (
                        <SelectItem key={food.id} value={String(food.id)}>
                          {food.emoji} {food.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Your rating</Label>
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    label="Your rating"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="review-name">Your name</Label>
                  <Input
                    id="review-name"
                    data-ocid="review.name_input"
                    value={reviewerName}
                    onChange={(event) => setReviewerName(event.target.value)}
                    placeholder="e.g. Maria S."
                    maxLength={60}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="review-text">Your review</Label>
                  <Textarea
                    id="review-text"
                    data-ocid="review.textarea"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="What did you think of the dish?"
                    rows={4}
                    maxLength={500}
                  />
                </div>

                {formError && (
                  <p
                    data-ocid="review.error_state"
                    className="flex items-center gap-2 text-sm text-destructive"
                  >
                    <AlertCircle
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    {formError}
                  </p>
                )}

                {success && (
                  <p
                    data-ocid="review.success_state"
                    className="flex items-center gap-2 text-sm text-success"
                  >
                    <MessageSquareHeart
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    Salamat! Your review has been saved.
                  </p>
                )}

                <Button
                  type="submit"
                  data-ocid="review.submit_button"
                  className="w-full rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Submit review
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xl font-semibold text-foreground">
              What people are saying
            </h3>

            {reviews.length === 0 ? (
              <div
                data-ocid="review.empty_state"
                className="rounded-[var(--radius)] border border-dashed border-border bg-card p-8 text-center"
              >
                <MessageSquareHeart
                  className="mx-auto h-8 w-8 text-primary/60"
                  aria-hidden="true"
                />
                <p className="mt-3 font-display text-lg font-semibold text-card-foreground">
                  No reviews yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first to share your LASA experience!
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((review) => {
                  const food = FOODS.find((item) => item.id === review.foodId);

                  return (
                    <article
                      key={review.id}
                      data-ocid="review.card"
                      className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-[var(--radius)] border border-border bg-card p-5 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <StarRating value={review.rating} readOnly size={16} />
                        {food && (
                          <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-secondary-foreground">
                            {food.emoji} {food.name}
                          </span>
                        )}
                      </div>

                      <p className="flex-1 text-sm leading-relaxed text-card-foreground">
                        {review.text}
                      </p>

                      <footer className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
                        <span className="truncate font-display text-sm font-semibold text-card-foreground">
                          {review.reviewerName}
                        </span>
                        <time className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </time>
                      </footer>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
    }
            
