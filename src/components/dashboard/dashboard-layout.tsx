'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ProfileSidebar } from './profile-sidebar';
import { TileGrid } from './tile-grid';
import { ControlDock } from './control-dock';
import { SettingsPanel } from './settings-panel';
import { TileEditDialog } from './tile-edit-dialog';
import { useProfileStore } from '@/store/profile-store';
import { PublicProfile } from '@/components/profile/public-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboardBgClassMap, fontClassMap } from '@/lib/theme-utils';

export function DashboardLayout() {
  const { profile } = useProfileStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const gridBgClass   = dashboardBgClassMap[profile.theme.background] ?? '';
  const fontClass     = fontClassMap[profile.theme.font] ?? '';

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row bg-background text-foreground ${fontClass} transition-colors duration-300`}>
      {/* Mobile header - bento style card */}
      <header className="lg:hidden w-full sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-md rounded-2xl border border-border/40 px-4 py-2.5 shadow-sm">
          <Avatar className="w-9 h-9">
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            <AvatarFallback className="text-sm font-semibold">{profile.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{profile.displayName}</p>
          </div>
        </div>
      </header>

      {/* Left sidebar - bento style card container - desktop only */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 min-h-screen sticky top-0 h-screen p-4 overflow-y-auto">
        <div className="bg-background rounded-3xl border border-border/40 shadow-sm p-6 h-full overflow-y-auto">
          <ProfileSidebar />
        </div>
      </aside>

      {/* Main grid area - full remaining width */}
      <main className={`flex-1 min-h-screen overflow-x-hidden pb-28 transition-all duration-300 ${gridBgClass} ${mobileView ? 'flex items-start justify-center pt-8' : ''}`}>
        {mobileView ? (
          <div className="w-[375px] min-h-[667px] sm:min-h-[812px] rounded-[2.5rem] border-[3px] border-zinc-800 dark:border-zinc-300 shadow-[0_0_0_8px_rgba(0,0,0,0.12),0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden bg-background relative">
            {/* Phone status bar */}
            <div className="h-8 bg-background flex items-center justify-between px-6 pt-2 relative z-10">
              <span className="text-[10px] font-medium font-mono">9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2.5 rounded-sm bg-foreground/80" />
                <div className="w-0.5 h-2.5 rounded-full bg-foreground/80" />
              </div>
            </div>
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-full z-10" />

            {/* Profile header inside phone */}
            <div className="flex flex-col items-center gap-3 pt-8 pb-5 px-6 bg-transparent">
              <Avatar className="w-20 h-20 ring-[1.5px] ring-zinc-300 dark:ring-zinc-600">
                <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                <AvatarFallback className="text-2xl font-semibold">
                  {profile.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-base font-bold text-center text-foreground">{profile.displayName || 'Your Name'}</h2>
              {profile.bio && (
                <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">{profile.bio}</p>
              )}
            </div>

            {/* Tile grid scrollable area */}
            <div className="overflow-y-auto h-[calc(100%-180px)]">
              <TileGrid mobileView={true} />
            </div>
          </div>
        ) : (
          <TileGrid mobileView={false} />
        )}
      </main>

      {/* Floating bottom dock */}
      <ControlDock
        onPreview={() => setPreviewMode(true)}
        onSettings={() => setSettingsOpen(true)}
        mobileView={mobileView}
        onToggleMobileView={() => setMobileView((p) => !p)}
      />

      {/* Style settings sheet */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Tile edit dialog */}
      <TileEditDialog />

      {/* Preview overlay */}
      <AnimatePresence>
        {previewMode && (
          <motion.div
            key="preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => setPreviewMode(false)}
              className="fixed top-4 right-4 z-60 w-9 h-9 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Public profile view */}
            <PublicProfile profile={profile} previewMode />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
