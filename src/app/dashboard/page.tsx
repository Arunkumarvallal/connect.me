
"use client"

import React, { useState } from 'react';
import Image from 'next/image';
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
  GripVertical, 
  Trash2, 
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
  Link as LinkIcon
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tile, TileType, TileSize } from '@/types/profile';

export default function Dashboard() {
  const [profile, setProfile] = useState(mockProfile);
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  const [editingTile, setEditingTile] = useState<Tile | null>(null);

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
      title: type === 'image' ? 'New Banner' : undefined,
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
          <div className="bg-white rounded-[2.5rem] border p-8 shadow-sm space-y-6">
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
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Apple-style Dock */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2.5rem] p-4 flex items-center gap-4">
          <button onClick={() => addTile('social', { brand: 'LinkedIn' })} className="dock-item" title="Add LinkedIn">
            <div className="w-12 h-12 bg-[#0077b5] rounded-2xl flex items-center justify-center text-white shadow-lg"><Linkedin size={20} /></div>
            <span className="text-[10px] font-bold">LinkedIn</span>
          </button>
          <button onClick={() => addTile('discord')} className="dock-item" title="Add Discord">
            <div className="w-12 h-12 bg-[#5865F2] rounded-2xl flex items-center justify-center text-white shadow-lg"><MessageCircle size={20} /></div>
            <span className="text-[10px] font-bold">Discord</span>
          </button>
          <button onClick={() => addTile('luma')} className="dock-item" title="Add Luma">
            <div className="w-12 h-12 bg-luma rounded-2xl flex items-center justify-center text-white shadow-lg"><Disc size={20} /></div>
            <span className="text-[10px] font-bold">Luma</span>
          </button>
          <button onClick={() => addTile('instagram')} className="dock-item" title="Add Instagram">
            <div className="w-12 h-12 bg-instagram rounded-2xl flex items-center justify-center text-white shadow-lg"><Instagram size={20} /></div>
            <span className="text-[10px] font-bold">Insta</span>
          </button>
          <button onClick={() => addTile('whatsapp')} className="dock-item" title="Add WhatsApp">
            <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg"><MessageCircle size={20} /></div>
            <span className="text-[10px] font-bold">WA</span>
          </button>
          <div className="w-[1px] h-8 bg-black/10 mx-2" />
          <button onClick={() => addTile('image')} className="dock-item" title="Add Banner">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-500 border border-black/5 shadow-sm hover:bg-zinc-200"><ImageIcon size={20} /></div>
            <span className="text-[10px] font-bold">Banner</span>
          </button>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingTile && (
        <Dialog open={!!editingTile} onOpenChange={() => setEditingTile(null)}>
          <DialogContent className="rounded-[2.5rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Edit Tile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title / Banner Text</Label>
                <Input 
                  value={editingTile.title || ''} 
                  onChange={(e) => setEditingTile({...editingTile, title: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Content / Description</Label>
                <Textarea 
                  value={editingTile.content || ''} 
                  onChange={(e) => setEditingTile({...editingTile, content: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <div className="grid grid-cols-4 gap-2">
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
              <Button className="w-full rounded-full h-12 mt-4" onClick={() => updateTile(editingTile)}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
