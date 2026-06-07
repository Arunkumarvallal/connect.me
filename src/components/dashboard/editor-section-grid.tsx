"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EditorSectionGridProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
}

/**
 * EditorSectionGrid — section wrapper used in the dashboard editor.
 *
 * Mirrors `SectionGrid` (used by the public preview) so the build and the
 * preview render the same section header + grid shell. The only difference
 * is that the children are expected to be tiles already wrapped in the
 * editor chrome (drag handle, delete, dock) — i.e. `<EditorBentoGrid>`
 * renders them. The preview's `SectionGrid` uses plain `BentoGrid`.
 */
export function EditorSectionGrid({
  title,
  description,
  children,
  className,
  showHeader = true,
}: EditorSectionGridProps) {
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
      {children}
    </section>
  );
}
