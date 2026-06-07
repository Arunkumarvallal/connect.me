"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { UserProfile } from "@/types/profile";
import { dashboardBgClassMap, fontClassMap } from "@/lib/theme-utils";
import { BentoHero } from "./bento-hero";
import { SectionsRenderer } from "./sections-renderer";
import { cn } from "@/lib/utils";

interface PublicProfileProps {
  profile: UserProfile;
  previewMode?: boolean;
}

/**
 * PublicProfile — Figma reference layout.
 *
 * Desktop (>=lg): 2-column grid
 *   ┌────────────┬─────────────────────────────────┐
 *   │ BentoHero  │ SectionsRenderer (bento grid)   │
 *   │ (sticky)   │ (scrolls past)                  │
 *   │ 280px      │ 1fr                             │
 *   └────────────┴─────────────────────────────────┘
 *
 * Mobile (<lg): single column, everything stacks and the page scrolls.
 */
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

  const gridBgClass = dashboardBgClassMap[profile.theme.background] ?? "";
  const fontClass = fontClassMap[profile.theme.font] ?? "";

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300",
        fontClass,
      )}
    >
      <div
        className={cn(
          "w-full mx-auto px-4 pt-10 lg:pt-16 pb-12",
          "max-w-7xl xl:max-w-[min(100vw,1728px)]",
          "lg:px-4 xl:px-8",
          "flex flex-col items-center gap-10",
          "lg:grid lg:grid-cols-[450px_1fr] lg:gap-10 lg:items-start",
        )}
      >
        {/* LEFT: sticky profile column */}
        <BentoHero profile={profile} readOnly previewMode={previewMode} />

        {/* RIGHT: bento grid sections */}
        <div className="flex-1 min-w-0 w-full">
          <SectionsRenderer
            tiles={profile.tiles}
            maxCols={profile.theme.maxCols ?? 4}
          />
        </div>
      </div>

      {/* Background-tinted band — extends past the constrained grid on lg+ */}
      <div className={cn("flex-1 transition-all duration-300", gridBgClass)} />

      {/* Footer */}
      <footer className="w-full py-6 px-4 lg:px-6 text-center text-xs text-muted-foreground border-t border-border/30">
        Built with{" "}
        <a
          href="/"
          className="hover:text-foreground transition-colors font-semibold"
        >
          Connect.me
        </a>
      </footer>
    </div>
  );
}
