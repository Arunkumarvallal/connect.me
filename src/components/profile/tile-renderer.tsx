
"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Tile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { Github, Twitter, Linkedin, Instagram, Youtube, ExternalLink, Play, Disc } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TileRendererProps {
  tile: Tile;
  isDashboard?: boolean;
}

const SocialIcon = ({ brand, className }: { brand?: string, className?: string }) => {
  switch (brand?.toLowerCase()) {
    case 'x':
    case 'twitter': return <Twitter className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'youtube': return <Youtube className={className} />;
    case 'github': return <Github className={className} />;
    default: return <ExternalLink className={className} />;
  }
};

export function TileRenderer({ tile, isDashboard }: TileRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClass = `tile-${tile.size}`;

  const commonClasses = cn(
    "relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-none shadow-md rounded-[2rem]",
    sizeClass
  );

  switch (tile.type) {
    case 'social':
      return (
        <Card className={cn(commonClasses, "bg-card flex flex-col items-center justify-center p-4")}>
          <SocialIcon brand={tile.metadata?.brand} className="w-8 h-8 mb-2" />
          {tile.size !== '1x1' && <span className="text-sm font-medium">{tile.metadata?.username}</span>}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity">
            <ExternalLink size={14} />
          </div>
        </Card>
      );

    case 'image':
      return (
        <Card className={cn(commonClasses, "p-0")}>
          {tile.metadata?.imageUrl && (
            <Image 
              src={tile.metadata.imageUrl} 
              alt="Tile content" 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </Card>
      );

    case 'spotify':
      return (
        <Card className={cn(commonClasses, "bg-[#1DB954] text-white p-6 flex flex-col justify-between")}>
          <div className="flex justify-between items-start">
            <Disc className="animate-spin-slow w-8 h-8" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Now Playing</span>
          </div>
          <div className="flex items-end gap-4">
            {tile.metadata?.imageUrl && (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-xl shrink-0">
                <Image src={tile.metadata.imageUrl} alt="Album Art" fill className="object-cover" />
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="font-bold text-lg leading-tight line-clamp-2">{tile.metadata?.title}</h4>
              <p className="text-sm opacity-80 truncate">{tile.metadata?.description}</p>
            </div>
          </div>
        </Card>
      );

    case 'github':
      return (
        <Card className={cn(commonClasses, "bg-[#24292e] text-white p-6 flex flex-col justify-between")}>
          <div className="flex justify-between items-start">
            <Github className="w-8 h-8" />
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold">128</span>
              <span className="text-[10px] uppercase opacity-60">Contributions</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold">{tile.metadata?.username}</h4>
            <p className="text-sm opacity-60">{tile.metadata?.description}</p>
          </div>
          <div className="flex gap-1 mt-2">
            {[...Array(15)].map((_, i) => {
              // Deterministic values for SSR, random for client to avoid hydration mismatch
              const opacity = mounted ? (0.2 + Math.random() * 0.8) : (0.2 + (i * 0.05) % 0.8);
              return (
                <div 
                  key={i} 
                  className="w-2 h-2 rounded-sm" 
                  style={{ backgroundColor: `rgba(45, 186, 78, ${opacity})` }} 
                />
              );
            })}
          </div>
        </Card>
      );

    case 'youtube':
      return (
        <Card className={cn(commonClasses, "bg-white p-6 flex flex-col justify-between")}>
          <div className="flex justify-between items-start">
            <div className="w-10 h-7 bg-red-600 rounded flex items-center justify-center">
              <Play className="text-white w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold">12.4k</span>
              <span className="text-[10px] uppercase text-muted-foreground">Subscribers</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold">{tile.metadata?.username}</h4>
            <p className="text-sm text-muted-foreground">{tile.metadata?.description}</p>
          </div>
        </Card>
      );

    case 'text':
      return (
        <Card className={cn(commonClasses, "p-6 flex flex-col justify-center")}>
          <h4 className="font-bold text-lg mb-2">{tile.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-3">{tile.content}</p>
        </Card>
      );

    case 'bio':
      return null; // Handle Bio separately in the page layout

    default:
      return <Card className={commonClasses}>Tile {tile.id}</Card>;
  }
}
