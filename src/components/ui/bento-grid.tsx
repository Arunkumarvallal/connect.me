"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  /** Maximum number of columns on xl+ (default 4 — matches chennai-react) */
  maxCols?: number;
  /** Override row height. Tailwind arbitrary value, e.g. '[10rem]' or 'min-content' */
  rowHeight?: string;
}

/**
 * BentoGrid — chennai-react reference CSS grid.
 *
 *   grid-cols-2 xl:grid-cols-4
 *   auto-rows-[9rem] sm:auto-rows-[10rem] lg:auto-rows-[15rem] xl:auto-rows-[13rem]
 *   gap-4
 *
 * On mobile/sm: 2 columns, 9-10rem rows.
 * On lg (≥1024px): 2 columns, 15rem rows (bigger cards).
 * On xl (≥1280px): 4 columns, 13rem rows (chennai-react's signature layout).
 *
 * Tile col-span must be authored against this grid (e.g. `xl:col-span-2`).
 */
export function BentoGrid({ children, className, maxCols = 4, rowHeight }: BentoGridProps) {
  const cols = Math.min(4, Math.max(1, maxCols));
  const colsBreakpoint =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-2"
        : cols === 3
          ? "grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 xl:grid-cols-4";
  const rowClass =
    rowHeight ?? "auto-rows-[9rem] sm:auto-rows-[10rem] lg:auto-rows-[15rem] xl:auto-rows-[13rem]";
  return (
    <div className={cn("grid w-full", colsBreakpoint, rowClass, "gap-4", className)}>
      {children}
    </div>
  );
}
