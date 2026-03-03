'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import GridLayout from 'react-grid-layout';
import { Tile, GRID_CONFIG } from '@/types/profile';
import { useProfileStore } from '@/store/profile-store';
import { TileCard } from './tile-card';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RGL = GridLayout as React.ComponentType<any>;

type RGLLayoutItem = { i: string; x: number; y: number; w: number; h: number; minW?: number; minH?: number; maxW?: number; maxH?: number; isDraggable?: boolean; isResizable?: boolean; };

interface TileGridProps {
  mobileView: boolean;
}

export function TileGrid({ mobileView }: TileGridProps) {
  const { profile, reorderTiles } = useProfileStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const { gap, padding, cellPx, maxCols, minCols, maxColsMobile } = GRID_CONFIG;

  // Compute how many columns fit so each cell is at least cellPx wide.
  // Clamped between minCols (always ≥2) and maxCols (≤4 on desktop).
  // This is purely reactive to container width — fully responsive.
  const fitCols  = width > 0
    ? Math.max(minCols, Math.min(maxCols, Math.floor((width - 2 * padding + gap) / (cellPx + gap))))
    : maxCols;
  const cols       = mobileView ? maxColsMobile : fitCols;
  const marginSize = gap;

  // rowHeight = colWidth → every 1×1 tile is a perfect square.
  const colWidth  = width > 0
    ? (width - 2 * padding - (cols - 1) * gap) / cols
    : cellPx;
  const rowHeight = Math.round(colWidth);

  // Heading pixel height is fixed; compute the fractional h that RGL needs:
  // pixelH = h * rowHeight + (h - 1) * marginSize  →  h = (pixelH + marginSize) / (rowHeight + marginSize)
  const HEADING_PX = 52;
  const headingH = (HEADING_PX + marginSize) / (rowHeight + marginSize);

  const layout: RGLLayoutItem[] = profile.tiles.map((tile) => {
    const isHeading = tile.type === 'heading';
    // Always clamp w to current cols — makes layout responsive at ANY width,
    // not just when the mobileView toggle is on.
    const clampedW = isHeading ? cols : Math.min(tile.layout.w, cols);
    const clampedX = isHeading ? 0    : Math.min(tile.layout.x, cols - clampedW);
    return {
      i: tile.id,
      x: clampedX,
      y: tile.layout.y,
      w: clampedW,
      h: isHeading ? headingH : tile.layout.h,
      minW: isHeading ? cols : 1,
      maxW: isHeading ? cols : cols,
      minH: isHeading ? headingH : 1,
      maxH: isHeading ? headingH : undefined,
      isDraggable: true,
      isResizable: !isHeading,
    };
  });

  const handleLayoutChange = useCallback(
    (newLayout: RGLLayoutItem[]) => {
      const updatedTiles: Tile[] = profile.tiles.map((tile) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = (newLayout as any[]).find((l: { i: string }) => l.i === tile.id);
        if (!item) return tile;
        // Headings: preserve original h (1), only track dragged y position (round to nearest grid row)
        if (tile.type === 'heading') {
          return { ...tile, layout: { ...tile.layout, y: Math.round(item.y) } };
        }
        return {
          ...tile,
          layout: { x: item.x, y: item.y, w: item.w, h: item.h },
        };
      });
      reorderTiles(updatedTiles);
    },
    [profile.tiles, reorderTiles]
  );

  return (
    <div className="w-full" ref={containerRef}>
      <RGL
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        width={width}
        margin={[marginSize, marginSize]}
        containerPadding={[padding, padding]}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        resizeHandles={['se']}
      >
        {profile.tiles.map((tile) => (
          <div key={tile.id} className={tile.type === 'heading' ? '' : 'rounded-2xl'}>
            <TileCard tile={tile} />
          </div>
        ))}
      </RGL>
    </div>
  );
}
