'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cloneDeep } from 'lodash';
import { Tile, TileSize, tileSizeToLayout, UserProfile } from '@/types/profile';
import { mockProfile } from '@/lib/mock-data';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { debounce } from 'lodash';

interface ProfileStore {
  profile: UserProfile;
  view: 'desktop' | 'mobile';
  editingTile: Tile | null;
  customCols: number | null;
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
  setCustomCols: (cols: number | null) => void;
  autoArrangeTiles: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Firestore sync
  loadProfileFromFirestore: (uid: string) => Promise<void>;
  saveProfileToFirestore: () => Promise<void>;
  startFirestoreSync: (uid: string) => void;
  stopFirestoreSync: () => void;
}

const MAX_HISTORY = 50;

// Debounced save to Firestore (auto-save)
const debouncedSave = debounce(async (profile: UserProfile, uid: string) => {
  try {
    const profileData = {
      ...profile,
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', uid), profileData, { merge: true });
    console.log('[Firestore] Profile auto-saved');
  } catch (error) {
    console.error('[Firestore] Auto-save failed:', error);
  }
}, 2000);

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: cloneDeep(mockProfile),
      view: 'desktop',
      editingTile: null,
      customCols: null,
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

      setCustomCols: (cols) => set({ customCols: cols }),

      autoArrangeTiles: () =>
        set((state) => {
          const tiles = [...state.profile.tiles];
          const cols = state.customCols || 3;

          // Separate tiles by type and priority
          const profileTiles = tiles.filter(t => t.type === 'profile');
          const headingTiles = tiles.filter(t => t.type === 'heading');
          const regularTiles = tiles.filter(t => t.type !== 'profile' && t.type !== 'heading');

          // Intelligent sorting strategy:
          // 1. Group by width categories (wide, medium, narrow)
          // 2. Within each group, sort by height (shorter first for better packing)
          // 3. Interleave groups for visual variety
          const wideTiles = regularTiles.filter(t => t.layout.w >= Math.ceil(cols * 0.66));
          const mediumTiles = regularTiles.filter(t => t.layout.w >= 2 && t.layout.w < Math.ceil(cols * 0.66));
          const narrowTiles = regularTiles.filter(t => t.layout.w === 1);

          // Sort each group by height (shorter first - easier to pack)
          const sortByHeight = (a: Tile, b: Tile) => a.layout.h - b.layout.h;
          wideTiles.sort(sortByHeight);
          mediumTiles.sort(sortByHeight);
          narrowTiles.sort(sortByHeight);

          // Interleave tiles for better visual distribution
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

          // Helper: Find best position using "Bottom-Left" algorithm
          // Tries to place tiles as low as possible, then as left as possible
          const findBestPosition = (w: number, h: number): {x: number, y: number} => {
            let bestY = Infinity;
            let bestX = 0;

            // Collect all y positions to try (including tile edges)
            const yPositions = new Set<number>([0]);
            occupied.forEach(o => {
              yPositions.add(o.y);
              yPositions.add(o.y + o.h);
            });
            const sortedY = Array.from(yPositions).sort((a, b) => a - b);

            // Try each y position (lowest first)
            for (const tryY of sortedY) {
              if (tryY > bestY) break; // No need to check higher y

              // Try each x position at this y (leftmost first)
              for (let tryX = 0; tryX + w <= cols; tryX++) {
                // Check for conflicts
                const hasConflict = occupied.some(o =>
                  !(tryX + w <= o.x || tryX >= o.x + o.w || tryY + h <= o.y || tryY >= o.y + o.h)
                );

                if (hasConflict) continue;

                // Check if this position is "supported" (no floating)
                // A position is supported if it's at y=0 or there's a tile below it
                const isSupported = tryY === 0 || occupied.some(o =>
                  o.x < tryX + w && o.x + o.w > tryX && o.y + o.h === tryY
                );

                // Prefer supported positions, but don't require it
                const score = tryY * 100 + (isSupported ? 0 : 50) + tryX;

                if (tryY < bestY || (tryY === bestY && tryX < bestX)) {
                  bestY = tryY;
                  bestX = tryX;
                }
                break; // Found valid position at this y, move to next y
              }
            }

            return bestY < Infinity ? { x: bestX, y: bestY } : { x: 0, y: currentY };
          };

          // Place profile tiles first (full width at top)
          profileTiles.forEach(tile => {
            const w = cols;
            const h = Math.max(2, tile.layout.h);
            newTiles.push({ ...tile, layout: { ...tile.layout, x: 0, y: currentY, w, h } });
            occupied.push({ x: 0, y: currentY, w, h });
            currentY += h;
          });

          // Place heading tiles (full width)
          headingTiles.forEach(tile => {
            const w = cols;
            const h = 1;
            newTiles.push({ ...tile, layout: { ...tile.layout, x: 0, y: currentY, w, h } });
            occupied.push({ x: 0, y: currentY, w, h });
            currentY += h;
          });

          // Place regular tiles using intelligent packing
          sortedTiles.forEach(tile => {
            const w = Math.min(tile.layout.w, cols);
            const h = tile.layout.h;

            const pos = findBestPosition(w, h);

            newTiles.push({ ...tile, layout: { ...tile.layout, x: pos.x, y: pos.y, w, h } });
            occupied.push({ x: pos.x, y: pos.y, w, h });

            // Update currentY
            currentY = Math.max(currentY, pos.y + h);
          });

          // Post-processing: Compact the layout to remove gaps
          // Sort tiles by y position, then x position
          newTiles.sort((a, b) => {
            if (a.layout.y !== b.layout.y) return a.layout.y - b.layout.y;
            return a.layout.x - b.layout.x;
          });

          // Adjust y positions to eliminate vertical gaps where possible
          const finalOccupied: Array<{x: number, y: number, w: number, h: number}> = [];
          const compactedTiles: Tile[] = [];

          newTiles.forEach(tile => {
            const w = tile.layout.w;
            const h = tile.layout.h;

            // Find the highest position this tile can occupy
            let bestY = tile.layout.y;
            for (let tryY = 0; tryY < tile.layout.y; tryY++) {
              const hasConflict = finalOccupied.some(o =>
                !(tile.layout.x + w <= o.x || tile.layout.x >= o.x + o.w || tryY + h <= o.y || tryY >= o.y + o.h)
              );
              if (!hasConflict) {
                bestY = tryY;
              } else {
                break; // Can't go higher
              }
            }

            compactedTiles.push({
              ...tile,
              layout: { ...tile.layout, y: bestY }
            });
            finalOccupied.push({ x: tile.layout.x, y: bestY, w, h });
          });

          return {
            ...state._recordHistory(state),
            profile: {
              ...state.profile,
              tiles: compactedTiles,
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
        return get().historyIndex > 0;
      },

      canRedo: () => {
        return get().historyIndex < get().history.length - 1;
      },

      // Firestore sync methods
      loadProfileFromFirestore: async (uid: string) => {
        set({ isLoading: true, error: null });
        try {
          const docRef = doc(db, 'users', uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            set({ 
              profile: data, 
              isLoading: false 
            });
          } else {
            // No profile found, use mock data
            set({ 
              profile: cloneDeep(mockProfile), 
              isLoading: false 
            });
          }
        } catch (error: any) {
          console.error('[Firestore] Load failed:', error);
          set({ 
            error: error.message, 
            isLoading: false 
          });
        }
      },

      saveProfileToFirestore: async () => {
        const state = get();
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        
        set({ isSaving: true, error: null });
        try {
          const profileData = {
            ...state.profile,
            updatedAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'users', uid), profileData, { merge: true });
          set({ isSaving: false });
          console.log('[Firestore] Profile saved');
        } catch (error: any) {
          console.error('[Firestore] Save failed:', error);
          set({ 
            error: error.message, 
            isSaving: false 
          });
        }
      },

      startFirestoreSync: (uid: string) => {
        const state = get();
        
        // Stop existing listener if any
        if (state.firestoreUnsubscribe) {
          state.firestoreUnsubscribe();
        }

        const docRef = doc(db, 'users', uid);
        const unsubscribe = onSnapshot(docRef, 
          (doc) => {
            if (doc.exists()) {
              const data = doc.data() as UserProfile;
              set({ profile: data });
            }
          },
          (error) => {
            console.error('[Firestore] Sync error:', error);
            set({ error: error.message });
          }
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
      version: 5,
      partialize: (state) => ({
        profile: state.profile,
        view: state.view,
        customCols: state.customCols,
      }),
    }
  )
);

// Patch updateProfile and other mutating actions to auto-save to Firestore
const originalUpdateProfile = useProfileStore.getState().updateProfile;
useProfileStore.setState({
  updateProfile: (patch) => {
    const state = useProfileStore.getState();
    state._recordHistory(state);
    useProfileStore.setState({ 
      profile: { ...state.profile, ...patch } 
    });
    
    // Auto-save to Firestore
    const uid = auth.currentUser?.uid;
    if (uid) {
      debouncedSave(useProfileStore.getState().profile, uid);
    }
  },
});

// Similarly patch other mutating actions
const originalUpdateTile = useProfileStore.getState().updateTile;
useProfileStore.setState({
  updateTile: (tile) => {
    const state = useProfileStore.getState();
    state._recordHistory(state);
    useProfileStore.setState({
      profile: {
        ...state.profile,
        tiles: state.profile.tiles.map((t) =>
          t.id === tile.id ? { ...t, ...tile } : t
        ),
      },
      editingTile: null,
    });
    
    // Auto-save to Firestore
    const uid = auth.currentUser?.uid;
    if (uid) {
      debouncedSave(useProfileStore.getState().profile, uid);
    }
  },
});

const originalAddTile = useProfileStore.getState().addTile;
useProfileStore.setState({
  addTile: (tile) => {
    const state = useProfileStore.getState();
    state._recordHistory(state);
    useProfileStore.setState({
      profile: {
        ...state.profile,
        tiles: [...state.profile.tiles, tile],
      },
    });
    
    // Auto-save to Firestore
    const uid = auth.currentUser?.uid;
    if (uid) {
      debouncedSave(useProfileStore.getState().profile, uid);
    }
  },
});

const originalRemoveTile = useProfileStore.getState().removeTile;
useProfileStore.setState({
  removeTile: (id) => {
    const state = useProfileStore.getState();
    state._recordHistory(state);
    useProfileStore.setState({
      profile: {
        ...state.profile,
        tiles: state.profile.tiles.filter((t) => t.id !== id),
      },
      editingTile: state.editingTile?.id === id ? null : state.editingTile,
    });
    
    // Auto-save to Firestore
    const uid = auth.currentUser?.uid;
    if (uid) {
      debouncedSave(useProfileStore.getState().profile, uid);
    }
  },
});
