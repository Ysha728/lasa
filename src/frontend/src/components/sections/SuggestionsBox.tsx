/**
 * SuggestionsBox — the "Suggest a Food" form.
 *
 * Visitors can suggest a Filipino food, an international food, a topic, or a
 * website improvement. Name is optional; the suggestion text and category are
 * required. On success we show a clear confirmation that the suggestion was
 * received, and the latest suggestions are listed below.
 *
 * Backend wiring: `submitSuggestion` writes and `listSuggestions` reads.
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
import { formatTimestamp } from "@/lib/backend";
// SuggestionCategory is a Motoko variant exported as a runtime enum value.
import { SuggestionCategory } from "@/types/lasa";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Send,
} from "lucide-react";
import { useState } from "react";

/** Human-readable labels for each suggestion category. */
const CATEGORY_OPTIONS: { value: SuggestionCategory; label: string }[] = [
  { value: SuggestionCategory.filipinoFood, label: "Filipino food" },
  { value: SuggestionCategory.internationalFood, label: "International food" },
  { value: SuggestionCategory.topic, label: "Topic" },
  {
    value: SuggestionCategory.websiteImprovement,
    label: "Website improvement",
  },
];

/** Read every submitted suggestion, newest first. */
function useSuggestions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSuggestions();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Submit a new suggestion and refresh the list on success. */
function useSubmitSuggestion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      text: string;
      category: SuggestionCategory;
    }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitSuggestion({
        // `name` is an optional Motoko value: omit the key when empty.
        name: input.name.trim().length > 0 ? input.name.trim() : undefined,
        text: input.text.trim(),
        category: input.category,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}

export function SuggestionsBox() {
  const suggestionsQuery = useSuggestions();
  const submitSuggestion = useSubmitSuggestion();

  // Form draft state — owned locally, never derived from query data.
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<SuggestionCategory>(
    SuggestionCategory.filipinoFood,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const suggestions = suggestionsQuery.data ?? [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (text.trim().length === 0) {
      setFormError("Please tell us what you'd like to suggest.");
      return;
    }

    // Capture the draft, clear it immediately, restore only if the save fails.
    const draft = { name, text, category };
    setName("");
    setText("");

    submitSuggestion.mutate(draft, {
      onError: () => {
        setName((current) => (current === "" ? draft.name : current));
        setText((current) => (current === "" ? draft.text : current));
      },
    });
  };

  return (
    <Section
      id="suggestions"
      label="Suggestions"
      className="bg-gradient-subtle"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Your ideas
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Suggest a Food
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Know a dish we should feature, or have an idea to make LASA better?
            We&apos;d love to hear it.
          </p>
        </header>

        {/* Suggestion form */}
        <form
          onSubmit={handleSubmit}
          data-ocid="suggestion.form"
          className="mt-10 rounded-[var(--radius)] border border-border bg-card p-6 shadow-subtle sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="suggestion-name">
                Your name{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="suggestion-name"
                data-ocid="suggestion.name_input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Ana R."
                maxLength={60}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="suggestion-category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(value as SuggestionCategory)
                }
              >
                <SelectTrigger
                  id="suggestion-category"
                  data-ocid="suggestion.category_select"
                  className="w-full rounded-md"
                >
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Label htmlFor="suggestion-text">Your suggestion</Label>
            <Textarea
              id="suggestion-text"
              data-ocid="suggestion.textarea"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Tell us the dish, topic, or improvement you have in mind…"
              rows={4}
              maxLength={500}
            />
          </div>

          {formError ? (
            <p
              data-ocid="suggestion.error_state"
              className="mt-4 flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {formError}
            </p>
          ) : null}

          {submitSuggestion.isError ? (
            <p
              data-ocid="suggestion.submit_error_state"
              className="mt-4 flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              We couldn&apos;t send your suggestion. Please try again.
            </p>
          ) : null}

          {submitSuggestion.isSuccess ? (
            <p
              data-ocid="suggestion.success_state"
              className="mt-4 flex items-center gap-2 text-sm text-success"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Salamat! Your suggestion was received.
            </p>
          ) : null}

          <Button
            type="submit"
            data-ocid="suggestion.submit_button"
            disabled={submitSuggestion.isPending}
            className="mt-5 w-full rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90 sm:w-auto"
          >
            {submitSuggestion.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
            {submitSuggestion.isPending ? "Sending…" : "Submit suggestion"}
          </Button>
        </form>

        {/* Recent suggestions */}
        <div className="mt-10">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Recent suggestions
          </h3>

          {suggestionsQuery.isLoading ? (
            <div
              data-ocid="suggestion.loading_state"
              className="mt-4 flex flex-col gap-3"
            >
              {Array.from(
                { length: 3 },
                (_, i) => `suggestion-skeleton-${i}`,
              ).map((id) => (
                <div
                  key={id}
                  className="h-20 animate-pulse rounded-[var(--radius)] border border-border bg-muted"
                />
              ))}
            </div>
          ) : suggestionsQuery.isError ? (
            <div
              data-ocid="suggestion.list_error_state"
              className="mt-4 rounded-[var(--radius)] border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
            >
              We couldn&apos;t load the suggestions right now. Please refresh
              the page to try again.
            </div>
          ) : suggestions.length === 0 ? (
            <div
              data-ocid="suggestion.empty_state"
              className="mt-4 rounded-[var(--radius)] border border-dashed border-border bg-card p-8 text-center"
            >
              <Lightbulb
                className="mx-auto h-8 w-8 text-primary/60"
                aria-hidden="true"
              />
              <p className="mt-3 font-display text-lg font-semibold text-card-foreground">
                No suggestions yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to share an idea!
              </p>
            </div>
          ) : (
            <ul
              data-ocid="suggestion.list"
              className="mt-4 flex flex-col gap-3"
            >
              {suggestions.map((suggestion) => {
                const label =
                  CATEGORY_OPTIONS.find(
                    (option) => option.value === suggestion.category,
                  )?.label ?? "Suggestion";
                return (
                  <li
                    key={suggestion.id.toString()}
                    data-ocid={`suggestion.item.${suggestion.id}`}
                    className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-secondary-foreground">
                        {label}
                      </span>
                      <time className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        {formatTimestamp(suggestion.createdAt)}
                      </time>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-card-foreground">
                      {suggestion.text}
                    </p>
                    {suggestion.name ? (
                      <p className="mt-2 font-display text-sm font-semibold text-muted-foreground">
                        — {suggestion.name}
                      </p>
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
