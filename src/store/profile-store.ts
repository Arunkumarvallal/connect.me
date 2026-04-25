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
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: cloneDeep(mockProfile),
      view: 'desktop',
      editingTile: null,
      customCols: null,

      setProfile: (p) => set({ profile: cloneDeep(p) }),

      updateProfile: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),

      updateTile: (tile) =>
        set((state) => ({
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
          profile: {
            ...state.profile,
            tiles: [...state.profile.tiles, tile],
          },
        })),

      removeTile: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            tiles: state.profile.tiles.filter((t) => t.id !== id),
          },
          editingTile:
            state.editingTile?.id === id ? null : state.editingTile,
        })),

      reorderTiles: (tiles) =>
        set((state) => ({
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
            heading: 0, link: 1, image: 2, text: 3, social: 4, video: 5
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
            const isHeading = tile.type === 'heading';
            const w = isHeading ? cols : Math.min(tile.layout.w, cols);
            const h = isHeading ? 1 : tile.layout.h;

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
            profile: {
              ...state.profile,
              tiles: newTiles,
            },
          };
        }),
    }),
    {
      name: 'profile-store',
      version: 4,
      partialize: (state) => ({
        profile: state.profile,
        view: state.view,
        customCols: state.customCols
      }),
    }
  )
);
