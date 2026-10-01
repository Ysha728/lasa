/**
 * Reviews — the "Reviews & Ratings" community section.
 *
 * Visitors pick a dish, choose 1–5 stars, write a short review, and submit.
 * Submitted reviews render as cards, and the average rating is shown
 * prominently with the message "Share your LASA experience!".
 *
 * Backend wiring: `submitReview` writes, `listReviews` reads the cards, and
 * `getReviewStats` supplies the average + count. All three go through React
 * Query so the UI stays in sync and never crashes if a call fails.
 */
import { createActor } from "@/backend";
import { ReviewCard } from "@/components/ReviewCard";
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
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2, MessageSquareHeart, Send } from "lucide-react";
import { useState } from "react";

/** Read every submitted review, newest first. */
function useReviews() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Average rating + review count for one dish. */
function useReviewStats(foodId: number) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["reviewStats", foodId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getReviewStats(BigInt(foodId));
    },
    enabled: !!actor && !isFetching,
  });
}

/** Submit a new review and refresh the list + stats on success. */
function useSubmitReview() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      foodId: number;
      reviewerName: string;
      rating: number;
      text: string;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitReview({
        foodId: BigInt(input.foodId),
        reviewerName: input.reviewerName,
        rating: BigInt(input.rating),
        text: input.text,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["reviewStats"] });
    },
  });
}

export function Reviews() {
  const reviewsQuery = useReviews();
  const submitReview = useSubmitReview();

  // Form draft state — owned locally, never derived from query data.
  const [foodId, setFoodId] = useState<number>(FOODS[0]?.id ?? 1);
  const [rating, setRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [text, setText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // The average shown in the summary follows the currently selected dish.
  const statsQuery = useReviewStats(foodId);
  const stats = statsQuery.data;
  const average = stats ? stats.average : 0;
  const count = stats ? Number(stats.count) : 0;

  const reviews = reviewsQuery.data ?? [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    // Simple, friendly validation before we hit the backend.
    if (rating < 1) {
      setFormError("Please pick a star rating first.");
      return;
    }
    if (reviewerName.trim().length === 0) {
      setFormError("Please add your name so we know who to thank.");
      return;
    }
    if (text.trim().length === 0) {
      setFormError("Please write a short review.");
      return;
    }

    // Capture the draft, clear it immediately, and restore it only on error.
    const draft = {
      foodId,
      reviewerName: reviewerName.trim(),
      rating,
      text: text.trim(),
    };
    setReviewerName("");
    setText("");
    setRating(0);

    submitReview.mutate(draft, {
      onError: () => {
        setReviewerName((current) =>
          current === "" ? draft.reviewerName : current,
        );
        setText((current) => (current === "" ? draft.text : current));
        setRating((current) => (current === 0 ? draft.rating : current));
      },
    });
  };

  return (
    <Section id="reviews" label="Reviews" className="bg-gradient-subtle">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Community
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Reviews &amp; Ratings
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Share your LASA experience! Rate a dish, tell us what you loved, and
            help the next hungry visitor decide.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Left column: the review form + average summary. */}
          <div className="flex flex-col gap-6">
            {/* Average rating summary card */}
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
                {count === 0
                  ? "No reviews for this dish yet — be the first!"
                  : `Based on ${count} review${count === 1 ? "" : "s"}.`}
              </p>
              <p className="mt-4 font-display text-lg font-semibold text-primary">
                Share your LASA experience!
              </p>
            </div>

            {/* Review form */}
            <form
              onSubmit={handleSubmit}
              data-ocid="review.form"
              className="rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle"
            >
              <h3 className="font-display text-xl font-semibold text-card-foreground">
                Write a review
              </h3>

              <div className="mt-5 flex flex-col gap-5">
                {/* Dish picker */}
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

                {/* Star rating */}
                <div className="flex flex-col gap-2">
                  <Label>Your rating</Label>
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    label="Your rating"
                  />
                </div>

                {/* Reviewer name */}
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

                {/* Review text */}
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

                {/* Inline validation / error message */}
                {formError ? (
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
                ) : null}

                {submitReview.isError ? (
                  <p
                    data-ocid="review.submit_error_state"
                    className="flex items-center gap-2 text-sm text-destructive"
                  >
                    <AlertCircle
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    We couldn&apos;t save your review. Please try again.
                  </p>
                ) : null}

                {submitReview.isSuccess ? (
                  <p
                    data-ocid="review.success_state"
                    className="flex items-center gap-2 text-sm text-success"
                  >
                    <MessageSquareHeart
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    Salamat! Your review is now live.
                  </p>
                ) : null}

                <Button
                  type="submit"
                  data-ocid="review.submit_button"
                  disabled={submitReview.isPending}
                  className="w-full rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90"
                >
                  {submitReview.isPending ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden="true" />
                  )}
                  {submitReview.isPending ? "Submitting…" : "Submit review"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right column: the submitted review cards. */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-xl font-semibold text-foreground">
              What people are saying
            </h3>

            {reviewsQuery.isLoading ? (
              <div
                data-ocid="review.loading_state"
                className="grid gap-4 sm:grid-cols-2"
              >
                {Array.from(
                  { length: 4 },
                  (_, i) => `review-skeleton-${i}`,
                ).map((id) => (
                  <div
                    key={id}
                    className="h-40 animate-pulse rounded-[var(--radius)] border border-border bg-muted"
                  />
                ))}
              </div>
            ) : reviewsQuery.isError ? (
              <div
                data-ocid="review.list_error_state"
                className="rounded-[var(--radius)] border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
              >
                We couldn&apos;t load the reviews right now. Please refresh the
                page to try again.
              </div>
            ) : reviews.length === 0 ? (
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
                {reviews.map((review) => (
                  <ReviewCard key={review.id.toString()} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
