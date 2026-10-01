import { cn } from "@/lib/utils";
/**
 * Section — a registered anchor wrapper.
 *
 * Page tasks wrap their section bodies in this component so every section gets
 * the same id (for nav + scroll spy), scroll offset, and vertical rhythm.
 */
import type { ReactNode } from "react";

interface SectionProps {
  /** Must match an id in the shared SECTIONS registry. */
  id: string;
  children: ReactNode;
  /** Optional extra classes for background alternation. */
  className?: string;
  /** Optional accessible label for the section landmark. */
  label?: string;
}

export function Section({ id, children, className, label }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      data-ocid={`section.${id}`}
      className={cn("scroll-mt-20 py-16 md:py-24", className)}
    >
      {children}
    </section>
  );
}
