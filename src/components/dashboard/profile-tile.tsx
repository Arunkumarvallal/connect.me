'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Twitter, Github, Globe, Mail, ExternalLink } from 'lucide-react';
import { useProfileStore } from '@/store/profile-store';
import { BIO_MAX_CHARS, SocialLinks } from '@/types/profile';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';

interface ProfileTileProps {
  readOnly?: boolean;
}

export function ProfileTile({ readOnly = false }: ProfileTileProps) {
  const { profile, updateProfile } = useProfileStore();
  const [isHovered, setIsHovered] = useState(false);

  const debouncedUpdate = useRef(
    debounce((patch: Parameters<typeof updateProfile>[0]) => {
      updateProfile(patch);
    }, 300)
  ).current;

  return (
    <div className="h-full w-full flex gap-6 p-6 bg-background/50 backdrop-blur-sm rounded-2xl">
      {/* Left: Avatar */}
      <div className="flex-shrink-0">
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-2 ring-zinc-200 dark:ring-zinc-700 transition-all hover:ring-violet-500">
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            <AvatarFallback className="text-3xl font-semibold">
              {profile.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!readOnly && (
            <label
              htmlFor="avatar-upload-tile"
              className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 transition-opacity cursor-pointer ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-white text-xs font-semibold tracking-wide">Change</span>
            </label>
          )}
          {!readOnly && (
            <input
              id="avatar-upload-tile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => updateProfile({ avatarUrl: reader.result as string });
                reader.readAsDataURL(file);
              }}
            />
          )}
        </div>

        {/* Social Media Boxes - shown below avatar in edit mode */}
        {!readOnly && (
          <div className="mt-3 space-y-1.5">
            {(['linkedin', 'twitter', 'github', 'portfolio', 'email'] as const).map((key) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-16 text-[10px] text-zinc-500 capitalize">{key}</span>
                <input
                  defaultValue={profile.socialLinks?.[key] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    debouncedUpdate({
                      socialLinks: { ...(profile.socialLinks || {}), [key]: val || undefined }
                    } as any);
                  }}
                  className="flex-1 text-[11px] bg-transparent border-b border-zinc-300 dark:border-zinc-600 outline-none focus:border-violet-500 text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-600 pb-0.5 min-w-[120px]"
                  placeholder={key === 'email' ? 'email' : `${key}...`}
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Name, Bio, and Social Links */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {/* Display Name */}
        {readOnly ? (
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            {profile.displayName || 'Your Name'}
          </h2>
        ) : (
          <input
            defaultValue={profile.displayName}
            onChange={(e) => debouncedUpdate({ displayName: e.target.value })}
            className="w-full text-left text-xl sm:text-2xl font-bold bg-transparent border-none outline-none focus:outline-none shadow-none ring-0 focus:ring-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-foreground p-0 mb-2"
            placeholder="Your name"
            spellCheck={false}
          />
        )}

        {/* Bio */}
        {readOnly ? (
          profile.bio && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 break-words mb-3">
              {profile.bio}
            </p>
          )
        ) : (
          <div className="w-full relative">
            <textarea
              defaultValue={profile.bio}
              maxLength={BIO_MAX_CHARS}
              onChange={(e) => debouncedUpdate({ bio: e.target.value })}
              className="w-full resize-none bg-transparent border-none outline-none focus:outline-none shadow-none ring-0 focus:ring-0 text-sm sm:text-base text-muted-foreground leading-relaxed placeholder:text-zinc-400 dark:placeholder:text-zinc-600 p-0 overflow-y-hidden min-h-[40px]"
              placeholder="Write a short bio…"
              spellCheck={false}
            />
            <span className="absolute bottom-0 right-0 text-[10px] text-zinc-400 dark:text-zinc-600 select-none pointer-events-none">
              {profile.bio.length}/{BIO_MAX_CHARS}
            </span>
          </div>
        )}

        {/* Social Links removed from hero section */}
      </div>
    </div>
  );
}
