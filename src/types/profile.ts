
export const BIO_MAX_CHARS = 150;

export type TileSize = '1x1' | '2x1' | '1x2' | '2x2' | '2x3' | '3x1' | '4x1' | '4x4' | '2x4' | '3x2' | '4x2' | '6x4' | '5x2';

export type TileType =
  | 'link' | 'social' | 'image' | 'video' | 'text' | 'heading'
  | 'spotify' | 'github' | 'youtube' | 'bio' | 'discord'
  | 'luma' | 'instagram' | 'whatsapp' | 'map' | 'email' | 'project';

/** Grid position managed by react-grid-layout */
export interface TileLayout {
  x: number;  // column start (0-based)
  y: number;  // row start  (0-based, RGL manages automatically)
  w: number;  // width in columns
  h: number;  // height in rows
}

/** Map TileSize shorthand to w/h for react-grid-layout */
export const tileSizeToLayout: Record<TileSize, Pick<TileLayout, 'w' | 'h'>> = {
  '1x1': { w: 1, h: 1   },   // small square   — 4× across on desktop, 2× on mobile
  '2x1': { w: 2, h: 1   },   // wide flat      — 2× across on desktop
  '1x2': { w: 1, h: 2   },   // tall narrow
  '2x2': { w: 2, h: 2   },   // big square     — 2× across on desktop
  '2x3': { w: 2, h: 3   },   // tall portrait  — 2× across on desktop
  '3x1': { w: 3, h: 1   },
  '4x1': { w: 4, h: 1   },
  '4x4': { w: 4, h: 4   },
  '2x4': { w: 2, h: 4   },
  '3x2': { w: 3, h: 2   },
  '4x2': { w: 4, h: 2   },
  '6x4': { w: 6, h: 4   },
  '5x2': { w: 5, h: 2   },
};

/**
 * Single source of truth for the tile grid layout.
 * Change values here — tile-grid.tsx reads from this automatically.
 *
 * cellPx      — minimum/target cell size in px. Tiles are NEVER smaller than this.
 *               Increase this to make all tiles bigger overall.
 * maxCols     — maximum columns allowed on desktop (tiles won't go smaller than cellPx)
 * maxColsMobile — maximum columns on mobile
 * gap         — space between tiles (px)
 * padding     — space around the whole grid (px)
 */
export const GRID_CONFIG = {
  cellPx:          160,  // target cell size — drives how many cols fit at any width
  maxCols:           4,  // desktop cap: never more than 4 columns
  minCols:           2,  // always at least 2 columns (mobile)
  maxColsMobile:     2,  // when mobileView preview is forced on
  gap:              12,  // space between tiles (px)
  padding:          16,  // outer padding around the grid (px)
  /**
   * Fixed row height used on the public profile page.
   * (Dashboard tiles use a dynamic rowHeight derived from container width.)
   */
  rowHeightPx:      80,
} as const;

/**
 * Sizes shown in the per-tile size picker.
 * ─ Change this ONE array to add, remove, or reorder picker options globally.
 * ─ Icon proportions are derived automatically from tileSizeToLayout (no hardcoded values).
 *   The tile-card component multiplies w/h by ICON_CELL_PX to get the SVG rect dimensions.
 */
export const TILE_PICKER_SIZES: TileSize[] = [
  '1x1',   // ■  small square   — 4× across on desktop, 2× mobile
  '2x1',   // ▬  wide flat      — 2× across
  '2x2',   // ■  big square     — 2× across
  '2x3',   // ▮  tall portrait  — 2× across
];

export interface LinkPreview {
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  url: string;
}

export interface Tile {
  id: string;
  type: TileType;
  title?: string;
  content?: string;
  size: TileSize;
  layout: TileLayout;
  url?: string;
  metadata?: {
    brand?: string;
    imageUrl?: string;
    imageData?: string;           // base64 for local uploads (Phase 1)
    imageStoragePath?: string;    // Firebase Storage path (Phase 2+)
    videoUrl?: string;
    videoStoragePath?: string;    // Firebase Storage path (Phase 2+)
    description?: string;
    username?: string;
    accentColor?: string;
    label?: string;
    isGif?: boolean;
    location?: string;
    previews?: string[];
    buttonText?: string;
    linkText?: string;
    linkPreview?: LinkPreview;    // OG metadata from /api/link-preview
  };
}

export type ProfileFont = 'headline' | 'mono' | 'sans';
export type ProfileBackground =
  | 'white' | 'light-gray' | 'dark'
  | 'gradient-sunset' | 'gradient-ocean' | 'gradient-forest';

export interface ProfileTheme {
  mode: 'light' | 'dark';
  font: ProfileFont;
  background: ProfileBackground;
}

export interface UserProfile {
  uid?: string;                   // Firebase Auth UID (Phase 2+)
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  location?: string;
  tiles: Tile[];
  theme: ProfileTheme;
  createdAt?: string;
}
