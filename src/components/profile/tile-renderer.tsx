
"use client"

import React from 'react';
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
  MessageCircle, 
  Link as LinkIcon,
  Trash2,
  Edit2,
  Type,
  ImageIcon,
  Video,
  ArrowUpRight,
  Smile
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
    case 'adplist': return <Smile className={className} />;
    default: return <LinkIcon className={className} />;
  }
};

export function TileRenderer({ tile, isDashboard, onRemove, onEdit, onQuickEdit }: TileRendererProps) {
  const sizeClass = `tile-${tile.size}`;

  const commonClasses = cn(
    "relative overflow-hidden group transition-all duration-500 hover:shadow-xl rounded-[2.5rem] border border-black/5 dark:border-white/5 min-h-[140px] bg-white dark:bg-zinc-900",
    sizeClass
  );

  const EditOverlay = () => isDashboard && (
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-30 backdrop-blur-sm">
      <Button size="icon" variant="secondary" className="rounded-full shadow-lg" onClick={(e) => { e.stopPropagation(); onEdit?.(tile); }}>
        <Edit2 size={16} />
      </Button>
      <Button size="icon" variant="destructive" className="rounded-full shadow-lg" onClick={(e) => { e.stopPropagation(); onRemove?.(tile.id); }}>
        <Trash2 size={16} />
      </Button>
    </div>
  );

  const QuickActions = () => isDashboard && (
    <div className="absolute top-4 left-4 flex gap-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button 
        size="icon" 
        variant="secondary" 
        className="w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur"
        onClick={(e) => { e.stopPropagation(); onQuickEdit?.(tile, 'title'); }}
      >
        <Type size={14} />
      </Button>
      <Button 
        size="icon" 
        variant="secondary" 
        className="w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur"
        onClick={(e) => { e.stopPropagation(); onQuickEdit?.(tile, 'image'); }}
      >
        <ImageIcon size={14} />
      </Button>
    </div>
  );

  switch (tile.type) {
    case 'social':
      const isTwitter = tile.metadata?.brand?.toLowerCase() === 'twitter' || tile.metadata?.brand?.toLowerCase() === 'x';
      return (
        <Card className={cn(commonClasses, "p-6 flex flex-col justify-between")}>
          <QuickActions />
          <EditOverlay />
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <SocialIcon brand={tile.metadata?.brand} className={cn("w-10 h-10 p-2 rounded-xl bg-sky-50 dark:bg-sky-900/20", tile.metadata?.brand?.toLowerCase() === 'linkedin' ? 'text-[#0077b5]' : 'text-[#1DA1F2]')} />
              {tile.metadata?.buttonText && (
                <Button size="sm" className={cn("rounded-full text-[10px] h-7 px-4", isTwitter ? "bg-sky-500 hover:bg-sky-600 text-white" : "variant-outline border-sky-100 text-sky-500 bg-white dark:bg-zinc-800 dark:border-zinc-700")}>
                  {tile.metadata.buttonText}
                </Button>
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold leading-tight dark:text-white">{tile.title}</h4>
              <p className="text-[10px] text-muted-foreground font-medium">{tile.metadata?.username || tile.metadata?.linkText}</p>
            </div>
          </div>
        </Card>
      );

    case 'project':
      return (
        <Card className={cn(commonClasses, "p-6 space-y-4")}>
          <QuickActions />
          <EditOverlay />
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                 <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M19 28.5C19 23.2533 14.7467 19 9.5 19C4.2533 19 0 23.2533 0 28.5C0 33.7467 4.2533 38 9.5 38H19V28.5Z" fill="#0ACF83"/><path d="M0 9.5C0 4.2533 4.2533 0 9.5 0H19V19H9.5C4.2533 19 0 14.7467 0 9.5Z" fill="#A259FF"/><path d="M19 0H28.5C33.7467 0 38 4.2533 38 9.5C38 14.7467 33.7467 19 28.5 19H19V0Z" fill="#F24E1E"/><path d="M38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5Z" fill="#FF7262"/><path d="M19 38H28.5C33.7467 38 38 42.2533 38 47.5C38 52.7467 33.7467 57 28.5 57C23.2533 57 19 52.7467 19 47.5V38Z" fill="#1ABCFE"/></svg>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold dark:text-white">{tile.title}</h4>
                <p className="text-[10px] text-muted-foreground">{tile.metadata?.username}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {tile.metadata?.previews?.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border border-black/5 dark:border-white/5">
                <Image src={src} alt="Preview" fill className="object-cover" />
              </div>
            ))}
          </div>
        </Card>
      );

    case 'map':
      return (
        <Card className={cn(commonClasses, "p-0")}>
          <QuickActions />
          <EditOverlay />
          {tile.metadata?.imageUrl && (
            <div className="absolute inset-0">
              <Image src={tile.metadata.imageUrl} alt="Map" fill className="object-cover opacity-80 dark:opacity-40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-sky-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
              </div>
            </div>
          )}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md p-3 px-4 rounded-2xl border border-black/5 shadow-sm w-fit">
              <p className="text-[10px] font-bold leading-tight dark:text-white">{tile.title}</p>
            </div>
          </div>
        </Card>
      );

    case 'email':
      return (
        <Card className={cn(commonClasses, "bg-[#E5C4FB] dark:bg-[#7e57c2] border-none p-8 flex flex-col justify-end group/email")}>
          <QuickActions />
          <EditOverlay />
          <div className="absolute top-6 right-6 opacity-40 group-hover/email:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
              <ArrowUpRight size={14} className="text-black/60" />
            </div>
          </div>
          <p className="text-lg font-medium text-black/80 dark:text-white/90">{tile.content}</p>
        </Card>
      );

    case 'text':
      const isBlack = tile.metadata?.accentColor === '#000000';
      return (
        <Card className={cn(commonClasses, isBlack ? "bg-black text-white" : "bg-white dark:bg-zinc-900 text-black dark:text-white", "p-8 flex flex-col justify-center")}>
          <QuickActions />
          <EditOverlay />
          <p className="text-lg font-bold leading-tight">{tile.content}</p>
        </Card>
      );

    case 'image':
      return (
        <Card className={cn(commonClasses, "p-0 flex flex-col")}>
          <QuickActions />
          <EditOverlay />
          <div className="p-6 pb-2 space-y-1">
             <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-2">
                <SocialIcon brand="adplist" className="w-4 h-4 text-black dark:text-white" />
             </div>
             <h4 className="text-xs font-bold leading-tight max-w-[200px] dark:text-white">{tile.title}</h4>
             <p className="text-[10px] text-muted-foreground">{tile.metadata?.linkText}</p>
          </div>
          <div className="flex-1 relative m-4 mt-2 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 min-h-[160px]">
            {tile.metadata?.imageUrl && <Image src={tile.metadata.imageUrl} alt="Visual" fill className="object-cover" />}
          </div>
        </Card>
      );

    default:
      return (
        <Card className={cn(commonClasses, "bg-white dark:bg-zinc-900 p-6 flex flex-col justify-center")}>
          <QuickActions />
          <EditOverlay />
          <div className="space-y-2">
            <h4 className="font-bold text-sm leading-tight dark:text-white">{tile.title || 'New Tile'}</h4>
            <p className="text-[10px] font-medium text-muted-foreground leading-snug">{tile.content}</p>
          </div>
        </Card>
      );
  }
}
