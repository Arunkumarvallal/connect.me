'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cloneDeep } from 'lodash';
import { Tile, TileSize, tileSizeToLayout, UserProfile, HeroAccent } from '@/types/profile';
import { mockProfile } from '@/lib/mock-data';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { debounce } from 'lodash';

interface ProfileStore {
  profile: UserProfile;
  view: 'desktop' | 'mobile';
  editingTile: Tile | null;
  history: UserProfile[];
  historyIndex: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  firestoreUnsubscribe: (() => void) | null;

  _recordHistory: (state: any) => { history: UserProfile[]; historyIndex: number };
  setProfile: (p: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateTile: (tile: Tile) => void;
  addTile: (tile: Tile) => void;
  removeTile: (id: string) => void;
  reorderTiles: (tiles: Tile[]) => void;
  setView: (v: 'desktop' | 'mobile') => void;
  setEditingTile: (t: Tile | null) => void;
  autoArrangeTiles: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  loadProfileFromFirestore: (uid: string) => Promise<void>;
  saveProfileToFirestore: () => Promise<void>;
  startFirestoreSync: (uid: string) => void;
  stopFirestoreSync: () => void;
}

const MAX_HISTORY = 50;

const debouncedSave = debounce(async (profile: UserProfile, uid: string) => {
  try {
    const profileData = {
      ...profile,
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', uid), profileData, { merge: true });
  } catch (error) {
    console.error('[Firestore] Auto-save failed:', error);
  }
}, 2000);

/**
 * v5 → v6 migration
 * Old theme: { font, background, heroStyle }
 * New theme: { font, background, heroAccent: HeroAccent }
 */
function heroStyleToAccent(heroStyle: string | undefined): HeroAccent {
  switch (heroStyle) {
    case 'banner':    return { kind: 'speaking', label: 'Speaking', emoji: '✦', color: 'bg-pink-500' };
    case 'minimal':   return { kind: 'building', label: 'Building', emoji: '✦', color: 'bg-sky-500' };
    case 'card':      return { kind: 'oss', label: 'Open source', emoji: '✦', color: 'bg-violet-500' };
    case 'magazine':  return { kind: 'open-to-work', label: 'Open to work', emoji: '✦', color: 'bg-amber-500' };
    case 'classic':
    default:          return { kind: 'available', label: 'Available for hire', emoji: '✦', color: 'bg-emerald-500' };
  }
}

interface LegacyTheme {
  font?: string;
  background?: string;
  heroStyle?: string;
}

function migrateV5ToV6(persisted: any): any {
  if (!persisted) return persisted;
  // zustand v5 wraps persisted state as { state, version }
  const inner = persisted.state ?? persisted;
  const profile = inner.profile;
  if (!profile) return persisted;
  const legacyTheme = profile.theme as LegacyTheme;
  if (legacyTheme && (legacyTheme as any).heroAccent) {
    return persisted; // already v6+
  }
  inner.profile = {
    ...profile,
    theme: {
      font: (legacyTheme?.font as any) ?? 'sans',
      background: (legacyTheme?.background as any) ?? 'white',
      heroAccent: heroStyleToAccent(legacyTheme?.heroStyle),
    },
  };
  if (persisted.state) persisted.state = inner;
  return persisted;
}

/**
 * v6 → v7 migration
 * - `customCols` moves from zustand state to `theme.maxCols` (persisted on profile)
 * - The dashboard editor and the public preview now share the same column count.
 */
function migrateV6ToV7(persisted: any): any {
  if (!persisted) return persisted;
  const inner = persisted.state ?? persisted;
  const profile = inner.profile;
  if (!profile) return persisted;
  const theme = profile.theme ?? {};
  if (typeof theme.maxCols === 'number') return persisted; // already v7+

  const cols = inner.customCols;
  if (typeof cols === 'number' && cols >= 1 && cols <= 4) {
    theme.maxCols = cols;
  } else {
    theme.maxCols = 4; // chennai-react default
  }
  inner.profile = { ...profile, theme };
  // drop customCols — its data is now in theme.maxCols
  delete inner.customCols;
  if (persisted.state) persisted.state = inner;
  return persisted;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: cloneDeep(mockProfile),
      view: 'desktop',
      editingTile: null,
      history: [] as UserProfile[],
      historyIndex: -1,
      isLoading: false,
      isSaving: false,
      error: null,
      firestoreUnsubscribe: null,

      _recordHistory: (state: any) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(cloneDeep(state.profile));
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      },

      setProfile: (p) => set({ profile: cloneDeep(p) }),

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

      autoArrangeTiles: () =>
        set((state) => {
          const tiles = [...state.profile.tiles];
          const cols = state.profile.theme.maxCols || 4;

          const profileTiles = tiles.filter(t => t.type === 'profile');
          const headingTiles = tiles.filter(t => t.type === 'heading');
          const regularTiles = tiles.filter(t => t.type !== 'profile' && t.type !== 'heading');

          const wideTiles = regularTiles.filter(t => t.layout.w >= Math.ceil(cols * 0.66));
          const mediumTiles = regularTiles.filter(t => t.layout.w >= 2 && t.layout.w < Math.ceil(cols * 0.66));
          const narrowTiles = regularTiles.filter(t => t.layout.w === 1);

          const sortByHeight = (a: Tile, b: Tile) => a.layout.h - b.layout.h;
          wideTiles.sort(sortByHeight);
          mediumTiles.sort(sortByHeight);
          narrowTiles.sort(sortByHeight);

          const sortedTiles: Tile[] = [];
          const maxLen = Math.max(wideTiles.length, mediumTiles.length, narrowTiles.length);
          for (let i = 0; i < maxLen; i++) {
            if (i < wideTiles.length) sortedTiles.push(wideTiles[i]);
            if (i < mediumTiles.length) sortedTiles.push(mediumTiles[i]);
            if (i < narrowTiles.length) sortedTiles.push(narrowTiles[i]);
          }

          const newTiles: Tile[] = [];
          const occupied: Array<{x: number, y: number, w: number, h: number}> = [];

          let currentY = 0;

          const findBestPosition = (w: number, h: number): {x: number, y: number} => {
            let bestY = Infinity;
            let bestX = 0;

            const yPositions = new Set<number>([0]);
            occupied.forEach(o => {
              yPositions.add(o.y);
              yPositions.add(o.y + o.h);
            });
            const sortedY = Array.from(yPositions).sort((a, b) => a - b);

            for (const tryY of sortedY) {
              if (tryY > bestY) break;
              for (let tryX = 0; tryX + w <= cols; tryX++) {
                const hasConflict = occupied.some(o =>
                  !(tryX + w <= o.x || tryX >= o.x + o.w || tryY + h <= o.y || tryY >= o.y + o.h)
                );
                if (hasConflict) continue;
                const isSupported = tryY === 0 || occupied.some(o =>
                  o.x < tryX + w && o.x + o.w > tryX && o.y + o.h === tryY
                );
                const score = tryY * 100 + (isSupported ? 0 : 50) + tryX;
                if (tryY < bestY || (tryY === bestY && tryX < bestX)) {
                  bestY = tryY;
                  bestX = tryX;
                }
                break;
              }
            }
            return bestY < Infinity ? { x: bestX, y: bestY } : { x: 0, y: currentY };
          };

          profileTiles.forEach(tile => {
            const w = cols;
            const h = Math.max(2, tile.layout.h);
            newTiles.push({ ...tile, layout: { ...tile.layout, x: 0, y: currentY, w, h } });
            occupied.push({ x: 0, y: currentY, w, h });
            currentY += h;
          });

          headingTiles.forEach(tile => {
            const w = cols;
            const h = 1;
            newTiles.push({ ...tile, layout: { ...tile.layout, x: 0, y: currentY, w, h } });
            occupied.push({ x: 0, y: currentY, w, h });
            currentY += h;
          });

          sortedTiles.forEach(tile => {
            const w = Math.min(tile.layout.w, cols);
            const h = tile.layout.h;
            const pos = findBestPosition(w, h);
            newTiles.push({ ...tile, layout: { ...tile.layout, x: pos.x, y: pos.y, w, h } });
            occupied.push({ x: pos.x, y: pos.y, w, h });
            currentY = Math.max(currentY, pos.y + h);
          });

          newTiles.sort((a, b) => {
            if (a.layout.y !== b.layout.y) return a.layout.y - b.layout.y;
            return a.layout.x - b.layout.x;
          });

          const finalOccupied: Array<{x: number, y: number, w: number, h: number}> = [];
          const compactedTiles: Tile[] = [];
          newTiles.forEach(tile => {
            const w = tile.layout.w;
            const h = tile.layout.h;
            let bestY = tile.layout.y;
            for (let tryY = 0; tryY < tile.layout.y; tryY++) {
              const hasConflict = finalOccupied.some(o =>
                !(tile.layout.x + w <= o.x || tile.layout.x >= o.x + o.w || tryY + h <= o.y || tryY >= o.y + o.h)
              );
              if (!hasConflict) bestY = tryY;
              else break;
            }
            compactedTiles.push({ ...tile, layout: { ...tile.layout, y: bestY } });
            finalOccupied.push({ x: tile.layout.x, y: bestY, w, h });
          });

          return {
            ...state._recordHistory(state),
            profile: { ...state.profile, tiles: compactedTiles },
          };
        }),

      undo: () =>
        set((state) => {
          if (state.historyIndex < 0) return state;
          const newIndex = state.historyIndex - 1;
          const profile = cloneDeep(state.history[newIndex] || state.profile);
          return { historyIndex: newIndex, profile, editingTile: null };
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          const newIndex = state.historyIndex + 1;
          const profile = cloneDeep(state.history[newIndex]);
          return { historyIndex: newIndex, profile, editingTile: null };
        }),

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      loadProfileFromFirestore: async (uid: string) => {
        set({ isLoading: true, error: null });
        try {
          const docRef = doc(db, 'users', uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            set({ profile: data, isLoading: false });
          } else {
            set({ profile: cloneDeep(mockProfile), isLoading: false });
          }
        } catch (error: any) {
          console.error('[Firestore] Load failed:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      saveProfileToFirestore: async () => {
        const state = get();
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        set({ isSaving: true, error: null });
        try {
          const profileData = { ...state.profile, updatedAt: serverTimestamp() };
          await setDoc(doc(db, 'users', uid), profileData, { merge: true });
          set({ isSaving: false });
        } catch (error: any) {
          console.error('[Firestore] Save failed:', error);
          set({ error: error.message, isSaving: false });
        }
      },

      startFirestoreSync: (uid: string) => {
        const state = get();
        if (state.firestoreUnsubscribe) state.firestoreUnsubscribe();
        const docRef = doc(db, 'users', uid);
        const unsubscribe = onSnapshot(
          docRef,
          (doc) => {
            if (doc.exists()) {
              const data = doc.data() as UserProfile;
              set({ profile: data });
            }
          },
          (error) => {
            console.error('[Firestore] Sync error:', error);
            set({ error: error.message });
          },
        );
        set({ firestoreUnsubscribe: unsubscribe });
      },

      stopFirestoreSync: () => {
        const state = get();
        if (state.firestoreUnsubscribe) {
          state.firestoreUnsubscribe();
          set({ firestoreUnsubscribe: null });
        }
      },
    }),
    {
      name: 'profile-store',
      version: 7,
      migrate: (persisted, version) => {
        if (version < 6) return migrateV5ToV6(persisted);
        if (version < 7) return migrateV6ToV7(persisted);
        return persisted as any;
      },
      partialize: (state) => ({
        profile: state.profile,
        view: state.view,
      }),
    },
  ),
);

// Patch mutating actions to auto-save to Firestore
useProfileStore.setState({
  updateProfile: (patch) => {
    const state = useProfileStore.getState();
    state._recordHistory(state);
    useProfileStore.setState({ profile: { ...state.profile, ...patch } });
    const uid = auth.currentUser?.uid;
    if (uid) debouncedSave(useProfileStore.getState().profile, uid);
  },
  updateTile: (tile) => {
    const state = useProfileStore.getState();
    state._recordHistory(state);
    useProfileStore.setState({
      profile: {
        ...state.profile,
        tiles: state.profile.tiles.map((t) => (t.id === tile.id ? { ...t, ...tile } : t)),
      },
      editingTile: null,
    });
    const uid = auth.currentUser?.uid;
    if (uid) debouncedSave(useProfileStore.getState().profile, uid);
  },
  addTile: (tile) => {
    const state = useProfileStore.getState();
    state._recordHistory(state);
    useProfileStore.setState({
      profile: { ...state.profile, tiles: [...state.profile.tiles, tile] },
    });
    const uid = auth.currentUser?.uid;
    if (uid) debouncedSave(useProfileStore.getState().profile, uid);
  },
  removeTile: (id) => {
    const state = useProfileStore.getState();
    state._recordHistory(state);
    useProfileStore.setState({
      profile: { ...state.profile, tiles: state.profile.tiles.filter((t) => t.id !== id) },
      editingTile: state.editingTile?.id === id ? null : state.editingTile,
    });
    const uid = auth.currentUser?.uid;
    if (uid) debouncedSave(useProfileStore.getState().profile, uid);
  },
});
