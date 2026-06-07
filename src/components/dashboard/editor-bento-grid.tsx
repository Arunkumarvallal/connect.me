"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, GripVertical } from "lucide-react";
import { Tile, TileSize, tileSizeToLayout, TILE_PICKER_SIZES } from "@/types/profile";
import { useProfileStore } from "@/store/profile-store";
import { BentoTile } from "@/components/profile/bento-tile";
import { BentoGrid } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

const ICON_CELL_PX = 8;

interface EditorBentoGridProps {
  maxCols: number;
  tiles?: Tile[];
}

/**
 * EditorBentoGrid — dashboard editor grid that mirrors the public preview's
 * CSS bento layout 1:1, with editor chrome on top:
 *
 *   - drag handle (grip icon) to reorder tiles in the array
 *   - delete button (top-right)
 *   - hover dock with size picker + edit button (bottom)
 *
 * Layout is identical to `SectionsRenderer` so changes are WYSIWYG.
 * No react-grid-layout — same CSS bento grid as the preview.
 */
export function EditorBentoGrid({ maxCols, tiles: tilesProp }: EditorBentoGridProps) {
  const { profile, reorderTiles, removeTile, updateTile, setEditingTile } = useProfileStore();
  const tiles = tilesProp ?? profile.tiles;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function handleSizeChange(tile: Tile, size: TileSize) {
    const { w, h } = tileSizeToLayout[size];
    updateTile({ ...tile, size, layout: { ...tile.layout, w, h } });
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    // dataTransfer must have data to trigger drag on some browsers
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragOverId) setDragOverId(id);
  }

  function handleDragLeave() {
    setDragOverId(null);
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }
    const fromIdx = tiles.findIndex((t) => t.id === dragId);
    const toIdx = tiles.findIndex((t) => t.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const next = [...tiles];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    reorderTiles(next);
    setDragId(null);
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDragId(null);
    setDragOverId(null);
  }

  return (
    <BentoGrid maxCols={maxCols}>
      {tiles.map((tile) => {
        const isHovered = hoveredId === tile.id;
        const isDragOver = dragOverId === tile.id && dragId !== tile.id;
        const isDragging = dragId === tile.id;
        const canEdit = tile.type !== 'profile' && tile.type !== 'heading';
        return (
          <div
            key={tile.id}
            draggable={canEdit}
            onDragStart={(e) => canEdit && handleDragStart(e, tile.id)}
            onDragOver={(e) => canEdit && handleDragOver(e, tile.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => canEdit && handleDrop(e, tile.id)}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => setHoveredId(tile.id)}
            onMouseLeave={() => setHoveredId((id) => (id === tile.id ? null : id))}
            className={cn(
              "relative group transition-all duration-150",
              canEdit && "cursor-grab active:cursor-grabbing",
              isDragging && "opacity-40 scale-[0.98]",
              isDragOver && "ring-2 ring-violet-500 ring-offset-2 ring-offset-background rounded-2xl",
            )}
            style={{ zIndex: isHovered || isDragOver ? 10 : 'auto' }}
          >
            {/* Drag handle (top-left) */}
            {canEdit && (
              <div
                className={cn(
                  "absolute top-2 left-2 z-30 w-7 h-7 rounded-full bg-zinc-900/85 dark:bg-zinc-50/90 text-white dark:text-zinc-900 flex items-center justify-center shadow-lg transition-opacity",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
                title="Drag to reorder"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Delete button (top-right) */}
            {canEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTile(tile.id);
                }}
                title="Delete tile"
                className={cn(
                  "absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-opacity",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Tile content — uses the same BentoTile renderer as the public preview */}
            <div className={cn("w-full h-full", tile.type === 'heading' ? '' : 'rounded-2xl overflow-hidden')}>
              <BentoTile tile={tile} />
            </div>

            {/* Hover dock (bottom): size picker + edit */}
            {canEdit && (
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    key="dock"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2 py-1.5 rounded-full bg-zinc-900/95 dark:bg-zinc-50/95 border border-zinc-700 dark:border-zinc-200 shadow-2xl"
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.9 }}
                    transition={{ duration: 0.12 }}
                    onMouseEnter={() => setHoveredId(tile.id)}
                  >
                    {TILE_PICKER_SIZES.map((size) => {
                      const { w, h } = tileSizeToLayout[size];
                      const iconW = Math.round(w * ICON_CELL_PX);
                      const iconH = Math.round(h * ICON_CELL_PX);
                      const active = tile.size === size;
                      return (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSizeChange(tile, size);
                          }}
                          title={size}
                          className={cn(
                            "flex items-center justify-center rounded p-0.5 transition-colors",
                            active
                              ? "text-white dark:text-zinc-900"
                              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-100 dark:hover:text-zinc-700",
                          )}
                        >
                          <svg
                            width={iconW + 4}
                            height={iconH + 4}
                            viewBox={`0 0 ${iconW + 4} ${iconH + 4}`}
                            fill="none"
                          >
                            <rect
                              x="1" y="1"
                              width={iconW + 2} height={iconH + 2}
                              rx="2" ry="2"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              fill={active ? 'currentColor' : 'none'}
                              fillOpacity={active ? 0.3 : 0}
                            />
                          </svg>
                        </button>
                      );
                    })}
                    <div className="w-px h-4 bg-zinc-700 dark:bg-zinc-300 mx-0.5" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTile(tile);
                      }}
                      title="Edit tile"
                      className="flex items-center justify-center w-6 h-6 rounded-full text-zinc-400 dark:text-zinc-500 hover:text-blue-400 dark:hover:text-blue-500 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </BentoGrid>
  );
}
