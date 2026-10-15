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
import { AlertCircle, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";

type CommentItem = {
  id: string;
  foodId: number;
  authorName: string;
  text: string;
  createdAt: number;
};

const STORAGE_KEY = "lasa-comments";

function loadComments(): CommentItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CommentItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.foodId === "number" &&
        typeof item.authorName === "string" &&
        typeof item.text === "string" &&
        typeof item.createdAt === "number",
    );
  } catch {
    return [];
  }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export function Comments() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [foodId, setFoodId] = useState<number>(FOODS[0]?.id ?? 1);
  const [authorName, setAuthorName] = useState("");
  const [text, setText] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setComments(loadComments());
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSuccess(false);

    if (!authorName.trim()) {
      setFormError("Please add your name before posting.");
      return;
    }

    if (!text.trim()) {
      setFormError("Please write a comment or reaction.");
      return;
    }

    const newComment: CommentItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      foodId,
      authorName: authorName.trim(),
      text: text.trim(),
      createdAt: Date.now(),
    };

    const updated = [newComment, ...comments];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setComments(updated);
      setAuthorName("");
      setText("");
      setSuccess(true);
    } catch {
      setFormError(
        "We couldn't save your comment. Please check your browser storage.",
      );
    }
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

          {formError && (
            <p
              data-ocid="comment.error_state"
              className="mt-4 flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {formError}
            </p>
          )}

          {success && (
            <p
              data-ocid="comment.success_state"
              className="mt-4 flex items-center gap-2 text-sm text-success"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              Thanks for joining in!
            </p>
          )}

          <Button
            type="submit"
            data-ocid="comment.submit_button"
            className="mt-5 w-full rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90 sm:w-auto"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Post comment
          </Button>
        </form>

        <div className="mt-10">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Latest comments
          </h3>

          {comments.length === 0 ? (
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
                const food = FOODS.find((f) => f.id === comment.foodId);

                return (
                  <li
                    key={comment.id}
                    data-ocid="comment.item"
                    className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-card-foreground">
                        {comment.authorName}
                      </span>
                      <time className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </time>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-card-foreground">
                      {comment.text}
                    </p>
                    {food && (
                      <span className="mt-3 inline-block rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-secondary-foreground">
                        {food.emoji} {food.name}
                      </span>
                    )}
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

