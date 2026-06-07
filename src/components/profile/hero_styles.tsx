'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/types/profile';
import { HeroStyle } from '@/types/profile';
import { fontClassMap } from '@/lib/theme-utils';
import { SocialIcon } from './social-icons';
import { cn } from '@/lib/utils';

interface HeroStylesProps {
  profile: UserProfile;
  readOnly?: boolean;
  previewMode?: boolean;
}

const socialIcons: Record<string, React.ReactNode> = {
  linkedin: <SocialIcon platform="linkedin" className="w-4 h-4" />,
  twitter: <SocialIcon platform="twitter" className="w-4 h-4" />,
  github: <SocialIcon platform="github" className="w-4 h-4" />,
  portfolio: <SocialIcon platform="portfolio" className="w-4 h-4" />,
  email: <SocialIcon platform="email" className="w-4 h-4" />,
};

// Style 1: Classic (centered, clean and readable)
export function ClassicHero({ profile, readOnly, previewMode }: HeroStylesProps) {
  const fontClass = fontClassMap[profile.theme.font] ?? '';
  const isMobile = previewMode;

  if (isMobile) return null;

  return (
    <div className={`w-full px-4 pt-12 pb-10 flex flex-col items-center gap-5 ${fontClass}`}>
      <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-2 ring-zinc-200 dark:ring-zinc-700 shadow-lg transition-transform hover:scale-105">
        <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
        <AvatarFallback className="text-3xl font-semibold">
          {profile.displayName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{profile.displayName}</h1>
        {profile.location && (
          <p className="text-sm text-muted-foreground/80 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile.location}
          </p>
        )}
      </div>
      {profile.bio && (
        <p className="text-sm text-muted-foreground text-center max-w-lg leading-relaxed px-4">
          {profile.bio.length > 150 ? `${profile.bio.slice(0, 150)}...` : profile.bio}
        </p>
      )}
      {/* Social Links */}
      {profile.socialLinks && (
        <div className="flex gap-3 mt-2">
          {Object.entries(profile.socialLinks).map(([key, value]) =>
            value ? (
              <a
                key={key}
                href={key === 'email' ? `mailto:${value}` : value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-200 p-2 hover:bg-accent rounded-full"
                title={key}
              >
                {socialIcons[key]}
              </a>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

// Style 2: Banner (full-width banner with avatar overlay)
export function BannerHero({ profile, readOnly, previewMode }: HeroStylesProps) {
  const fontClass = fontClassMap[profile.theme.font] ?? '';
  const isMobile = previewMode;

  if (isMobile) return null;

  const bannerUrl = profile.theme.background === 'gradient-sunset'
    ? 'https://picsum.photos/seed/banner1/1200/300'
    : profile.theme.background === 'gradient-ocean'
    ? 'https://picsum.photos/seed/banner2/1200/300'
    : 'https://picsum.photos/seed/banner3/1200/300';

  return (
    <div className={`relative w-full ${fontClass}`}>
      {/* Banner Image */}
      <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-primary/20 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" 
             style={{ backgroundImage: `url(${bannerUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      {/* Avatar Overlay */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-background shadow-xl transition-transform hover:scale-105">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback className="text-3xl font-semibold">
            {profile.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Name & Bio below avatar */}
      <div className="pt-20 pb-8 flex flex-col items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">{profile.displayName}</h1>
        {profile.location && (
          <p className="text-sm text-muted-foreground/80 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile.location}
          </p>
        )}
        {profile.bio && (
          <p className="text-sm text-muted-foreground text-center max-w-lg px-4 leading-relaxed">
            {profile.bio.length > 150 ? `${profile.bio.slice(0, 150)}...` : profile.bio}
          </p>
        )}
      </div>
    </div>
  );
}

// Style 3: Minimal (left-aligned small avatar + inline info)
export function MinimalHero({ profile, readOnly, previewMode }: HeroStylesProps) {
  const fontClass = fontClassMap[profile.theme.font] ?? '';
  const isMobile = previewMode;

  if (isMobile) return null;

  return (
    <div className={`w-full px-4 pt-8 pb-6 flex items-center gap-5 ${fontClass}`}>
      <Avatar className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 ring-2 ring-zinc-200 dark:ring-zinc-700">
        <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
        <AvatarFallback className="text-2xl font-semibold">
          {profile.displayName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold truncate">{profile.displayName}</h1>
        {profile.location && (
          <p className="text-xs text-muted-foreground mt-0.5">{profile.location}</p>
        )}
        {profile.bio && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {profile.bio.length > 100 ? `${profile.bio.slice(0, 100)}...` : profile.bio}
          </p>
        )}
        {/* Social Links Inline */}
        {profile.socialLinks && (
          <div className="flex gap-3 mt-3">
            {Object.entries(profile.socialLinks).map(([key, value]) =>
              value ? (
                <a
                  key={key}
                  href={key === 'email' ? `mailto:${value}` : value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {socialIcons[key]}
                </a>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Style 4: Card (card container with colored accent)
export function CardHero({ profile, readOnly, previewMode }: HeroStylesProps) {
  const fontClass = fontClassMap[profile.theme.font] ?? '';
  const isMobile = previewMode;

  if (isMobile) return null;

  return (
    <div className={`w-full px-4 pt-8 pb-6 flex justify-center ${fontClass}`}>
      <div className="w-full max-w-2xl bg-card border rounded-2xl p-6 shadow-sm flex gap-6 hover:shadow-md transition-shadow duration-300">
        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 ring-2 ring-primary/20">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback className="text-3xl font-semibold">
            {profile.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h1 className="text-xl sm:text-2xl font-bold">{profile.displayName}</h1>
          {profile.location && (
            <p className="text-sm text-muted-foreground mt-1">{profile.location}</p>
          )}
          {profile.bio && (
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {profile.bio.length > 120 ? `${profile.bio.slice(0, 120)}...` : profile.bio}
            </p>
          )}
          {/* Social Links */}
          {profile.socialLinks && (
            <div className="flex gap-3 mt-4">
              {Object.entries(profile.socialLinks).map(([key, value]) =>
                value ? (
                  <a
                    key={key}
                    href={key === 'email' ? `mailto:${value}` : value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title={key}
                  >
                    {socialIcons[key]}
                  </a>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Style 5: Magazine (large left avatar, right side content)
export function MagazineHero({ profile, readOnly, previewMode }: HeroStylesProps) {
  const fontClass = fontClassMap[profile.theme.font] ?? '';
  const isMobile = previewMode;

  if (isMobile) return null;

  return (
    <div className={`w-full px-4 pt-10 pb-8 flex gap-10 ${fontClass}`}>
      {/* Large Left Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="w-32 h-32 sm:w-40 sm:h-40 ring-2 ring-zinc-200 dark:ring-zinc-700 shadow-lg">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback className="text-5xl font-semibold">
            {profile.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Right Side Content */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{profile.displayName}</h1>
        {profile.location && (
          <p className="text-sm text-muted-foreground/80 mb-4 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile.location}
          </p>
        )}
        {profile.bio && (
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            {profile.bio}
          </p>
        )}
        {/* Social Links as buttons */}
        {profile.socialLinks && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(profile.socialLinks).map(([key, value]) =>
              value ? (
                <a
                  key={key}
                  href={key === 'email' ? `mailto:${value}` : value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs rounded-full border border-border hover:bg-accent transition-all duration-200"
                >
                  {socialIcons[key]}
                  <span className="capitalize">{key}</span>
                </a>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Map heroStyle to component */
export const heroComponentMap: Record<HeroStyle, React.ComponentType<HeroStylesProps>> = {
  classic: ClassicHero,
  banner: BannerHero,
  minimal: MinimalHero,
  card: CardHero,
  magazine: MagazineHero,
};
