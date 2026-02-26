
"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { mockProfile } from '@/lib/mock-data';
import { TileRenderer } from '@/components/profile/tile-renderer';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ username: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) return null;

  const profile = mockProfile;

  return (
    <div className="min-h-screen bg-white font-body selection:bg-primary/10">
      <div className="max-w-[800px] mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        
        {/* Profile Header: Centered like the screenshot */}
        <div className="w-full flex flex-col items-center text-center space-y-8 mb-16">
          <div className="relative">
            {/* Main Avatar */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-full scale-95 transition-all duration-500" />
              <Avatar className="w-48 h-48 border-8 border-white shadow-2xl relative">
                <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              
              {/* Floating badges from screenshot */}
              <div className="absolute -top-4 -right-8 bg-white shadow-xl rounded-2xl px-4 py-2 text-sm font-bold border border-black/5 flex items-center gap-2 whitespace-nowrap">
                👋 Welcome!
              </div>
              <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-white shadow-xl rounded-2xl px-4 py-2 text-xs font-bold border border-black/5 flex items-center gap-2 whitespace-nowrap">
                <span className="text-red-500">📍</span> Based in {profile.location || 'Chennai'}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white shadow-lg rounded-full p-2 border border-black/5">
                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
                   <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-500 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 max-w-xl">
            <h1 className="text-5xl md:text-6xl font-black font-headline tracking-tighter uppercase">{profile.displayName}</h1>
            <div className="space-y-4">
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="w-full space-y-8">
          <div className="flex items-center">
            <h2 className="text-2xl font-black font-headline tracking-tight">Socials</h2>
          </div>
          <div className="bento-grid">
            {profile.tiles.map((tile) => (
              <TileRenderer key={tile.id} tile={tile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
