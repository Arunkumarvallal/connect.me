'use client';

import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TileRenderer } from '@/components/profile/tile-renderer';
import { UserProfile, GRID_CONFIG } from '@/types/profile';
import { publicBgClassMap, fontClassMap, publicHeadingH } from '@/lib/theme-utils';
import { MapPin } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RGL = GridLayout as React.ComponentType<any>;

type RGLLayoutItem = { i: string; x: number; y: number; w: number; h: number; static?: boolean; isDraggable?: boolean; isResizable?: boolean; };

interface PublicProfileProps {
  profile: UserProfile;
  previewMode?: boolean;
}

export function PublicProfile({ profile, previewMode = false }: PublicProfileProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (previewMode) return; // skip Lenis in overlay preview
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

  // rowHeight — public profile uses a fixed value (dashboard uses container-adaptive width instead)
  const { rowHeightPx, gap, padding, maxCols } = GRID_CONFIG;

  // Heading fractional height so it renders at exactly HEADING_TARGET_PX tall.
  // (Imported from theme-utils so both places stay in sync from one constant.)
  const layout: RGLLayoutItem[] = profile.tiles.map((tile) => {
    const isHeading = tile.type === 'heading';
    return {
      i: tile.id,
      x: isHeading ? 0 : tile.layout.x,
      y: tile.layout.y,
      w: isHeading ? maxCols : tile.layout.w,
      h: isHeading ? publicHeadingH : tile.layout.h,
      static: true,
      isDraggable: false,
      isResizable: false,
    };
  });

  const bgClass   = publicBgClassMap[profile.theme.background] ?? 'bg-background';
  const fontClass = fontClassMap[profile.theme.font] ?? '';

  return (
    <div className={`min-h-screen flex ${bgClass} ${fontClass}`}>
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 min-h-screen border-r border-border/40 bg-background/60 backdrop-blur-sm sticky top-0 h-screen overflow-y-auto p-6">
        <div className="flex flex-col items-center gap-4 mt-6">
          <Avatar className="w-24 h-24 ring-2 ring-border/50">
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            <AvatarFallback className="text-2xl">{profile.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold">{profile.displayName}</h1>
            {profile.location && (
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" /> {profile.location}
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {profile.bio}
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden w-full fixed top-0 left-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Avatar className="w-9 h-9">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm">{profile.displayName}</p>
          {profile.location && (
            <p className="text-xs text-muted-foreground">{profile.location}</p>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="flex-1 pb-12 md:pt-0 pt-16" ref={containerRef}>
        <RGL
          className="layout"
          layout={layout}
          cols={maxCols}
          rowHeight={rowHeightPx}
          width={width}
          margin={[gap, gap]}
          containerPadding={[padding, padding]}
          isDraggable={false}
          isResizable={false}
        >
          {profile.tiles.map((tile) => (
            <div key={tile.id} className={tile.type === 'heading' ? '' : 'rounded-2xl overflow-hidden'}>
              <TileRenderer tile={tile} />
            </div>
          ))}
        </RGL>
      </main>
    </div>
  );
}
