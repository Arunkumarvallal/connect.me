
"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Tile } from '@/types/profile';
import { cn } from '@/lib/utils';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube, 
  ExternalLink, 
  Play, 
  Disc, 
  MessageCircle, 
  Link as LinkIcon,
  Trash2,
  Edit2,
  Type,
  ImageIcon,
  Video
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TileRendererProps {
  tile: Tile;
  isDashboard?: boolean;
  onRemove?: (id: string) => void;
  onEdit?: (tile: Tile) => void;
  onQuickEdit?: (tile: Tile, mode: 'title' | 'image' | 'video') => void;
}

const SocialIcon = ({ brand, className }: { brand?: string, className?: string }) => {
  switch (brand?.toLowerCase()) {
    case 'x':
    case 'twitter': return <Twitter className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'youtube': return <Youtube className={className} />;
    case 'github': return <Github className={className} />;
    case 'whatsapp': return <MessageCircle className={className} />;
    default: return <LinkIcon className={className} />;
  }
};

export function TileRenderer({ tile, isDashboard, onRemove, onEdit, onQuickEdit }: TileRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClass = `tile-${tile.size}`;

  const commonClasses = cn(
    "relative overflow-hidden group transition-all duration-500 hover:shadow-2xl rounded-[2.5rem] border border-black/5 min-h-[140px]",
    sizeClass
  );

  const EditOverlay = () => isDashboard && (
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10 backdrop-blur-sm">
      <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={() => onEdit?.(tile)}>
        <Edit2 size={16} />
      </Button>
      <Button size="icon" variant="destructive" className="rounded-full shadow-lg" onClick={() => onRemove?.(tile.id)}>
        <Trash2 size={16} />
      </Button>
    </div>
  );

  const QuickActions = () => isDashboard && (
    <div className="absolute top-4 left-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button 
        size="icon" 
        variant="secondary" 
        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur"
        onClick={(e) => { e.stopPropagation(); onQuickEdit?.(tile, 'title'); }}
      >
        <Type size={14} />
      </Button>
      <Button 
        size="icon" 
        variant="secondary" 
        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur"
        onClick={(e) => { e.stopPropagation(); onQuickEdit?.(tile, 'image'); }}
      >
        <ImageIcon size={14} />
      </Button>
      <Button 
        size="icon" 
        variant="secondary" 
        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur"
        onClick={(e) => { e.stopPropagation(); onQuickEdit?.(tile, 'video'); }}
      >
        <Video size={14} />
      </Button>
    </div>
  );

  const renderContent = () => {
    if (tile.metadata?.videoUrl) {
      return (
        <video 
          src={tile.metadata.videoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        />
      );
    }
    if (tile.metadata?.imageUrl) {
      return (
        <div className="relative w-full h-full">
          <Image 
            src={tile.metadata.imageUrl} 
            alt={tile.title || "Tile image"} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      );
    }
    return null;
  };

  switch (tile.type) {
    case 'social':
      const isLinkedIn = tile.metadata?.brand?.toLowerCase() === 'linkedin';
      return (
        <Card className={cn(commonClasses, isLinkedIn ? "bg-white" : "bg-muted/30", "flex flex-col items-center justify-center p-6")}>
          <QuickActions />
          <EditOverlay />
          <div className="flex flex-col items-center gap-2">
            <SocialIcon brand={tile.metadata?.brand} className={cn("w-12 h-12", isLinkedIn ? "text-[#0077b5]" : "text-foreground")} />
            {tile.size !== '1x1' && <span className="text-sm font-bold opacity-60 tracking-tight">{tile.metadata?.brand}</span>}
          </div>
          <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <ExternalLink size={16} />
          </div>
        </Card>
      );

    case 'luma':
      return (
        <Card className={cn(commonClasses, "bg-luma text-white p-8 flex flex-col items-center justify-center")}>
          <QuickActions />
          <EditOverlay />
          <h3 className="text-4xl font-black italic tracking-tighter">luma</h3>
          <div className="absolute top-4 right-4">
            <Disc className="w-5 h-5 animate-spin-slow" />
          </div>
        </Card>
      );

    case 'discord':
      return (
        <Card className={cn(commonClasses, "bg-[#5865F2] text-white p-6 flex flex-col items-center justify-center")}>
          <QuickActions />
          <EditOverlay />
          <div className="flex items-center gap-3">
            <MessageCircle className="w-10 h-10 fill-white" />
            <span className="text-2xl font-bold font-headline">Discord</span>
          </div>
        </Card>
      );

    case 'whatsapp':
      return (
        <Card className={cn(commonClasses, "bg-[#25D366] text-white p-6 flex flex-col items-center justify-center")}>
          <QuickActions />
          <EditOverlay />
          <MessageCircle className="w-16 h-16 fill-white" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full whitespace-nowrap">
            <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp Community</span>
          </div>
        </Card>
      );

    case 'instagram':
      return (
        <Card className={cn(commonClasses, "bg-instagram text-white p-6 flex flex-col items-center justify-center")}>
          <QuickActions />
          <EditOverlay />
          <Instagram className="w-14 h-14" />
        </Card>
      );

    case 'image':
    case 'video':
      return (
        <Card className={cn(commonClasses, "p-0")}>
          <QuickActions />
          <EditOverlay />
          {renderContent()}
          {(tile.title || tile.content) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
              <h4 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">{tile.title}</h4>
              <p className="text-xs font-medium opacity-80 uppercase tracking-widest">{tile.content}</p>
            </div>
          )}
        </Card>
      );

    case 'github':
      return (
        <Card className={cn(commonClasses, "bg-black text-white p-8 flex flex-col justify-between")}>
          <QuickActions />
          <EditOverlay />
          <div className="flex justify-between items-start">
            <Github className="w-10 h-10" />
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold opacity-60">GitHub</span>
            </div>
          </div>
          <div className="mt-auto bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md text-center">
            <span className="text-sm font-bold">@{tile.metadata?.username || 'user'}</span>
          </div>
        </Card>
      );

    case 'youtube':
      return (
        <Card className={cn(commonClasses, "bg-white flex flex-col items-center justify-center p-6")}>
          <QuickActions />
          <EditOverlay />
          <div className="flex items-center gap-3">
            <Youtube className="w-10 h-10 text-red-600 fill-red-600" />
            <span className="text-2xl font-bold font-headline text-black">YouTube</span>
          </div>
        </Card>
      );

    default:
      return (
        <Card className={cn(commonClasses, "bg-white p-6 flex flex-col justify-center")}>
          <QuickActions />
          <EditOverlay />
          <div className="space-y-2">
            <h4 className="font-black uppercase tracking-tighter text-xl">{tile.title || 'New Tile'}</h4>
            <p className="text-sm font-medium text-muted-foreground leading-snug">{tile.content}</p>
          </div>
        </Card>
      );
  }
}
