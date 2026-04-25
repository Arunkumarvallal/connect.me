'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import GridLayout from 'react-grid-layout/legacy';
import { Tile, GRID_CONFIG } from '@/types/profile';
import { useProfileStore } from '@/store/profile-store';
import { TileCard } from './tile-card';

const RGL = GridLayout as React.ComponentType<any>;

type RGLLayoutItem = {
  i: string; x: number; y: number; w: number; h: number;
  minW?: number; minH?: number; maxW?: number; maxH?: number;
  isDraggable?: boolean; isResizable?: boolean;
};

interface TileGridProps {
  mobileView?: boolean;
  readOnly?: boolean;
  tiles?: Tile[];
}

export function TileGrid({ mobileView = false, readOnly = false, tiles: tilesProp }: TileGridProps) {
  const { profile, reorderTiles, customCols } = useProfileStore();
  const tiles = tilesProp ?? profile.tiles;
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const updateWidth = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      // Use getBoundingClientRect for more accurate width including padding
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      const w = rect.width - paddingLeft - paddingRight;
      setWidth(Math.floor(Math.max(w, 300))); // minimum 300px
    }
  }, []);

  useEffect(() => {
    updateWidth();
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => updateWidth());
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateWidth]);

  const { gap, padding, cellPx, maxCols, minCols, maxColsMobile } = GRID_CONFIG;

  const cols = mobileView ? maxColsMobile : (customCols ?? Math.max(minCols, Math.min(maxCols, Math.floor((width - 2 * padding + gap) / (cellPx + gap)))));

  // if (typeof window !== 'undefined') {
  //   console.log('Grid calc:', { width, cols, customCols, cellPx, maxCols });
  // }

   const marginSize = gap;
  const colWidth = width > 0 ? (width - 2 * padding - (cols -1) * gap) / cols : cellPx;
  const rowHeight = Math.max(80, Math.round(colWidth));

  const HEADING_PX = 52;
  const headingH = (HEADING_PX + marginSize) / (rowHeight + marginSize);

  const layout: RGLLayoutItem[] = tiles.map((tile) => {
    const isHeading = tile.type === 'heading';
    const clampedW = isHeading ? cols : Math.min(tile.layout.w, cols);
    const clampedX = isHeading ? 0 : Math.min(tile.layout.x, cols - clampedW);
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
      isDraggable: !readOnly,
      isResizable: !readOnly && !isHeading,
    };
  });

  const handleLayoutChange = useCallback(
    (newLayout: RGLLayoutItem[]) => {
      if (readOnly) return;
      const updatedTiles: Tile[] = tiles.map((tile) => {
        const item = (newLayout as any[]).find((l: { i: string }) => l.i === tile.id);
        if (!item) return tile;
        if (tile.type === 'heading') {
          return { ...tile, layout: { ...tile.layout, y: Math.round(item.y) } };
        }
        return { ...tile, layout: { x: item.x, y: item.y, w: item.w, h: item.h } };
      });
      reorderTiles(updatedTiles);
    },
    [tiles, reorderTiles, readOnly]
  );

  // Debug: log layout before rendering
  // if (typeof window !== 'undefined' && width > 200 && layout.length > 0) {
  //   const first = layout[0];
  //   console.log('RGL props:', { width, cols, layoutCount: layout.length, firstW: first.w, firstH: first.h });
  // }

  return (
    <div ref={containerRef} className="w-full h-full">
      {width > 200 ? (
        <RGL
          key={`grid-${width}-${cols}`}
          className="layout w-full"
          layout={layout}
          cols={cols}
          rowHeight={rowHeight}
          width={width}
          margin={[marginSize, marginSize]}
          containerPadding={[padding, padding]}
          onLayoutChange={handleLayoutChange}
          isDraggable={!readOnly}
          isResizable={!readOnly}
          resizeHandles={['se']}
          style={{ width: `${width}px` }}
        >
          {tiles.map((tile) => (
            <div key={tile.id} className={tile.type === 'heading' ? '' : 'rounded-2xl'}>
              <TileCard tile={tile} readOnly={readOnly} />
            </div>
          ))}
        </RGL>
      ) : (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading grid...
        </div>
      )}
    </div>
  );
}
