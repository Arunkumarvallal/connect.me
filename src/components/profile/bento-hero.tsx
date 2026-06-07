"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile, HeroAccent, DEFAULT_HERO_ACCENT } from "@/types/profile";
import { fontClassMap } from "@/lib/theme-utils";
import { Mail } from "lucide-react";
import { SocialIcon } from "./social-icons";
import { cn } from "@/lib/utils";

interface BentoHeroProps {
  profile: UserProfile;
  readOnly?: boolean;
  previewMode?: boolean;
}

/**
 * BentoHero — chennai-react style sticky-left profile column.
 *
 *   - Large circular avatar (~300px) with border + shadow
 *   - 2 floating chips: "📍 Based in X" (top-left), "👋 Welcome!" (top-right)
 *   - Name (h1) BELOW the avatar
 *   - Hero accent chip (editable from day 1)
 *   - Bio paragraph
 *   - Social pill row
 *
 * The parent PublicProfile / DashboardLayout wraps this in
 * `lg:grid lg:grid-cols-[450px_1fr]` so the right column's bento grid
 * provides scroll context for the sticky positioning.
 *
 * On mobile (<lg), the layout stacks naturally into a single scrolling column.
 */
export function BentoHero({ profile, readOnly, previewMode }: BentoHeroProps) {
  const accent: HeroAccent = profile.theme.heroAccent ?? DEFAULT_HERO_ACCENT;
  const fontClass = fontClassMap[profile.theme.font] ?? "";

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center text-center gap-5",
        "lg:items-start lg:text-left",
        "lg:sticky lg:self-start",
        previewMode ? "lg:top-4" : "lg:top-16",
        fontClass,
      )}
    >
      {/* Avatar + floating chips */}
      <div className="relative mx-auto lg:mx-0">
        <div className="relative h-[250px] w-[250px] md:h-[300px] md:w-[300px]">
          <Avatar className="h-full w-full rounded-full border-[6px] border-white dark:border-zinc-900 shadow-2xl overflow-hidden">
            <AvatarImage
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="object-cover"
            />
            <AvatarFallback className="text-7xl font-bold bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              {profile.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* chip 1: Based in (top-left) */}
          {profile.location && (
            <div className="absolute -top-2 -left-4 sm:-left-8 z-10">
              <div className="px-3 py-2 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xl border border-border/40 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-sm">📍</span>
                Based in {profile.location}
              </div>
            </div>
          )}

          {/* chip 2: Welcome (top-right) */}
          <div className="absolute -top-2 -right-4 sm:-right-8 z-10">
            <div className="px-3 py-2 rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xl border border-border/40 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-sm">👋</span>
              Welcome!
            </div>
          </div>

          {/* chip 3: Accent (bottom-center) */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
            {accent.href ? (
              <a
                href={accent.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-xl transition-transform hover:scale-105 whitespace-nowrap",
                  accent.color ?? "bg-emerald-500",
                )}
              >
                {accent.emoji && <span className="text-sm">{accent.emoji}</span>}
                {accent.label}
              </a>
            ) : (
              <div
                className={cn(
                  "px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-xl whitespace-nowrap",
                  accent.color ?? "bg-emerald-500",
                )}
              >
                {accent.emoji && <span className="text-sm">{accent.emoji}</span>}
                {accent.label}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-headline mt-2">
        {profile.displayName}
      </h1>

      {/* Bio */}
      {profile.bio && (
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs lg:max-w-sm">
          {profile.bio}
        </p>
      )}

      {/* Social pill row */}
      {profile.socialLinks && (
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1">
          {[
            { key: "github", label: "GitHub", iconKey: "github" },
            { key: "linkedin", label: "LinkedIn", iconKey: "linkedin" },
            { key: "twitter", label: "Twitter", iconKey: "twitter" },
            { key: "youtube", label: "YouTube", iconKey: "globe" },
            { key: "discord", label: "Discord", iconKey: "globe" },
            { key: "portfolio", label: "Website", iconKey: "portfolio" },
            { key: "instagram", label: "Instagram", iconKey: "globe" },
          ]
            .filter(
              (s) =>
                profile.socialLinks?.[
                  s.key as keyof typeof profile.socialLinks
                ],
            )
            .map((s) => {
              const v =
                profile.socialLinks?.[
                  s.key as keyof typeof profile.socialLinks
                ];
              return (
                <a
                  key={s.key}
                  href={s.key === "email" ? `mailto:${v}` : v}
                  target={s.key === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border/60 bg-background/70 backdrop-blur hover:bg-accent hover:scale-105 transition-all duration-200"
                >
                  <SocialIcon platform={s.iconKey} className="w-3.5 h-3.5" />
                  {s.label}
                </a>
              );
            })}
          {profile.socialLinks?.email && (
            <a
              href={`mailto:${profile.socialLinks.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary text-primary-foreground hover:scale-105 transition-all duration-200"
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
          )}
        </div>
      )}
    </div>
  );
}
