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

          const priority: Record<string, number> = {
            profile: 0, heading: 1, link: 2, image: 3, text: 4, social: 5, video: 6
          };

          tiles.sort((a, b) => {
            const pa = priority[a.type] ?? 99;
            const pb = priority[b.type] ?? 99;
            return pa - pb;
          });

          let x = 0;
          let y = 0;
          let maxYInRow = 0;

          const newTiles = tiles.map((tile) => {
            const isFixedWidth = tile.type === 'heading' || tile.type === 'profile';
            const w = isFixedWidth ? cols : Math.min(tile.layout.w, cols);
            const h = isFixedWidth ? (tile.type === 'profile' ? 2 : 1) : tile.layout.h;

            if (x + w > cols) {
              x = 0;
              y = maxYInRow;
            }

            const newTile = {
              ...tile,
              layout: { ...tile.layout, x, y, w, h }
            };

            x += w;
            maxYInRow = Math.max(maxYInRow, y + h);

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
