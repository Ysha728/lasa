/**
 * Faq — an accessible, expandable question-and-answer list.
 *
 * The questions and answers live in `@/data/faq` so they can be edited without
 * touching this component. We use the shadcn Accordion (built on Radix), which
 * already handles keyboard support: Tab moves between questions, Enter or Space
 * expands the focused one, and the arrow keys move within the list.
 */
import { Section } from "@/components/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/faq";
import { HelpCircle } from "lucide-react";

export function Faq() {
  return (
    <Section id="faq" label="Frequently Asked Questions">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Heading block */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Good to know
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Everything you might want to know about LASA. Tap a question to see
            the answer.
          </p>
        </div>

        {/* The accordion itself. `type="single"` keeps one answer open at a
            time, and `collapsible` lets visitors close the open one again. */}
        <Accordion
          type="single"
          collapsible
          className="mt-10 rounded-[var(--radius)] border border-border bg-card px-5 shadow-subtle sm:px-7"
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              data-ocid={`faq.item.${index + 1}`}
            >
              <AccordionTrigger
                data-ocid={`faq.toggle.${index + 1}`}
                className="py-5 font-display text-lg font-semibold text-foreground hover:no-underline"
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent
                data-ocid={`faq.answer.${index + 1}`}
                className="text-base leading-relaxed text-muted-foreground"
              >
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
