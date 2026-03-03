'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cloneDeep } from 'lodash';
import { Tile, UserProfile } from '@/types/profile';
import { mockProfile } from '@/lib/mock-data';

interface ProfileStore {
  profile: UserProfile;
  view: 'desktop' | 'mobile';
  editingTile: Tile | null;

  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateTile: (tile: Tile) => void;
  addTile: (tile: Tile) => void;
  removeTile: (id: string) => void;
  reorderTiles: (tiles: Tile[]) => void;
  setView: (v: 'desktop' | 'mobile') => void;
  setEditingTile: (t: Tile | null) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: cloneDeep(mockProfile),
      view: 'desktop',
      editingTile: null,

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
        set((state) => ({ profile: { ...state.profile, tiles } })),

      setView: (v) => set({ view: v }),

      setEditingTile: (t) => set({ editingTile: t }),
    }),
    {
      name: 'profile-store',
      version: 2,
      partialize: (state) => ({ profile: state.profile, view: state.view }),
    }
  )
);
