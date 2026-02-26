
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { mockProfile } from '@/lib/mock-data';
import { TileRenderer } from '@/components/profile/tile-renderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Settings, 
  Palette, 
  Layout, 
  Eye, 
  GripVertical, 
  Trash2, 
  ChevronRight,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [profile, setProfile] = useState(mockProfile);
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  const removeTile = (id: string) => {
    setProfile({
      ...profile,
      tiles: profile.tiles.filter(t => t.id !== id)
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg font-headline">Connect.me</span>
          <div className="h-4 w-[1px] bg-border mx-2" />
          <span className="text-sm text-muted-foreground font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-1 mr-4">
            <button 
              onClick={() => setView('desktop')}
              className={cn("p-1.5 rounded-md transition-all", view === 'desktop' ? "bg-background shadow-sm" : "text-muted-foreground")}
            >
              <Monitor size={16} />
            </button>
            <button 
              onClick={() => setView('mobile')}
              className={cn("p-1.5 rounded-md transition-all", view === 'mobile' ? "bg-background shadow-sm" : "text-muted-foreground")}
            >
              <Smartphone size={16} />
            </button>
          </div>
          <Button variant="outline" size="sm" className="rounded-full px-4" asChild>
            <a href={`/${profile.username}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" /> Preview
            </a>
          </Button>
          <Button size="sm" className="rounded-full px-6">Publish</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Editor */}
        <aside className="w-[400px] border-r bg-background overflow-y-auto p-6 space-y-8">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-11 rounded-xl p-1">
              <TabsTrigger value="content" className="rounded-lg"><Layout className="w-4 h-4 mr-2" /> Content</TabsTrigger>
              <TabsTrigger value="design" className="rounded-lg"><Palette className="w-4 h-4 mr-2" /> Design</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg"><Settings className="w-4 h-4 mr-2" /> Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Biography</h3>
                </div>
                <div className="space-y-4 p-4 bg-muted/30 rounded-2xl border">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input defaultValue={profile.displayName} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea defaultValue={profile.bio} className="rounded-xl min-h-[100px]" />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Tiles</h3>
                  <Button size="sm" variant="ghost" className="text-primary rounded-full">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {profile.tiles.filter(t => t.type !== 'bio').map((tile) => (
                    <div key={tile.id} className="flex items-center gap-3 p-3 bg-muted/20 hover:bg-muted/40 transition-colors rounded-xl border group">
                      <GripVertical className="text-muted-foreground w-4 h-4 cursor-grab" />
                      <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center border text-[10px] font-bold">
                        {tile.size}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate capitalize">{tile.type} {tile.metadata?.brand || ''}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{tile.url || tile.metadata?.title || 'No metadata'}</p>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                        onClick={() => removeTile(tile.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Typography</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['headline', 'body', 'serif', 'mono'].map((f) => (
                    <Button 
                      key={f} 
                      variant={profile.theme.font === f ? 'default' : 'outline'}
                      className="rounded-xl capitalize h-10"
                      onClick={() => setProfile({ ...profile, theme: { ...profile.theme, font: f as any } })}
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Background</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setProfile({...profile, theme: {...profile.theme, background: 'white'}})}
                    className={cn("h-16 rounded-xl border-2 cursor-pointer bg-white", profile.theme.background === 'white' ? "border-primary" : "border-transparent")}
                  />
                  <div 
                    onClick={() => setProfile({...profile, theme: {...profile.theme, background: 'mesh'}})}
                    className={cn("h-16 rounded-xl border-2 cursor-pointer bg-gradient-mesh", profile.theme.background === 'mesh' ? "border-primary" : "border-transparent")}
                  />
                  <div 
                    onClick={() => setProfile({...profile, theme: {...profile.theme, background: 'gradient-blue'}})}
                    className={cn("h-16 rounded-xl border-2 cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600", profile.theme.background === 'gradient-blue' ? "border-primary" : "border-transparent")}
                  />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Public URL</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="bg-muted px-3 flex items-center rounded-l-xl text-xs font-medium text-muted-foreground border-y border-l">
                      connect.me/
                    </div>
                    <Input defaultValue={profile.username} className="rounded-r-xl h-10 border-l-0" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">This is your unique profile link.</p>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Right - Live Preview */}
        <main className="flex-1 bg-zinc-100 dark:bg-zinc-900 p-8 flex justify-center items-start overflow-y-auto">
          <div className={cn(
            "transition-all duration-500 bg-background shadow-2xl rounded-[3rem] overflow-hidden flex flex-col items-center py-12 px-6",
            view === 'desktop' ? "w-full max-w-4xl" : "w-[375px] h-[812px] scale-[0.9] origin-top",
            profile.theme.background === 'mesh' && 'bg-gradient-mesh',
            profile.theme.background === 'gradient-blue' && 'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
            profile.theme.font === 'headline' && 'font-headline',
            profile.theme.font === 'body' && 'font-body',
            profile.theme.font === 'serif' && 'font-serif',
            profile.theme.font === 'mono' && 'font-mono'
          )}>
            <div className="w-full space-y-8">
              {/* Header Preview */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-card/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/20">
                <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0">
                  <Image 
                    src={profile.avatarUrl} 
                    alt="Avatar" 
                    fill 
                    className="rounded-full object-cover border-4 border-white shadow-xl" 
                  />
                </div>
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-3xl font-bold">{profile.displayName}</h2>
                  <p className="text-muted-foreground">@{profile.username}</p>
                  <p className="text-sm leading-relaxed max-w-md">{profile.bio}</p>
                </div>
              </div>

              {/* Grid Preview */}
              <div className="bento-grid">
                {profile.tiles.filter(t => t.type !== 'bio').map((tile) => (
                  <TileRenderer key={tile.id} tile={tile} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
