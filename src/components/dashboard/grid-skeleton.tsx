'use client';

import { GRID_CONFIG } from '@/types/profile';

const { gap, padding, cellPx } = GRID_CONFIG;

export function GridSkeleton() {
  // Create placeholder skeletons for typical layout
  const skeletons = [
    { w: 3, h: 2 },  // hero/profile - full width
    { w: 2, h: 2 },  // large tile
    { w: 2, h: 2 },  // large tile
    { w: 1, h: 1 },  // small tile
    { w: 1, h: 1 },  // small tile
    { w: 2, h: 1 },  // wide tile
    { w: 2, h: 1 },  // wide tile
  ];

  const colWidth = cellPx;
  const rowHeight = cellPx;

  return (
    <div
      className="w-full"
      style={{
        padding: `${padding}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${colWidth}px, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {skeletons.map((s, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
          style={{
            gridColumn: s.w > 1 ? `span ${Math.min(s.w, 3)}` : undefined,
            height: s.h * (rowHeight + gap) - gap,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  );
}
