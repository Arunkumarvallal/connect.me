'use client';

import { useRef, useState } from 'react';
import { debounce } from 'lodash';
import { SlidersHorizontal, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileStore } from '@/store/profile-store';
import { BIO_MAX_CHARS, UserProfile } from '@/types/profile';

interface ProfileSidebarProps {
  profile?: UserProfile;
  editable?: boolean;
}

export function ProfileSidebar({ profile: profileProp, editable = true }: ProfileSidebarProps) {
  const { profile: storeProfile, updateProfile } = useProfileStore();
  const profile = profileProp ?? storeProfile;
  const [popoverOpen, setPopoverOpen] = useState(false);

  const debouncedUpdate = useRef(
    debounce((patch: Parameters<typeof updateProfile>[0]) => {
      updateProfile(patch);
    }, 300)
  ).current;

  return (
    <aside className="relative flex flex-col items-center gap-6 pt-12 px-8 pb-24 w-full h-full">
      {/* Avatar — large, click to change */}
      <div className="relative group shrink-0">
        <Avatar className="w-52 h-52 ring-[1.5px] ring-zinc-300 dark:ring-zinc-600">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback className="text-6xl font-semibold">
            {profile.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {editable && (
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-white text-xs font-semibold tracking-wide">Change</span>
          </label>
        )}
        {editable && (
          <input
            id="avatar-upload"
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

      {/* Display name */}
      {editable ? (
        <input
          key={profile.displayName}
          defaultValue={profile.displayName}
          onChange={(e) => debouncedUpdate({ displayName: e.target.value })}
          className="w-full text-center text-3xl font-bold bg-transparent border-none outline-none focus:outline-none shadow-none ring-0 focus:ring-0 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-foreground p-0"
          placeholder="Your name"
          spellCheck={false}
        />
      ) : (
        <h1 className="w-full text-center text-3xl font-bold text-foreground">
          {profile.displayName || 'Your Name'}
        </h1>
      )}

      {/* Bio */}
      {editable ? (
        <div className="w-full relative">
          <textarea
            key={profile.bio}
            defaultValue={profile.bio}
            maxLength={BIO_MAX_CHARS}
            rows={5}
            onChange={(e) => debouncedUpdate({ bio: e.target.value })}
            className="w-full resize-none bg-transparent border-none outline-none focus:outline-none shadow-none ring-0 focus:ring-0 text-base text-muted-foreground leading-relaxed placeholder:text-zinc-400 dark:placeholder:text-zinc-600 p-0"
            placeholder="Write a short bio…"
            spellCheck={false}
          />
          <span className="absolute bottom-1 right-0 text-[10px] text-zinc-400 dark:text-zinc-600 select-none pointer-events-none">
            {profile.bio.length}/{BIO_MAX_CHARS}
          </span>
        </div>
      ) : (
        profile.bio && (
          <p className="w-full text-base text-muted-foreground leading-relaxed">
            {profile.bio}
          </p>
        )
      )}

      <div className="mt-auto" />

      {/* Settings icon — dashboard only */}
      {editable && (<div className="absolute bottom-6 left-8">
        {/* Popover */}
        {popoverOpen && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={() => setPopoverOpen(false)} />
            <div className="absolute bottom-12 left-0 z-50 w-56 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
              {/* User info */}
              <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                  <AvatarFallback className="text-sm font-semibold">{profile.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{profile.displayName || 'Your Name'}</p>
                  <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
                </div>
              </div>
              <div className="mx-4 h-px bg-border" />
              {/* Email */}
              <div className="px-4 py-2.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm text-foreground truncate">{profile.username}@connect.me</p>
              </div>
              <div className="mx-4 h-px bg-border" />
              {/* Logout */}
              <button
                onClick={() => { setPopoverOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </>
        )}
        <button
          onClick={() => setPopoverOpen((p) => !p)}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent shadow-sm transition-colors duration-150"
          title="Account"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>)}
    </aside>
  );
}
