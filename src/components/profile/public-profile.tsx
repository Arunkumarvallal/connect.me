'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TileGrid } from '@/components/dashboard/tile-grid';
import { UserProfile, HeroStyle } from '@/types/profile';
import { dashboardBgClassMap, fontClassMap } from '@/lib/theme-utils';
import { heroComponentMap } from './hero_styles';

interface PublicProfileProps {
  profile: UserProfile;
  previewMode?: boolean;
}

export function PublicProfile({ profile, previewMode = false }: PublicProfileProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (previewMode) return;
    const lenis = new Lenis({ lerp: 0.08 });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [previewMode]);

  const gridBgClass = dashboardBgClassMap[profile.theme.background] ?? '';
  const fontClass = fontClassMap[profile.theme.font] ?? '';
  const heroStyle = profile.theme.heroStyle || 'classic';
  const HeroComponent = heroComponentMap[heroStyle as HeroStyle] || heroComponentMap.classic;

  // Filter out profile tile from grid (hero section handles it now)
  const contentTiles = profile.tiles.filter(tile => tile.type !== 'profile');

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${fontClass} transition-colors duration-300`}>
      {/* Hero Section - rendered based on selected style */}
      <HeroComponent profile={profile} readOnly previewMode={previewMode} />

      {/* Mobile layout fallback: if hero component returned null for mobile, show inline layout */}
      <div className="md:hidden w-full px-4 pt-8 pb-4 flex flex-col items-center gap-3">
        <Avatar className="w-20 h-20">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback className="text-2xl">{profile.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-center">{profile.displayName}</h1>
        {profile.location && (
          <p className="text-sm text-muted-foreground text-center">{profile.location}</p>
        )}
        {profile.bio && (
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {profile.bio.length > 150 ? `${profile.bio.slice(0, 150)}...` : profile.bio}
          </p>
        )}
        {/* Mobile Social Links */}
        {profile.socialLinks && (
          <div className="flex gap-3 mt-1">
            {Object.entries(profile.socialLinks).map(([key, value]) =>
              value ? (
                <a
                  key={key}
                  href={key === 'email' ? `mailto:${value}` : value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {key === 'linkedin' && <span className="text-xs">LinkedIn</span>}
                  {key === 'twitter' && <span className="text-xs">Twitter</span>}
                  {key === 'github' && <span className="text-xs">GitHub</span>}
                  {key === 'portfolio' && <span className="text-xs">Portfolio</span>}
                  {key === 'email' && <span className="text-xs">Email</span>}
                </a>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Tiles Grid - excluding profile tile (hero handles it) */}
      <main className={`flex-1 min-h-screen overflow-x-hidden pb-12 transition-all duration-300 ${gridBgClass}`}>
        <TileGrid readOnly tiles={contentTiles} />
      </main>
    </div>
  );
}
