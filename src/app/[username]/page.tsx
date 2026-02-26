
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
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row gap-16">
        {/* Left Side: Bio & Profile */}
        <div className="md:w-[400px] md:sticky md:top-24 h-fit space-y-8 flex flex-col items-center text-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-full scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
            <Avatar className="w-56 h-56 border-8 border-white shadow-2xl relative">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
              <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            {/* Floating badges like in the image */}
            <div className="absolute -top-4 -right-4 bg-white shadow-lg rounded-2xl px-4 py-2 text-sm font-bold border border-black/5 flex items-center gap-2">
              👋 Welcome!
            </div>
            <div className="absolute top-12 -left-8 bg-white shadow-lg rounded-2xl px-4 py-2 text-xs font-bold border border-black/5 flex items-center gap-2">
              📍 Based in Chennai
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-black font-headline tracking-tighter uppercase">{profile.displayName}</h1>
            <p className="text-muted-foreground text-lg max-w-sm leading-relaxed font-medium">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Right Side: Bento Grid */}
        <div className="flex-1 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-headline">Socials</h2>
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
