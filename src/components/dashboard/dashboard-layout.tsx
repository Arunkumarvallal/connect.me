'use client';

import { useState } from 'react';
import { TileGrid } from './tile-grid';
import { ControlDock } from './control-dock';
import { SettingsPanel } from './settings-panel';
import { TileEditDialog } from './tile-edit-dialog';
import { useProfileStore } from '@/store/profile-store';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { dashboardBgClassMap, fontClassMap } from '@/lib/theme-utils';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardLayout() {
  const { profile } = useProfileStore();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const gridBgClass   = dashboardBgClassMap[profile.theme.background] ?? '';
  const fontClass     = fontClassMap[profile.theme.font] ?? '';

  // Get user display info from Firebase Auth or fallback to profile
  const userDisplayName = user?.displayName || profile.displayName;
  const userPhotoURL = user?.photoURL || profile.avatarUrl;
  const userEmail = user?.email || '';

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${fontClass} transition-colors duration-300`}>
      {/* Desktop header */}
      <header className="hidden lg:flex w-full sticky top-0 z-40 px-6 py-3 items-center justify-between bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <LayoutDashboard className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight font-headline">Dashboard</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={userPhotoURL} alt={userDisplayName} />
              <AvatarFallback className="text-xs font-semibold">
                {userDisplayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">{userDisplayName}</p>
              {userEmail && (
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/settings')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Mobile header - bento style card */}
      <header className="lg:hidden w-full sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-md rounded-2xl border border-border/40 px-4 py-2.5 shadow-sm">
          <Avatar className="w-9 h-9">
            <AvatarImage src={userPhotoURL} alt={userDisplayName} />
            <AvatarFallback className="text-sm font-semibold">
              {userDisplayName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{userDisplayName}</p>
            {userEmail && (
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/dashboard/settings')}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Main grid area - full width */}
      <main className={`min-h-screen overflow-x-hidden pb-28 transition-all duration-300 ${gridBgClass} ${mobileView ? 'flex items-start justify-center pt-8' : ''}`}>
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
        onSettings={() => setSettingsOpen(true)}
        mobileView={mobileView}
        onToggleMobileView={() => setMobileView((p) => !p)}
      />

      {/* Style settings sheet */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Tile edit dialog */}
      <TileEditDialog />
    </div>
  );
}
