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
    <div className={`min-h-screen flex bg-background text-foreground ${fontClass} transition-colors duration-300`}>
      {/* Mobile header — visible only on small screens */}
      <div className="md:hidden w-full fixed top-0 left-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Avatar className="w-9 h-9">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{profile.displayName}</p>
        </div>
      </div>

      {/* Main grid area — profile is now a tile in the grid */}
      <main className={`flex-1 min-h-screen overflow-x-hidden pb-12 transition-all duration-300 ${gridBgClass} md:pt-0 pt-16`}>
        <TileGrid readOnly tiles={profile.tiles} />
      </main>
    </div>
  );
}
