'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TileGrid } from '@/components/dashboard/tile-grid';
import { UserProfile } from '@/types/profile';
import { dashboardBgClassMap, fontClassMap } from '@/lib/theme-utils';

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

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${fontClass} transition-colors duration-300`}>
      {/* Mobile layout: avatar → name → bio → tiles (per spec) */}
      <div className="md:hidden w-full px-4 pt-8 pb-4 flex flex-col items-center gap-3">
        <Avatar className="w-20 h-20">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback className="text-2xl">{profile.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-center">{profile.displayName}</h1>
        {profile.bio && (
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {profile.bio.length > 150 ? `${profile.bio.slice(0, 150)}...` : profile.bio}
          </p>
        )}
      </div>

      {/* Desktop: show profile as tile in grid, Mobile: show tiles below bio */}
      <main className={`flex-1 min-h-screen overflow-x-hidden pb-12 transition-all duration-300 ${gridBgClass}`}>
        <TileGrid readOnly tiles={profile.tiles} />
      </main>
    </div>
  );
}
