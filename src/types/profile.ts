
export type TileSize = '1x1' | '2x1' | '1x2' | '2x2' | '3x1';

export type TileType = 'link' | 'social' | 'image' | 'video' | 'text' | 'spotify' | 'github' | 'youtube' | 'bio' | 'discord' | 'luma' | 'instagram' | 'whatsapp';

export interface Tile {
  id: string;
  type: TileType;
  title?: string;
  content?: string;
  size: TileSize;
  url?: string;
  metadata?: {
    brand?: string;
    imageUrl?: string;
    videoUrl?: string;
    description?: string;
    username?: string;
    accentColor?: string;
    label?: string;
    isGif?: boolean;
  };
}

export interface ProfileTheme {
  mode: 'light' | 'dark';
  font: 'body' | 'headline' | 'serif' | 'mono';
  background: 'white' | 'mesh' | 'gradient-blue' | 'gradient-sunset';
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  location?: string;
  tiles: Tile[];
  theme: ProfileTheme;
}
