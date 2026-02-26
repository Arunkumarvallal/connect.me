
"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { mockProfile } from '@/lib/mock-data';
import { TileRenderer } from '@/components/profile/tile-renderer';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Share2, Plus } from 'lucide-react';

export default function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ username: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) return null;

  const profile = mockProfile; // In a real app, fetch by username

  const fontClass = cn({
    'font-body': profile.theme.font === 'body',
    'font-headline': profile.theme.font === 'headline',
    'font-serif': profile.theme.font === 'serif',
    'font-mono': profile.theme.font === 'mono',
  });

  const bgClass = cn({
    'bg-white': profile.theme.background === 'white',
    'bg-gradient-mesh': profile.theme.background === 'mesh',
    'bg-gradient-to-br from-blue-500 to-purple-600': profile.theme.background === 'gradient-blue',
  });

  return (
    <div className={cn("min-h-screen py-12 px-6 flex flex-col items-center", bgClass, fontClass)}>
      <div className="max-w-4xl w-full space-y-8">
        {/* Header/Bio Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-card/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/20">
          <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-2xl">
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
            <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold font-headline">{profile.displayName}</h1>
              <p className="text-muted-foreground text-lg">@{profile.username}</p>
            </div>
            <p className="text-lg leading-relaxed max-w-xl">{profile.bio}</p>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Button size="sm" className="rounded-full px-6 shadow-lg">
                Follow
              </Button>
              <Button size="icon" variant="outline" className="rounded-full shadow-sm bg-white/50 backdrop-blur">
                <Share2 size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {profile.tiles.filter(t => t.type !== 'bio').map((tile) => (
            <TileRenderer key={tile.id} tile={tile} />
          ))}
        </div>

        {/* CTA Footer */}
        <div className="flex flex-col items-center pt-12 space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Create your own Bento profile</p>
          <Button variant="outline" className="rounded-full bg-white/50 backdrop-blur px-8 h-12 shadow-sm border-white/40">
            <Plus className="mr-2 h-4 w-4" /> Connect.me
          </Button>
        </div>
      </div>
    </div>
  );
}
