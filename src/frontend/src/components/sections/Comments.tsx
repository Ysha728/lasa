/**
 * Comments — the food-related comments / reactions area.
 *
 * Visitors leave a short comment (optionally tied to a dish) and submitted
 * comments appear in a clean list with the author's name and the comment text.
 *
 * Backend wiring: `submitComment` writes and `listComments` reads, both through
 * React Query so the list refreshes automatically after a successful post.
 */
import { createActor } from "@/backend";
import { Section } from "@/components/Section";
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
import { formatTimestamp } from "@/lib/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

/** Read every submitted comment, newest first. */
function useComments() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listComments();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Submit a new comment and refresh the list on success. */
function useSubmitComment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      foodId: number;
      authorName: string;
      text: string;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitComment({
        foodId: BigInt(input.foodId),
        authorName: input.authorName,
        text: input.text,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function Comments() {
  const commentsQuery = useComments();
  const submitComment = useSubmitComment();

  // Form draft state — owned locally, never derived from query data.
  const [foodId, setFoodId] = useState<number>(FOODS[0]?.id ?? 1);
  const [authorName, setAuthorName] = useState("");
  const [text, setText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const comments = commentsQuery.data ?? [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (authorName.trim().length === 0) {
      setFormError("Please add your name before posting.");
      return;
    }
    if (text.trim().length === 0) {
      setFormError("Please write a comment or reaction.");
      return;
    }

    // Capture the draft, clear it immediately, restore only if the save fails.
    const draft = {
      foodId,
      authorName: authorName.trim(),
      text: text.trim(),
    };
    setAuthorName("");
    setText("");

    submitComment.mutate(draft, {
      onError: () => {
        setAuthorName((current) =>
          current === "" ? draft.authorName : current,
        );
        setText((current) => (current === "" ? draft.text : current));
      },
    });
  };

  return (
    <Section id="comments" label="Comments">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Reactions
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Comments
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Got a hot take, a memory, or a craving? Drop a comment and join the
            conversation.
          </p>
        </header>

        {/* Comment form */}
        <form
          onSubmit={handleSubmit}
          data-ocid="comment.form"
          className="mt-10 rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="comment-name">Your name</Label>
              <Input
                id="comment-name"
                data-ocid="comment.name_input"
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                placeholder="e.g. Juan D."
                maxLength={60}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="comment-food">About which dish?</Label>
              <Select
                value={String(foodId)}
                onValueChange={(value) => setFoodId(Number(value))}
              >
                <SelectTrigger
                  id="comment-food"
                  data-ocid="comment.food_select"
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
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Label htmlFor="comment-text">Your comment</Label>
            <Textarea
              id="comment-text"
              data-ocid="comment.textarea"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Share a reaction, a memory, or a tip…"
              rows={3}
              maxLength={400}
            />
          </div>

          {formError ? (
            <p
              data-ocid="comment.error_state"
              className="mt-4 flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {formError}
            </p>
          ) : null}

          {submitComment.isError ? (
            <p
              data-ocid="comment.submit_error_state"
              className="mt-4 flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              We couldn&apos;t post your comment. Please try again.
            </p>
          ) : null}

          {submitComment.isSuccess ? (
            <p
              data-ocid="comment.success_state"
              className="mt-4 flex items-center gap-2 text-sm text-success"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Thanks for joining in!
            </p>
          ) : null}

          <Button
            type="submit"
            data-ocid="comment.submit_button"
            disabled={submitComment.isPending}
            className="mt-5 w-full rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90 sm:w-auto"
          >
            {submitComment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            {submitComment.isPending ? "Posting…" : "Post comment"}
          </Button>
        </form>

        {/* Comment list */}
        <div className="mt-10">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Latest comments
          </h3>

          {commentsQuery.isLoading ? (
            <div
              data-ocid="comment.loading_state"
              className="mt-4 flex flex-col gap-3"
            >
              {Array.from({ length: 3 }, (_, i) => `comment-skeleton-${i}`).map(
                (id) => (
                  <div
                    key={id}
                    className="h-20 animate-pulse rounded-[var(--radius)] border border-border bg-muted"
                  />
                ),
              )}
            </div>
          ) : commentsQuery.isError ? (
            <div
              data-ocid="comment.list_error_state"
              className="mt-4 rounded-[var(--radius)] border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
            >
              We couldn&apos;t load the comments right now. Please refresh the
              page to try again.
            </div>
          ) : comments.length === 0 ? (
            <div
              data-ocid="comment.empty_state"
              className="mt-4 rounded-[var(--radius)] border border-dashed border-border bg-card p-8 text-center"
            >
              <MessageCircle
                className="mx-auto h-8 w-8 text-primary/60"
                aria-hidden="true"
              />
              <p className="mt-3 font-display text-lg font-semibold text-card-foreground">
                No comments yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Start the conversation — say hello!
              </p>
            </div>
          ) : (
            <ul data-ocid="comment.list" className="mt-4 flex flex-col gap-3">
              {comments.map((comment) => {
                const food = FOODS.find((f) => f.id === Number(comment.foodId));
                return (
                  <li
                    key={comment.id.toString()}
                    data-ocid={`comment.item.${comment.id}`}
                    className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-card-foreground">
                        {comment.authorName}
                      </span>
                      <time className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        {formatTimestamp(comment.createdAt)}
                      </time>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-card-foreground">
                      {comment.text}
                    </p>
                    {food ? (
                      <span className="mt-3 inline-block rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-secondary-foreground">
                        {food.emoji} {food.name}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
