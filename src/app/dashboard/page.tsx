
"use client"

import React, { useState, useRef } from 'react';
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
  CaseSensitive, 
  Pencil, 
  Smartphone, 
  Monitor,
  Trash2,
  Edit2,
  Plus
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
  const [isRearranging, setIsRearranging] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

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

  // Drag and Drop Logic
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
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      {/* Navbar (Simplified for this version) */}
      <header className="h-20 border-b bg-white/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-black text-2xl font-headline tracking-tighter">Connect.me</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full px-6" asChild>
            <a href={`/${profile.username}`} target="_blank">Preview Live</a>
          </Button>
          <Button size="sm" className="rounded-full px-8 shadow-lg shadow-primary/20">Publish</Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full p-8 gap-12 mb-40">
        {/* Left: Bio Editor */}
        <aside className="md:w-[400px] space-y-8">
          <div className="bg-white rounded-[2.5rem] border p-8 shadow-sm space-y-6 sticky top-28">
            <div className="flex flex-col items-center space-y-4 pb-4">
              <div className="relative group cursor-pointer">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil size={20} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter">{profile.displayName}</h3>
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-headline uppercase tracking-tighter">
              {isRearranging ? "Reordering Tiles..." : "Your Grid"}
            </h2>
            {isRearranging && (
              <Button size="sm" variant="secondary" onClick={() => setIsRearranging(false)} className="rounded-full">Done</Button>
            )}
          </div>
          
          <div className={cn(
            "transition-all duration-500",
            view === 'mobile' ? "max-w-[375px] mx-auto scale-90 origin-top" : "w-full"
          )}>
            <div className="bento-grid">
              {profile.tiles.map((tile, index) => (
                <div
                  key={tile.id}
                  draggable={isRearranging}
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                  className={cn(
                    "transition-transform",
                    isRearranging && "cursor-move ring-2 ring-primary ring-offset-4 animate-pulse"
                  )}
                >
                  <TileRenderer 
                    tile={tile} 
                    isDashboard 
                    onRemove={removeTile}
                    onEdit={setEditingTile}
                    onQuickEdit={handleQuickEdit}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Floating UI Container */}
      <div className="fixed bottom-10 left-0 right-0 z-50 px-8 flex items-center justify-center">
        <div className="max-w-fit flex items-center gap-4">
          {/* Settings Button (Far Left) */}
          <button className="w-14 h-14 bg-white border border-black/5 shadow-xl rounded-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group">
            <Settings2 size={24} className="text-black/60 group-hover:text-black" />
          </button>

          {/* Main Pill Dock */}
          <div className="bg-white/90 backdrop-blur-2xl px-2 py-2 rounded-full flex items-center gap-1 shadow-2xl border border-black/5">
            {/* Share Pill */}
            <button className="bg-[#A855F7] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Share2 size={16} /> Share
            </button>

            <div className="flex items-center px-2">
              <button onClick={() => addTile('link')} className="p-3 text-black/50 hover:text-black transition-colors" title="Add Link"><Link2 size={18} /></button>
              <button onClick={() => addTile('image')} className="p-3 text-black/50 hover:text-black transition-colors" title="Add Image"><ImageIcon size={18} /></button>
              <button onClick={() => addTile('text')} className="p-3 text-black/50 hover:text-black transition-colors" title="Add Quote"><Quote size={18} /></button>
              <button onClick={() => addTile('text')} className="p-3 text-black/50 hover:text-black transition-colors" title="Add Heading"><Type size={18} /></button>
              <button onClick={() => addTile('text')} className="p-3 text-black/50 hover:text-black transition-colors" title="Add Text"><CaseSensitive size={18} /></button>
            </div>

            <div className="w-px h-6 bg-black/10 mx-1" />

            <div className="flex items-center px-2">
              {/* Rearrange Toggle */}
              <button 
                onClick={() => setIsRearranging(!isRearranging)} 
                className={cn("p-3 transition-colors", isRearranging ? "text-primary" : "text-black/50 hover:text-black")} 
                title="Rearrange Mode"
              >
                <Pencil size={18} />
              </button>
              
              {/* Device Toggle */}
              <button 
                onClick={() => setView(view === 'desktop' ? 'mobile' : 'desktop')} 
                className="p-3 text-black/50 hover:text-black transition-colors" 
                title={view === 'desktop' ? "Switch to Mobile View" : "Switch to Desktop View"}
              >
                {view === 'desktop' ? <Smartphone size={18} /> : <Monitor size={18} />}
              </button>
            </div>
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
