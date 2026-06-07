"use client";

import { ImageIcon, MapPin, Play, Copy, Mail, Github, Twitter, Linkedin, Instagram, Youtube, ExternalLink, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Tile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { BentoCard } from "@/components/ui/bento-card";

const SOCIAL_ICON: Record<string, React.ElementType> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
};

const SOCIAL_BRAND_BG: Record<string, string> = {
  twitter:   'bg-black text-white',
  x:         'bg-black text-white',
  linkedin:  'bg-[#0A66C2] text-white',
  github:    'bg-zinc-900 text-white',
  instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white',
  youtube:   'bg-red-600 text-white',
  discord:   'bg-[#5865F2] text-white',
  portfolio: 'bg-zinc-900 text-white',
};

interface BentoTileProps {
  tile: Tile;
}

/** Map tile.layout.w to col-span-N for the public 4-col grid (chennai-react spec).
 *  On lg (2 cols): width 1 → 1, width 2 → 2, width 3+ → 2 (overflow handled by grid auto-flow).
 *  On xl (4 cols): width 1 → 1, width 2 → 2, width 3 → 3, width 4+ → 4.
 */
function widthToColSpan(w: number): string {
  if (w >= 4) return "col-span-2 xl:col-span-4";
  if (w === 3) return "col-span-2 xl:col-span-3";
  if (w === 2) return "col-span-2 xl:col-span-2";
  return "col-span-1 xl:col-span-1";
}

function heightToRowSpan(h: number): string {
  if (h >= 3) return "row-span-2 lg:row-span-3";
  if (h === 2) return "row-span-2 lg:row-span-2";
  return "row-span-1";
}

/* ───── Per-type renderers (content only) ───── */

function HeadingContent({ tile }: { tile: Tile }) {
  return (
    <div className="w-full h-full flex items-center px-1 gap-3">
      <div className="w-1 self-stretch bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-headline">
        {tile.title || "Heading"}
      </h2>
    </div>
  );
}

function TextContent({ tile }: { tile: Tile }) {
  return (
    <div className="w-full h-full p-5 flex flex-col justify-center">
      {tile.title && (
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
          {tile.title}
        </p>
      )}
      <p className="text-sm font-medium leading-relaxed line-clamp-5 whitespace-pre-line">
        {tile.content}
      </p>
    </div>
  );
}

function LinkContent({ tile }: { tile: Tile }) {
  const preview = tile.metadata?.linkPreview;
  return (
    <div className="w-full h-full p-5 flex flex-col justify-between">
      {preview?.image && (
        <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2">
          <img src={preview.image} alt="" className="object-cover w-full h-full" />
        </div>
      )}
      <div>
        <p className="text-sm font-semibold leading-tight">
          {tile.title || preview?.title || tile.url}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
          {preview?.siteName || tile.url}
        </p>
      </div>
    </div>
  );
}

function SocialContent({ tile }: { tile: Tile }) {
  const brand = (tile.metadata?.brand || "").toLowerCase();
  const Icon = SOCIAL_ICON[brand];
  const bg = tile.metadata?.brandColor || SOCIAL_BRAND_BG[brand] || "bg-zinc-900 text-white";

  return (
    <div className={cn("w-full h-full p-5 flex flex-col justify-between", bg)}>
      <div className="flex items-start justify-between">
        {Icon ? (
          <Icon className="w-7 h-7" />
        ) : (
          <ImageIcon className="w-7 h-7 opacity-50" />
        )}
        {tile.metadata?.buttonText && (
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            {tile.metadata.buttonText}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-bold leading-tight">
          {tile.title || brand}
        </p>
        {tile.metadata?.handle && (
          <p className="text-[10px] opacity-70 mt-0.5">
            {tile.metadata.handle}
          </p>
        )}
        {tile.metadata?.linkText && !tile.metadata?.handle && (
          <p className="text-[10px] opacity-70 mt-0.5 truncate">
            {tile.metadata.linkText}
          </p>
        )}
      </div>
    </div>
  );
}

function ImageContent({ tile }: { tile: Tile }) {
  const src = tile.metadata?.imageUrl || tile.metadata?.imageData;
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
        <ImageIcon className="w-8 h-8 opacity-30" />
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <img src={src} alt={tile.title ?? ""} className="w-full h-full object-cover" />
    </div>
  );
}

function VideoContent({ tile }: { tile: Tile }) {
  const src = tile.metadata?.videoUrl || tile.metadata?.imageUrl;
  return (
    <div className="w-full h-full relative bg-zinc-900 overflow-hidden">
      {src && <img src={src} alt="" className="w-full h-full object-cover opacity-70" />}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-2xl">
          <Play className="w-6 h-6 text-zinc-900 fill-zinc-900 ml-0.5" />
        </div>
      </div>
    </div>
  );
}

function EmailContent({ tile }: { tile: Tile }) {
  const [copied, setCopied] = useState(false);
  const email = tile.content || "";
  function copy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div className="w-full h-full p-5 flex flex-col justify-between bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
      <div className="flex items-center justify-between">
        <Mail className="w-7 h-7" />
        <button
          onClick={copy}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          aria-label="Copy email"
        >
          {copied ? (
            <span className="text-[10px] font-bold">✓</span>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <p className="text-sm sm:text-base font-semibold break-all leading-tight">
        {email}
      </p>
    </div>
  );
}

function ProjectContent({ tile }: { tile: Tile }) {
  return (
    <div className="w-full h-full p-5 flex flex-col justify-between">
      <div>
        <p className="text-base font-bold leading-tight">{tile.title}</p>
        {tile.metadata?.description && (
          <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
            {tile.metadata.description}
          </p>
        )}
        {tile.metadata?.label && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {tile.metadata.label.split(',').map((tag, i) => (
              <span
                key={i}
                className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
      {tile.url && (
        <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold mt-2 inline-flex items-center gap-1">
          View project <ArrowUpRight className="w-3 h-3" />
        </span>
      )}
    </div>
  );
}

function MapContent({ tile }: { tile: Tile }) {
  const query = tile.metadata?.location || tile.title || "";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return (
    <div className="w-full h-full relative bg-zinc-100">
      {tile.metadata?.imageUrl ? (
        <img src={tile.metadata.imageUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <MapPin className="w-8 h-8 opacity-30" />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white text-xs font-semibold flex items-center gap-1.5">
          <MapPin className="w-3 h-3" /> {tile.title}
        </p>
      </div>
    </div>
  );
}

/* ───── Master BentoTile — wraps content in BentoCard shell ───── */

export function BentoTile({ tile }: BentoTileProps) {
  // Headings: render edge-to-edge, no card chrome
  if (tile.type === 'heading') {
    return (
      <div className={cn(widthToColSpan(tile.layout.w), heightToRowSpan(tile.layout.h))}>
        <HeadingContent tile={tile} />
      </div>
    );
  }

  // Pick variant & href based on tile type/metadata
  const variant = tile.metadata?.cardVariant
    || (tile.type === 'social' || tile.type === 'email' ? 'brand'
       : tile.type === 'image' || tile.type === 'video' || tile.type === 'map' || tile.metadata?.imageUrl ? 'image'
       : tile.type === 'project' ? 'image'
       : 'plain');

  const href =
    tile.url ||
    (tile.type === 'email' && tile.content ? `mailto:${tile.content}` : undefined) ||
    (tile.type === 'map' && (tile.metadata?.location || tile.title) ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tile.metadata?.location || tile.title || '')}` : undefined);

  return (
    <div className={cn(widthToColSpan(tile.layout.w), heightToRowSpan(tile.layout.h))}>
      <BentoCard
        href={href}
        accentChip={tile.metadata?.accentChip}
        title={tile.title}
        description={tile.metadata?.description}
        variant={variant as "plain" | "gradient" | "image" | "brand" | "glow"}
        className="h-full"
      >
        {tile.type === 'text'     && <TextContent tile={tile} />}
        {tile.type === 'link'     && <LinkContent tile={tile} />}
        {tile.type === 'social'   && <SocialContent tile={tile} />}
        {tile.type === 'image'    && <ImageContent tile={tile} />}
        {tile.type === 'video'    && <VideoContent tile={tile} />}
        {tile.type === 'email'    && <EmailContent tile={tile} />}
        {tile.type === 'project'  && <ProjectContent tile={tile} />}
        {tile.type === 'map'      && <MapContent tile={tile} />}
        {/* Other types: minimal fallback */}
        {!['text','link','social','image','video','email','project','map'].includes(tile.type) && (
          <div className="w-full h-full p-5 flex flex-col justify-center">
            {tile.title && <p className="text-sm font-semibold">{tile.title}</p>}
            {tile.content && <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{tile.content}</p>}
          </div>
        )}
      </BentoCard>
    </div>
  );
}
