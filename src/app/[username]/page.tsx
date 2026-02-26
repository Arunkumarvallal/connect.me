
"use client"

import React, { useEffect, useState } from 'react';
import { mockProfile } from '@/lib/mock-data';
import { TileRenderer } from '@/components/profile/tile-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link2, Share2, Quote, LayoutGrid, Monitor, Github, Smartphone } from 'lucide-react';
import { UserProfile } from '@/types/profile';

export default function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ username: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-zinc-950 font-body selection:bg-primary/10 relative pb-32">
      <div className="max-w-[1400px] mx-auto px-8 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24">
          
          {/* Left Side: Massive Typography Sidebar */}
          <aside className="md:w-[450px] space-y-12">
            <div className="md:sticky md:top-24 h-fit flex flex-col items-center md:items-start text-center md:text-left">
              <Avatar className="w-48 h-48 border-[10px] border-white dark:border-zinc-800 shadow-2xl mb-8">
                <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                <AvatarFallback>{profile.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="w-full space-y-8">
                <h1 className="text-8xl font-black font-headline tracking-tighter uppercase leading-none dark:text-white">
                  {profile.displayName} 
                  <span className="text-yellow-400">⚡️</span>
                </h1>
                <p className="text-3xl leading-relaxed font-medium whitespace-pre-wrap text-zinc-800 dark:text-zinc-300">
                  {profile.bio}
                </p>
              </div>

              {/* Bottom mini icons for aesthetic */}
              <div className="flex items-center gap-6 pt-16 opacity-10 dark:opacity-20">
                <LayoutGrid size={20} />
                <Monitor size={20} />
                <Github size={20} />
              </div>
            </div>
          </aside>

          {/* Right Side: Grid Section */}
          <main className="flex-1">
            <div className="bento-grid">
              {profile.tiles.map((tile) => (
                <TileRenderer key={tile.id} tile={tile} />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Action Bar (Limited version for public view) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black text-white px-2 py-2 rounded-full flex items-center gap-1 shadow-2xl border border-white/10">
           <button className="bg-[#4ADE80] text-black px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform">
             Share my Bento
           </button>
           <div className="w-px h-6 bg-white/20 mx-2" />
           <div className="flex items-center gap-1 px-2">
             <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><Link2 size={18} /></button>
             <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><Share2 size={18} /></button>
             <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><Quote size={18} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
