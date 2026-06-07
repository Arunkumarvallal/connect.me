"use client";

import { ReactNode } from "react";
import { BentoGrid } from "./bento-grid";
import { cn } from "@/lib/utils";

interface SectionGridProps {
  /** Optional section heading shown above the grid */
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Max cols for this section (default 3) */
  maxCols?: number;
  /** Whether to show the section header */
  showHeader?: boolean;
}

/**
 * SectionGrid — Figma-reference section wrapper.
 *
 *   ┌────────────────────────────────────┐
 *   │ [Dark pill: Section title]         │  ← matches "Section Title" component
 *   │ Optional description text          │
 *   ├────────────────────────────────────┤
 *   │  bento grid of children (3 cols)   │
 *   └────────────────────────────────────┘
 */
export function SectionGrid({
  title,
  description,
  children,
  className,
  maxCols = 3,
  showHeader = true,
}: SectionGridProps) {
  return (
    <section className={cn("w-full", className)}>
      {showHeader && title && (
        <div className="mb-4 px-1 flex flex-col items-start gap-2">
          <h3 className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
            <span className="text-violet-400 dark:text-violet-600">✦</span>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      <BentoGrid maxCols={maxCols}>{children}</BentoGrid>
    </section>
  );
}
