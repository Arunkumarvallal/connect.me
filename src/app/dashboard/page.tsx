
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
  Moon,
  Camera,
  Pencil
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tile, TileType, TileSize, UserProfile } from '@/types/profile';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [quickEditMode, setQuickEditMode] = useState<'title' | 'image' | 'video' | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
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

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 270) {
      setProfile({ ...profile, bio: val });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-zinc-950 transition-colors duration-300 flex flex-col selection:bg-purple-100 dark:selection:bg-purple-900/30">
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
        {/* Profile Sidebar */}
        <aside className="md:w-[450px] space-y-8">
          <div className="space-y-12 sticky top-28 flex flex-col items-center md:items-start">
            
            {/* Bigger Avatar */}
            <div 
              className="relative group cursor-pointer"
              onClick={() => setIsAvatarDialogOpen(true)}
            >
              <Avatar className="w-48 h-48 border-[10px] border-white dark:border-zinc-800 shadow-2xl transition-transform group-hover:scale-105">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="flex flex-col items-center gap-2">
                   <Camera className="text-white w-8 h-8" />
                   <span className="text-white text-[10px] font-bold uppercase tracking-widest">Edit Photo</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-6">
              {/* Massive Name */}
              <div className="relative group/name w-full">
                <Input 
                  value={profile.displayName} 
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="text-7xl font-black font-headline tracking-tighter uppercase dark:text-white border-none shadow-none focus-visible:ring-0 px-0 h-auto bg-transparent w-full transition-colors group-hover/name:bg-black/5 dark:group-hover/name:bg-white/5 rounded-lg leading-none"
                  placeholder=""
                />
              </div>

              {/* Big Bio: No scroll, massive font */}
              <div className="space-y-4">
                 <Textarea 
                  value={profile.bio} 
                  onChange={handleBioChange}
                  placeholder=""
                  className="text-2xl leading-relaxed font-medium dark:text-zinc-300 border-none shadow-none focus-visible:ring-0 px-0 resize-none bg-transparent w-full h-auto overflow-hidden transition-colors hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-2"
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
                <div className="flex items-center justify-end px-2">
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    profile.bio.length >= 260 ? "text-red-500" : "text-muted-foreground/30"
                  )}>
                    {profile.bio.length}/270
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Grid Editor */}
        <main className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-headline uppercase tracking-tighter dark:text-white">
              Grid Editor
            </h2>
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

      {/* Control Dock */}
      <div className="fixed bottom-10 left-0 right-0 z-50 px-8 flex items-center justify-center pointer-events-none">
        <div className="max-w-fit flex items-center gap-4 pointer-events-auto">
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

      {/* Modals */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="rounded-[2.5rem] dark:bg-zinc-900 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter dark:text-white">
              Update Profile Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="dark:text-zinc-400">Image URL</Label>
              <Input 
                value={profile.avatarUrl} 
                onChange={(e) => setProfile({...profile, avatarUrl: e.target.value})}
                className="rounded-xl dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="https://..."
              />
            </div>
            <Button className="w-full rounded-full h-12 mt-4" onClick={() => setIsAvatarDialogOpen(false)}>Save Photo</Button>
          </div>
        </DialogContent>
      </Dialog>

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
