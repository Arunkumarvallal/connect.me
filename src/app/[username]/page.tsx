
"use client"

import React, { useEffect, useState } from 'react';
import { mockProfile } from '@/lib/mock-data';
import { TileRenderer } from '@/components/profile/tile-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link2, Share2, Quote, LayoutGrid, Monitor, Github, Smartphone } from 'lucide-react';

export default function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ username: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) return null;

  const profile = mockProfile;

  return (
    <div className="min-h-screen bg-white font-body selection:bg-primary/10 relative pb-32">
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Side: Massive Typography */}
          <div className="md:w-1/3 space-y-8 md:sticky md:top-24 h-fit">
            <div className="space-y-8">
              <Avatar className="w-48 h-48 border-[10px] border-white shadow-2xl">
                <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-6">
                <h1 className="text-7xl font-black font-headline tracking-tighter uppercase leading-none">
                  {profile.displayName} 
                  <span className="text-yellow-400">⚡️</span>
                </h1>
                <p className="text-2xl leading-relaxed font-medium whitespace-pre-wrap text-zinc-800">
                  {profile.bio}
                </p>
              </div>
            </div>

            {/* Bottom mini icons */}
            <div className="flex items-center gap-6 pt-12 opacity-30">
              <button className="hover:opacity-100 transition-opacity"><LayoutGrid size={18} /></button>
              <button className="hover:opacity-100 transition-opacity"><Monitor size={18} /></button>
              <button className="hover:opacity-100 transition-opacity"><Github size={18} /></button>
            </div>
          </div>

          {/* Right Side: Grid Section */}
          <div className="flex-1 space-y-12">
            <div className="bento-grid">
              {profile.tiles.filter(t => t.id !== 'help-text' && t.id !== 'email-1').map((tile) => (
                <TileRenderer key={tile.id} tile={tile} />
              ))}
            </div>

            {/* Section: How can I help? */}
            <div className="space-y-6">
              <h2 className="text-sm font-bold opacity-60 px-2">How can I help? ⚡️</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {profile.tiles.filter(t => t.id === 'help-text' || t.id === 'email-1').map((tile) => (
                  <TileRenderer key={tile.id} tile={tile} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black text-white px-2 py-2 rounded-full flex items-center gap-1 shadow-2xl border border-white/10">
           <button className="bg-[#4ADE80] text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform">
             Share my Bento
           </button>
           <div className="w-px h-6 bg-white/20 mx-1" />
           <div className="flex items-center">
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Link2 size={16} /></button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Share2 size={16} /></button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Quote size={16} /></button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Monitor size={16} /></button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><div className="w-5 h-5 bg-white/10 rounded-sm" /></button>
           </div>
           <div className="w-px h-6 bg-white/20 mx-1" />
           <div className="flex items-center gap-1">
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Monitor size={16} /></button>
             <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Smartphone size={16} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
