'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Pencil } from 'lucide-react';
import { Tile, TileSize, tileSizeToLayout, TILE_PICKER_SIZES } from '@/types/profile';
import { useProfileStore } from '@/store/profile-store';
import { TileRenderer } from '@/components/profile/tile-renderer';

interface TileCardProps {
  tile: Tile;
  readOnly?: boolean;
}

/**
 * Pixels per grid unit used for the size-picker SVG icons.
 * Changing this scales ALL icons uniformly — no per-tile hardcoding.
 */
const ICON_CELL_PX = 8;

export function TileCard({ tile, readOnly = false }: TileCardProps) {
  const { removeTile, updateTile, setEditingTile } = useProfileStore();
  const [hovered, setHovered] = useState(false);

  function handleSizeChange(size: TileSize) {
    const { w, h } = tileSizeToLayout[size];
    updateTile({ ...tile, size, layout: { ...tile.layout, w, h } });
  }

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={readOnly ? undefined : () => setHovered(true)}
      onMouseLeave={readOnly ? undefined : () => setHovered(false)}
      style={{ zIndex: hovered ? 10 : 'auto' }}
    >
      {/* Tile content — headings are edge-to-edge, others get rounded card */}
      <div className={`w-full h-full ${tile.type === 'heading' ? '' : 'rounded-2xl overflow-hidden'}`}>
        <TileRenderer tile={tile} isDashboard={!readOnly} />
      </div>

      {/* Per-tile mini floating dock — edit mode only */}
      {!readOnly && (<AnimatePresence>
        {hovered && (
          <motion.div
            key="mini-dock"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-zinc-900 dark:bg-zinc-50 border border-zinc-700 dark:border-zinc-200 shadow-2xl"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            onMouseEnter={() => setHovered(true)}
          >
            {/* Size options — visual squares — hidden for heading and profile tiles */}
            {tile.type !== 'heading' && tile.type !== 'profile' && (
              <>
                {TILE_PICKER_SIZES.map((size) => {
                  const { w, h } = tileSizeToLayout[size];
                  const iconW = Math.round(w * ICON_CELL_PX);
                  const iconH = Math.round(h * ICON_CELL_PX);
                  const active = tile.size === size;
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      title={size}
                      className={`flex items-center justify-center rounded p-0.5 transition-colors ${
                        active
                          ? 'text-white dark:text-zinc-900'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-600'
                      }`}
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
              </>
            )}

        {/* Edit - hidden for profile tiles (inline editing) */}
        {tile.type !== 'profile' && (
          <>
            <button
              onClick={() => setEditingTile(tile)}
              title="Edit tile"
              className="flex items-center justify-center w-6 h-6 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-blue-400 dark:hover:text-blue-500 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-zinc-700 dark:bg-zinc-300 mx-0.5" />
          </>
        )}

        {/* Delete - hidden for profile tiles */}
        {tile.type !== 'profile' && (
          <button
            onClick={() => removeTile(tile.id)}
            title="Delete tile"
            className="flex items-center justify-center w-6 h-6 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-red-400 dark:hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
          </motion.div>
        )}
      </AnimatePresence>)}
    </div>
  );
}
