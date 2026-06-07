
export const BIO_MAX_CHARS = 150;

export type TileSize = '1x1' | '2x1' | '3x1' | '1x2' | '2x2' | '3x2' | '1x3' | '2x3' | '3x3';

export type TileType =
  | 'link' | 'social' | 'image' | 'video' | 'text' | 'heading'
  | 'spotify' | 'github' | 'youtube' | 'bio' | 'discord'
  | 'luma' | 'instagram' | 'whatsapp' | 'map' | 'email' | 'project' | 'profile';

/** Logical grouping for the public viewer (chennai-react style) */
export type TileSection = 'socials' | 'projects' | 'experience' | 'sponsors' | 'contact' | 'general';

/** Grid position managed by react-grid-layout */
export interface TileLayout {
  x: number;  // column start (0-based)
  y: number;  // row start  (0-based, RGL manages automatically)
  w: number;  // width in columns
  h: number;  // height in rows
}

/** Map TileSize shorthand to w/h for react-grid-layout */
export const tileSizeToLayout: Record<TileSize, Pick<TileLayout, 'w' | 'h'>> = {
  '1x1': { w: 1, h: 1   },   // small square
  '2x1': { w: 2, h: 1   },   // wide flat
  '3x1': { w: 3, h: 1   },   // full-width flat
  '1x2': { w: 1, h: 2   },   // tall narrow
  '2x2': { w: 2, h: 2   },   // big square
  '3x2': { w: 3, h: 2   },   // full-width rectangle
  '1x3': { w: 1, h: 3   },   // very tall narrow
  '2x3': { w: 2, h: 3   },   // tall portrait
  '3x3': { w: 3, h: 3   },   // full-width large
};

/**
 * Single source of truth for the tile grid layout.
 *
 * cellPx       — target cell size in px. Tiles are NEVER smaller than this.
 * editorMaxCols — max cols inside the dashboard editor (unrestricted by the brief)
 * publicMaxCols — cap on the public viewer (chennai-react: 2–4 cols)
 * gap          — space between tiles (px)
 * padding      — space around the whole grid (px)
 */
export const GRID_CONFIG = {
  cellPx:           140,
  editorMaxCols:    6,
  editorMinCols:    2,
  publicMaxCols:    4,
  publicMinCols:    2,
  maxColsMobile:    2,
  gap:              16,
  padding:          16,
  rowHeightPx:      80,
} as const;

export const TILE_PICKER_SIZES: TileSize[] = [
  '1x1', '2x1', '3x1', '1x2', '2x2', '3x2', '1x3', '2x3', '3x3',
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
    brandColor?: string;       // override brand bg (e.g. '#1DA1F2')
    imageUrl?: string;
    imageData?: string;
    imageStoragePath?: string;
    videoUrl?: string;
    videoStoragePath?: string;
    description?: string;
    username?: string;
    accentColor?: string;
    accentChip?: string;       // e.g. 'OSS', 'Available', 'Open to work'
    label?: string;
    isGif?: boolean;
    location?: string;
    previews?: string[];
    buttonText?: string;
    linkText?: string;
    linkPreview?: LinkPreview;
    section?: TileSection;     // override section for the public viewer
    handle?: string;           // social handle e.g. '@shamthedev'
    /** BentoCard visual variant */
    cardVariant?: 'plain' | 'gradient' | 'image' | 'brand' | 'glow';
  };
}

export type ProfileFont = 'headline' | 'mono' | 'sans';
export type ProfileBackground =
  | 'white' | 'light-gray' | 'dark'
  | 'gradient-sunset' | 'gradient-ocean' | 'gradient-forest';

/**
 * Accent chip floating on the sticky-left hero.
 * Customisable per profile from day 1.
 */
export type HeroAccentKind = 'oss' | 'available' | 'open-to-work' | 'building' | 'speaking' | 'custom';

export interface HeroAccent {
  kind: HeroAccentKind;
  label: string;            // shown on the chip
  emoji?: string;           // optional emoji prefix
  color?: string;           // tailwind bg class, e.g. 'bg-emerald-500'
  href?: string;            // optional click target
}

export const DEFAULT_HERO_ACCENT: HeroAccent = {
  kind: 'available',
  label: 'Available for hire',
  emoji: '✦',
  color: 'bg-emerald-500',
};

export interface ProfileTheme {
  font: ProfileFont;
  background: ProfileBackground;
  /** Customisable accent chip floating on the hero */
  heroAccent: HeroAccent;
  /**
   * Max grid columns for the public preview AND the dashboard editor.
   * Persisted on the profile so editor changes are visible in preview.
   * chennai-react reference: 1–4 (default 4).
   */
  maxCols?: number;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
  email?: string;
  discord?: string;
  youtube?: string;
  instagram?: string;
}

export interface UserProfile {
  uid?: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  location?: string;
  socialLinks?: SocialLinks;
  tiles: Tile[];
  theme: ProfileTheme;
  createdAt?: string;
}
