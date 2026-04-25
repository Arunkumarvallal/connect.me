'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cloneDeep } from 'lodash';
import { Tile, TileSize, tileSizeToLayout, UserProfile } from '@/types/profile';
import { mockProfile } from '@/lib/mock-data';

interface ProfileStore {
  profile: UserProfile;
  view: 'desktop' | 'mobile';
  editingTile: Tile | null;
  customCols: number | null;
  history: UserProfile[];
  historyIndex: number;

  _recordHistory: (state: any) => { history: UserProfile[]; historyIndex: number };
  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateTile: (tile: Tile) => void;
  addTile: (tile: Tile) => void;
  removeTile: (id: string) => void;
  reorderTiles: (tiles: Tile[]) => void;
  setView: (v: 'desktop' | 'mobile') => void;
  setEditingTile: (t: Tile | null) => void;
  setCustomCols: (cols: number | null) => void;
  autoArrangeTiles: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const MAX_HISTORY = 50;

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: cloneDeep(mockProfile),
      view: 'desktop',
      editingTile: null,
      customCols: null,
      history: [] as UserProfile[],
      historyIndex: -1,

      setProfile: (p) => set({ profile: cloneDeep(p) }),

      // Helper to record history before mutations
      _recordHistory: (state: any) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(cloneDeep(state.profile));
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      },

      updateProfile: (patch) =>
        set((state) => ({
          ...state._recordHistory(state),
          profile: { ...state.profile, ...patch },
        })),

      updateTile: (tile) =>
        set((state) => ({
          ...state._recordHistory(state),
          profile: {
            ...state.profile,
            tiles: state.profile.tiles.map((t) =>
              t.id === tile.id ? { ...t, ...tile } : t
            ),
          },
          editingTile: null,
        })),

      addTile: (tile) =>
        set((state) => ({
          ...state._recordHistory(state),
          profile: {
            ...state.profile,
            tiles: [...state.profile.tiles, tile],
          },
        })),

      removeTile: (id) =>
        set((state) => ({
          ...state._recordHistory(state),
          profile: {
            ...state.profile,
            tiles: state.profile.tiles.filter((t) => t.id !== id),
          },
          editingTile:
            state.editingTile?.id === id ? null : state.editingTile,
        })),

      reorderTiles: (tiles) =>
        set((state) => ({
          ...state._recordHistory(state),
          profile: { ...state.profile, tiles },
        })),

      setView: (v) => set({ view: v }),

      setEditingTile: (t) => set({ editingTile: t }),

      setCustomCols: (cols) => set({ customCols: cols }),

      autoArrangeTiles: () =>
        set((state) => {
          const tiles = [...state.profile.tiles];
          const cols = 3;

          // Separate fixed-width tiles (profile, heading) from flexible ones
          const fixedTiles = tiles.filter(t => t.type === 'profile' || t.type === 'heading');
          const flexibleTiles = tiles.filter(t => t.type !== 'profile' && t.type !== 'heading');

          // Sort flexible tiles by area (largest first) for better space utilization
          flexibleTiles.sort((a, b) => {
            const areaA = a.layout.w * a.layout.h;
            const areaB = b.layout.w * b.layout.h;
            return areaB - areaA; // Largest first
          });

          // Interleave: place fixed tiles first, then fill with flexible ones
          const sortedTiles = [...fixedTiles, ...flexibleTiles];

          let x = 0;
          let y = 0;
          let maxYInRow = 0;
          const occupied: Array<{x: number, y: number, w: number, h: number}> = [];

          const newTiles = sortedTiles.map((tile) => {
            const isFixedWidth = tile.type === 'heading' || tile.type === 'profile';
            const w = isFixedWidth ? cols : Math.min(tile.layout.w, cols);
            const h = isFixedWidth ? (tile.type === 'profile' ? 2 : 1) : tile.layout.h;

            // Try to find best position (greedy fill - try to place at lowest y, then leftmost x)
            let placed = false;
            let newX = x;
            let newY = y;

            // First try current position
            if (newX + w <= cols) {
              // Check if this position is already occupied
              const hasConflict = occupied.some(o =>
                !(newX + w <= o.x || newX >= o.x + o.w || newY + h <= o.y || newY >= o.y + o.h)
              );
              if (!hasConflict) {
                placed = true;
              }
            }

            // If conflict, find next available position
            if (!placed) {
              // Reset to find best position
              let bestY = Number.MAX_SAFE_INTEGER;
              let bestX = 0;

              // Try positions in order of increasing y, then x
              for (let tryY = 0; tryY < 100; tryY++) {
                for (let tryX = 0; tryX + w <= cols; tryX++) {
                  const hasConflict = occupied.some(o =>
                    !(tryX + w <= o.x || tryX >= o.x + o.w || tryY + h <= o.y || tryY >= o.y + o.h)
                  );
                  if (!hasConflict && tryY < bestY) {
                    bestY = tryY;
                    bestX = tryX;
                    placed = true;
                  }
                }
                if (placed) break;
              }

              if (placed) {
                newX = bestX;
                newY = bestY;
              }
            }

            // If still not placed, use simple algorithm
            if (!placed) {
              newX = 0;
              newY = maxYInRow;
            }

            // Record this tile's position
            occupied.push({ x: newX, y: newY, w, h });

            const newTile = {
              ...tile,
              layout: { ...tile.layout, x: newX, y: newY, w, h }
            };

            // Update for next tile
            x = newX + w;
            if (x >= cols) {
              x = 0;
              y = maxYInRow;
            }
            maxYInRow = Math.max(maxYInRow, newY + h);

            return newTile;
          });

          return {
            ...state._recordHistory(state),
            profile: {
              ...state.profile,
              tiles: newTiles,
            },
          };
        }),

      undo: () =>
        set((state) => {
          if (state.historyIndex < 0) return state;
          const newIndex = state.historyIndex - 1;
          const profile = cloneDeep(state.history[newIndex] || state.profile);
          return {
            historyIndex: newIndex,
            profile,
            editingTile: null,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          const newIndex = state.historyIndex + 1;
          const profile = cloneDeep(state.history[newIndex]);
          return {
            historyIndex: newIndex,
            profile,
            editingTile: null,
          };
        }),

      canUndo: () => {
        // This needs to be a function that returns a boolean based on state
        return false; // Will be overridden below
      },

      canRedo: () => {
        return false; // Will be overridden below
      },
    }),
    {
      name: 'profile-store',
      version: 5,
      partialize: (state) => ({
        profile: state.profile,
        view: state.view,
        customCols: state.customCols,
      }),
    }
  )
);

// Add canUndo/canRedo as derived state (not persisted)
const origCreate = useProfileStore.getState;
useProfileStore.getState = function() {
  const state = origCreate();
  return {
    ...state,
    canUndo: () => state.historyIndex > 0,
    canRedo: () => state.historyIndex < state.history.length - 1,
  };
};
