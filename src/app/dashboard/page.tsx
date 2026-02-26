
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { mockProfile } from '@/lib/mock-data';
import { TileRenderer } from '@/components/profile/tile-renderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings2, 
  Share2, 
  Link2, 
  ImageIcon, 
  Quote, 
  Type, 
  Smartphone, 
  Monitor,
  Video,
  Sun,
  Moon
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const removeTile = (id: string) => {
    setProfile({
      ...profile,
      tiles: profile.tiles.filter(t => t.id !== id)
    });
  };

  const handleSizeChange = (id: string, size: TileSize) => {
    setProfile({
      ...profile,
      tiles: profile.tiles.map(t => t.id === id ? { ...t, size } : t)
    });
  };

  const addTile = (type: TileType, metadata: any = {}) => {
    const newTile: Tile = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      size: '1x1',
      title: type === 'image' ? 'New Visual' : (type === 'video' ? 'New Video' : undefined),
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

  const handleSort = () => {
    const _tiles = [...profile.tiles];
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const draggedItemContent = _tiles.splice(dragItem.current, 1)[0];
      _tiles.splice(dragOverItem.current, 0, draggedItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setProfile({ ...profile, tiles: _tiles });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-zinc-950 transition-colors duration-300 flex flex-col">
      <header className="h-20 border-b dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-black text-2xl font-headline tracking-tighter dark:text-white">Connect.me</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full px-6 dark:border-zinc-700" asChild>
            <a href={`/${profile.username}`} target="_blank">Preview Live</a>
          </Button>
          <Button size="sm" className="rounded-full px-8 shadow-lg shadow-primary/20">Publish</Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full p-8 gap-12 mb-40">
        <aside className="md:w-[400px] space-y-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm space-y-6 sticky top-28 border-none">
            <div className="flex flex-col items-center space-y-4 pb-4">
              <div className="relative group cursor-pointer">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-zinc-800 shadow-xl">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white">{profile.displayName}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-zinc-500">Display Name</Label>
                <Input 
                  value={profile.displayName} 
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="rounded-2xl h-12 text-xl font-black uppercase tracking-tighter dark:bg-zinc-800 border-none shadow-none focus-visible:ring-0 px-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-zinc-500">Biography</Label>
                <Textarea 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="rounded-2xl min-h-[120px] leading-relaxed font-medium dark:bg-zinc-800 border-none shadow-none focus-visible:ring-0 px-0 resize-none"
                />
                <p className="text-[10px] font-bold text-muted-foreground/40 text-right uppercase tracking-widest">
                  {profile.bio.length}/280 characters
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-headline uppercase tracking-tighter dark:text-white">
              Your Grid
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              Drag tiles to rearrange • Hover to resize
            </p>
          </div>
          
          <div className={cn(
            "transition-all duration-500",
            view === 'mobile' ? "max-w-[375px] mx-auto scale-90 origin-top" : "w-full"
          )}>
            <div className="bento-grid">
              {profile.tiles.map((tile, index) => (
                <div
                  key={tile.id}
                  draggable
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                  className="transition-all duration-300 cursor-grab active:cursor-grabbing"
                >
                  <TileRenderer 
                    tile={tile} 
                    isDashboard 
                    onRemove={removeTile}
                    onEdit={setEditingTile}
                    onQuickEdit={handleQuickEdit}
                    onSizeChange={handleSizeChange}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-10 left-0 right-0 z-50 px-8 flex items-center justify-center">
        <div className="max-w-fit flex items-center gap-4">
          <button className="w-14 h-14 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group">
            <Settings2 size={24} className="text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white" />
          </button>

          <div className="bg-black text-white px-2 py-2 rounded-full flex items-center gap-1 shadow-2xl border border-white/10">
            <button className="bg-[#A855F7] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Share2 size={16} /> Share
            </button>

            <div className="flex items-center px-2">
              <button onClick={() => addTile('link')} className="p-3 text-white/50 hover:text-white transition-colors" title="Add Link"><Link2 size={18} /></button>
              <button onClick={() => addTile('image')} className="p-3 text-white/50 hover:text-white transition-colors" title="Add Image"><ImageIcon size={18} /></button>
              <button onClick={() => addTile('text')} className="p-3 text-white/50 hover:text-white transition-colors" title="Add Quote"><Quote size={18} /></button>
              <button onClick={() => addTile('text')} className="p-3 text-white/50 hover:text-white transition-colors" title="Add Heading"><Type size={18} /></button>
              <button onClick={() => addTile('video')} className="p-3 text-white/50 hover:text-white transition-colors" title="Add Video"><Video size={18} /></button>
            </div>

            <div className="w-px h-6 bg-white/10 mx-1" />

            <div className="flex items-center px-2">
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
                className="p-3 text-white/50 hover:text-white transition-colors" 
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              
              <button 
                onClick={() => setView(view === 'desktop' ? 'mobile' : 'desktop')} 
                className="p-3 text-white/50 hover:text-white transition-colors" 
              >
                {view === 'desktop' ? <Smartphone size={18} /> : <Monitor size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingTile && (
        <Dialog open={!!editingTile} onOpenChange={() => { setEditingTile(null); setQuickEditMode(null); }}>
          <DialogContent className="rounded-[2.5rem] dark:bg-zinc-900 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter dark:text-white">
                {quickEditMode ? `Quick Edit: ${quickEditMode}` : 'Edit Tile'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {(!quickEditMode || quickEditMode === 'title') && (
                <div className="space-y-2">
                  <Label className="dark:text-zinc-400">Title / Heading</Label>
                  <Input 
                    value={editingTile.title || ''} 
                    onChange={(e) => setEditingTile({...editingTile, title: e.target.value})}
                    className="rounded-xl dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="Enter heading..."
                  />
                </div>
              )}
              {(!quickEditMode) && (
                <div className="space-y-2">
                  <Label className="dark:text-zinc-400">Content / Description</Label>
                  <Textarea 
                    value={editingTile.content || ''} 
                    onChange={(e) => setEditingTile({...editingTile, content: e.target.value})}
                    className="rounded-xl dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="Enter description..."
                  />
                </div>
              )}
              {(!quickEditMode || quickEditMode === 'image' || quickEditMode === 'video') && (
                <div className="space-y-2">
                  <Label className="dark:text-zinc-400">{quickEditMode === 'video' ? 'Video URL' : 'Image URL'}</Label>
                  <Input 
                    value={editingTile.metadata?.imageUrl || editingTile.metadata?.videoUrl || ''} 
                    onChange={(e) => setEditingTile({
                      ...editingTile, 
                      metadata: { ...editingTile.metadata, [quickEditMode === 'video' ? 'videoUrl' : 'imageUrl']: e.target.value }
                    })}
                    className="rounded-xl dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="https://..."
                  />
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
