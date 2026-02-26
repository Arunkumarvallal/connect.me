
"use client"

import React, { useState } from 'react';
import { mockProfile } from '@/lib/mock-data';
import { TileRenderer } from '@/components/profile/tile-renderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Settings, 
  Palette, 
  Layout, 
  Eye, 
  Monitor,
  Smartphone,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  Image as ImageIcon,
  Type,
  Disc,
  Link as LinkIcon,
  Video,
  Share2,
  Quote,
  LayoutGrid
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tile, TileType, TileSize } from '@/types/profile';

export default function Dashboard() {
  const [profile, setProfile] = useState(mockProfile);
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [quickEditMode, setQuickEditMode] = useState<'title' | 'image' | 'video' | null>(null);

  const removeTile = (id: string) => {
    setProfile({
      ...profile,
      tiles: profile.tiles.filter(t => t.id !== id)
    });
  };

  const addTile = (type: TileType, metadata: any = {}) => {
    const newTile: Tile = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      size: '1x1',
      title: type === 'image' ? 'New Visual' : undefined,
      metadata: { ...metadata }
    };
    setProfile({ ...profile, tiles: [...profile.tiles, newTile] });
  };

  const updateTile = (updated: Tile) => {
    setProfile({
      ...profile,
      tiles: profile.tiles.map(t => t.id === updated.id ? updated : t)
    });
    setEditingTile(null);
    setQuickEditMode(null);
  };

  const handleQuickEdit = (tile: Tile, mode: 'title' | 'image' | 'video') => {
    setEditingTile(tile);
    setQuickEditMode(mode);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      {/* Navbar */}
      <header className="h-20 border-b bg-white/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-black text-2xl font-headline tracking-tighter">Connect.me</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-muted/50 rounded-full p-1 border">
            <Button 
              variant={view === 'desktop' ? "secondary" : "ghost"} 
              size="sm" 
              className="rounded-full h-8 px-4"
              onClick={() => setView('desktop')}
            >
              <Monitor size={14} className="mr-2" /> Desktop
            </Button>
            <Button 
              variant={view === 'mobile' ? "secondary" : "ghost"} 
              size="sm" 
              className="rounded-full h-8 px-4"
              onClick={() => setView('mobile')}
            >
              <Smartphone size={14} className="mr-2" /> Mobile
            </Button>
          </div>
          <Button variant="outline" size="sm" className="rounded-full px-6" asChild>
            <a href={`/${profile.username}`} target="_blank"><Eye size={16} className="mr-2" /> Preview</a>
          </Button>
          <Button size="sm" className="rounded-full px-8 shadow-lg shadow-primary/20">Publish</Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full p-8 gap-12 mb-32">
        {/* Left: Bio Editor */}
        <aside className="md:w-[400px] space-y-8">
          <div className="bg-white rounded-[2.5rem] border p-8 shadow-sm space-y-6 sticky top-28">
            <div className="flex flex-col items-center space-y-4 pb-4">
              <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="rounded-full text-xs">Change Photo</Button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Display Name</Label>
                <Input 
                  value={profile.displayName} 
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="rounded-2xl h-12 text-xl font-black uppercase tracking-tighter"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Biography</Label>
                <Textarea 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="rounded-2xl min-h-[120px] leading-relaxed font-medium"
                />
                <p className="text-[10px] font-bold text-muted-foreground/40 text-right uppercase tracking-widest">
                  {profile.bio.length}/280 characters
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Grid Editor */}
        <main className="flex-1 space-y-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black font-headline uppercase tracking-tighter">Your Grid</h2>
          </div>
          
          <div className={cn(
            "transition-all duration-500",
            view === 'mobile' ? "max-w-[375px] mx-auto scale-90 origin-top" : "w-full"
          )}>
            <div className="bento-grid">
              {profile.tiles.map((tile) => (
                <TileRenderer 
                  key={tile.id} 
                  tile={tile} 
                  isDashboard 
                  onRemove={removeTile}
                  onEdit={setEditingTile}
                  onQuickEdit={handleQuickEdit}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Bar (Apple-style Dock for Adding) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black text-white px-2 py-2 rounded-full flex items-center gap-1 shadow-2xl border border-white/10">
           <button className="bg-[#4ADE80] text-black px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 hover:scale-105 transition-transform">
             ADD NEW TILE
           </button>
           <div className="w-px h-6 bg-white/20 mx-1" />
           <div className="flex items-center">
             <button onClick={() => addTile('text')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Add Text"><Type size={16} /></button>
             <button onClick={() => addTile('image')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Add Image"><ImageIcon size={16} /></button>
             <button onClick={() => addTile('video')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Add Video"><Video size={16} /></button>
             <button onClick={() => addTile('social', { brand: 'LinkedIn' })} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Add LinkedIn"><Linkedin size={16} /></button>
             <button onClick={() => addTile('social', { brand: 'Twitter' })} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Add Twitter"><Twitter size={16} /></button>
           </div>
           <div className="w-px h-6 bg-white/20 mx-1" />
           <div className="flex items-center gap-1">
             <button onClick={() => addTile('map')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Add Map"><LayoutGrid size={16} /></button>
             <button onClick={() => addTile('email')} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Add Email"><div className="w-4 h-4 bg-white/20 rounded-sm" /></button>
           </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingTile && (
        <Dialog open={!!editingTile} onOpenChange={() => { setEditingTile(null); setQuickEditMode(null); }}>
          <DialogContent className="rounded-[2.5rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                {quickEditMode ? `Quick Edit: ${quickEditMode}` : 'Edit Tile'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {(!quickEditMode || quickEditMode === 'title') && (
                <div className="space-y-2">
                  <Label>Title / Heading</Label>
                  <Input 
                    value={editingTile.title || ''} 
                    onChange={(e) => setEditingTile({...editingTile, title: e.target.value})}
                    className="rounded-xl"
                    placeholder="Enter heading..."
                  />
                </div>
              )}
              {(!quickEditMode) && (
                <div className="space-y-2">
                  <Label>Content / Description</Label>
                  <Textarea 
                    value={editingTile.content || ''} 
                    onChange={(e) => setEditingTile({...editingTile, content: e.target.value})}
                    className="rounded-xl"
                    placeholder="Enter description..."
                  />
                </div>
              )}
              {(!quickEditMode || quickEditMode === 'image') && (
                <div className="space-y-2">
                  <Label>Image URL / GIF Link</Label>
                  <Input 
                    value={editingTile.metadata?.imageUrl || ''} 
                    onChange={(e) => setEditingTile({
                      ...editingTile, 
                      metadata: { ...editingTile.metadata, imageUrl: e.target.value }
                    })}
                    className="rounded-xl"
                    placeholder="https://..."
                  />
                </div>
              )}
              {(!quickEditMode || quickEditMode === 'video') && (
                <div className="space-y-2">
                  <Label>Video URL (Direct link to .mp4)</Label>
                  <Input 
                    value={editingTile.metadata?.videoUrl || ''} 
                    onChange={(e) => setEditingTile({
                      ...editingTile, 
                      metadata: { ...editingTile.metadata, videoUrl: e.target.value }
                    })}
                    className="rounded-xl"
                    placeholder="https://..."
                  />
                </div>
              )}
              {!quickEditMode && (
                <div className="space-y-2">
                  <Label>Size</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['1x1', '2x1', '1x2', '2x2', '3x1'] as TileSize[]).map((s) => (
                      <Button 
                        key={s} 
                        size="sm" 
                        variant={editingTile.size === s ? 'default' : 'outline'}
                        onClick={() => setEditingTile({...editingTile, size: s})}
                        className="rounded-lg text-[10px]"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Button className="w-full rounded-full h-12 mt-4" onClick={() => updateTile(editingTile)}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
