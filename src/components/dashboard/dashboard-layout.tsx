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

  // Only override bg for gradients/special colors; otherwise let next-themes CSS vars control white/dark
  const gridBgClass = dashboardBgClassMap[profile.theme.background] ?? '';
  const fontClass   = fontClassMap[profile.theme.font] ?? '';

  return (
    <div className={`min-h-screen flex bg-background text-foreground ${fontClass} transition-colors duration-300`}>
      {/* Left sidebar — transparent, blends into page bg */}
      <aside className="hidden md:flex flex-col w-[560px] shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        <ProfileSidebar />
      </aside>

      {/* Main grid area — profile theme bg applied here only */}
      <main className={`flex-1 min-h-screen overflow-x-hidden pb-28 transition-all duration-300 ${gridBgClass} ${mobileView ? 'flex items-start justify-center pt-8' : ''}`}>
        {mobileView ? (
          <div className="w-[390px] min-h-[700px] rounded-[2.5rem] border-2 border-zinc-800 dark:border-zinc-300 shadow-[0_0_0_4px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Phone status bar */}
            <div className="h-10 bg-background flex items-center justify-center px-6">
              <div className="w-20 h-5 rounded-full bg-foreground/10" />
            </div>

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
            <div className="overflow-y-auto">
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
