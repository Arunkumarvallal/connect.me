
export type TileSize = '1x1' | '2x1' | '1x2' | '2x2';

export type TileType = 'link' | 'social' | 'image' | 'text' | 'spotify' | 'github' | 'youtube' | 'bio' | 'discord' | 'luma' | 'instagram' | 'whatsapp';

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
    description?: string;
    username?: string;
    accentColor?: string;
    label?: string;
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
  tiles: Tile[];
  theme: ProfileTheme;
}
