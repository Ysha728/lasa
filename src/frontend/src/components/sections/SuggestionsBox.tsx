
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
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";

type SuggestionCategory =
  | "filipinoFood"
  | "internationalFood"
  | "topic"
  | "websiteImprovement";

type LocalSuggestion = {
  id: string;
  name: string;
  text: string;
  category: SuggestionCategory;
  createdAt: number;
};

const STORAGE_KEY = "lasa-suggestions";

const CATEGORY_OPTIONS: {
  value: SuggestionCategory;
  label: string;
}[] = [
  { value: "filipinoFood", label: "Filipino food" },
  { value: "internationalFood", label: "International food" },
  { value: "topic", label: "Topic" },
  { value: "websiteImprovement", label: "Website improvement" },
];

function loadSuggestions(): LocalSuggestion[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is LocalSuggestion =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.text === "string" &&
        typeof item.category === "string" &&
        CATEGORY_OPTIONS.some(
          (option) => option.value === item.category,
        ) &&
        typeof item.createdAt === "number",
    );
  } catch {
    return [];
  }
}

export function SuggestionsBox() {
  const [suggestions, setSuggestions] = useState<LocalSuggestion[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] =
    useState<SuggestionCategory>("filipinoFood");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuggestions(loadSuggestions());
  }, []);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setFormError(null);
    setSuccess(false);

    if (!text.trim()) {
      setFormError("Please tell us what you'd like to suggest.");
      return;
    }

    const newSuggestion: LocalSuggestion = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim(),
      text: text.trim(),
      category,
      createdAt: Date.now(),
    };

    const updated = [newSuggestion, ...suggestions];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSuggestions(updated);
      setName("");
      setText("");
      setCategory("filipinoFood");
      setSuccess(true);
    } catch {
      setFormError(
        "We couldn't save your suggestion. Please check your browser storage.",
      );
    }
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
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
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
              placeholder="Suggest a dish, topic, or website improvement…"
              rows={4}
              maxLength={500}
            />
          </div>

          {formError && (
            <p
              data-ocid="suggestion.error_state"
              className="mt-4 flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </p>
          )}

          {success && (
            <p
              data-ocid="suggestion.success_state"
              className="mt-4 flex items-center gap-2 text-sm text-success"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Salamat! Your suggestion has been saved.
            </p>
          )}

          <Button
            type="submit"
            data-ocid="suggestion.submit_button"
            className="mt-5 w-full rounded-full bg-primary text-primary-foreground transition-smooth hover:bg-primary/90 sm:w-auto"
          >
            <Send className="h-4 w-4" />
            Submit suggestion
          </Button>
        </form>

        <div className="mt-10">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Recent suggestions
          </h3>

          {suggestions.length === 0 ? (
            <div
              data-ocid="suggestion.empty_state"
              className="mt-4 rounded-[var(--radius)] border border-dashed border-border bg-card p-8 text-center"
            >
              <Lightbulb className="mx-auto h-8 w-8 text-primary/60" />
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
                    key={suggestion.id}
                    data-ocid="suggestion.item"
                    className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-secondary-foreground">
                        {label}
                      </span>
                      <time className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        {new Date(suggestion.createdAt).toLocaleString()}
                      </time>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-card-foreground">
                      {suggestion.text}
                    </p>

                    {suggestion.name && (
                      <p className="mt-2 font-display text-sm font-semibold text-muted-foreground">
                        — {suggestion.name}
                      </p>
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
