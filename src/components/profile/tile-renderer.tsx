
"use client"

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Tile } from '@/types/profile';
import { cn } from '@/lib/utils';
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ArrowUpRight,
  Smile,
  ImageIcon,
  Pencil,
  ExternalLink,
  Copy,
  Mail,
  MapPin,
  Play,
} from 'lucide-react';
import { useProfileStore } from '@/store/profile-store';
import { ProfileTile } from '@/components/dashboard/profile-tile';

interface TileRendererProps {
  tile: Tile;
  isDashboard?: boolean;
}

const SocialIcon = ({ brand, className }: { brand?: string; className?: string }) => {
  switch (brand?.toLowerCase()) {
    case 'x':
    case 'twitter':   return <Twitter   className={className} />;
    case 'linkedin':  return <Linkedin  className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'youtube':   return <Youtube   className={className} />;
    case 'github':    return <Github    className={className} />;
    default:          return <Smile     className={className} />;
  }
};

/* ─── Text tile — single click to inline edit ─── */
function TextTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(tile.content ?? '');
  const isBlack = tile.metadata?.accentColor === '#000000';

  function commit() {
    setEditing(false);
    updateTile({ ...tile, content: val });
  }

  return (
    <div
      className={cn(
        'p-6 h-full flex flex-col justify-center group/text',
        isBlack ? 'bg-zinc-950 text-white' : 'bg-card text-foreground',
      )}
    >
      {editing && isDashboard ? (
        <textarea
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Escape') commit(); }}
          className="w-full bg-transparent border-none outline-none resize-none text-lg font-bold leading-snug placeholder:text-zinc-400"
          rows={3}
          placeholder="Add text..."
        />
      ) : (
        <div className="flex items-start gap-2">
          <p
            className={cn('text-lg font-bold leading-snug flex-1', isDashboard && 'cursor-pointer hover:text-violet-600 transition-colors')}
            onClick={() => isDashboard && setEditing(true)}
            title={isDashboard ? 'Click to edit' : undefined}
          >
            {tile.content || (isDashboard ? <span className="opacity-30 italic font-normal text-sm">Click to add text...</span> : null)}
          </p>
          {isDashboard && !editing && !tile.content && (
            <Pencil className="w-3 h-3 opacity-0 group-hover/text:opacity-40 transition-opacity text-muted-foreground mt-1" />
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Heading tile — single click to edit ─── */
function HeadingTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(tile.title ?? '');

  function commit() {
    setEditing(false);
    updateTile({ ...tile, title: val });
  }

  return (
    <div className="w-full h-full flex items-center group/heading gap-3">
      <div className="w-1 self-stretch bg-violet-500 rounded-full opacity-60 flex-shrink-0" />
      {editing && isDashboard ? (
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commit(); }}
          className="flex-1 bg-transparent border-none outline-none text-2xl font-black leading-none tracking-tight text-foreground placeholder:text-zinc-400"
          placeholder="Add heading..."
        />
      ) : (
        <div className="flex-1 flex items-center gap-2">
          <h2
            className={cn('text-2xl font-black leading-none tracking-tight text-foreground', isDashboard && 'cursor-pointer hover:text-violet-600 transition-colors')}
            onClick={() => isDashboard && setEditing(true)}
            title={isDashboard ? 'Click to edit' : undefined}
          >
            {tile.title || (isDashboard ? <span className="opacity-30 italic font-normal text-sm">Click to add heading...</span> : null)}
          </h2>
          {isDashboard && !editing && !tile.title && (
            <Pencil className="w-3.5 h-3.5 opacity-0 group-hover/heading:opacity-40 transition-opacity text-muted-foreground" />
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Link tile — single click to edit ─── */
function LinkTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const [editingUrl, setEditingUrl] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [url, setUrl] = useState(tile.url ?? '');
  const [titleVal, setTitleVal] = useState(tile.title ?? '');
  const preview = tile.metadata?.linkPreview;

  function commitUrl() {
    setEditingUrl(false);
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    updateTile({ ...tile, url: normalized });
  }

  function commitTitle() {
    setEditingTitle(false);
    updateTile({ ...tile, title: titleVal });
  }

  return (
    <div className="relative h-full group/link">
      <div className="h-full flex flex-col justify-between p-5 bg-card hover:shadow-md transition-shadow">
        {preview?.image && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
            <Image src={preview.image} alt="" fill className="object-cover" />
            {preview.favicon && (
              <img src={preview.favicon} alt="" className="absolute top-2 left-2 w-5 h-5 rounded bg-white/90 p-0.5" />
            )}
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {editingTitle && isDashboard ? (
              <input
                autoFocus
                value={titleVal}
                onChange={(e) => setTitleVal(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commitTitle(); }}
                className="w-full bg-transparent border-none outline-none text-sm font-semibold leading-tight placeholder:text-zinc-400"
                placeholder="Add title..."
              />
            ) : (
              <p
                className={cn('text-sm font-semibold text-foreground leading-tight truncate cursor-pointer hover:text-violet-600 transition-colors')}
                onClick={() => isDashboard && setEditingTitle(true)}
              >
                {tile.title || preview?.title || (isDashboard ? <span className="opacity-30 italic font-normal text-xs">Click to add title...</span> : tile.url)}
              </p>
            )}
            {editingUrl && isDashboard ? (
              <input
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={commitUrl}
                onKeyDown={(e) => { if (e.key === 'Enter') commitUrl(); if (e.key === 'Escape') setEditingUrl(false); }}
                placeholder="https://..."
                className="w-full bg-transparent border-none outline-none text-xs text-muted-foreground mt-0.5 placeholder:text-zinc-400"
              />
            ) : (
              <p
                className={cn('text-xs text-muted-foreground mt-0.5 truncate cursor-pointer hover:text-violet-600 transition-colors')}
                onClick={() => isDashboard && setEditingUrl(true)}
              >
                {preview?.siteName || tile.url || (isDashboard ? <span className="opacity-30 italic font-normal text-xs">Click to add URL...</span> : '')}
              </p>
            )}
          </div>
          <a
            href={tile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 mt-0.5 opacity-40 hover:opacity-100 transition-opacity"
            onClick={(e) => isDashboard && e.preventDefault()}
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        </div>
        {preview?.description && (
          <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{preview.description}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Image tile — always visible replace button in dashboard ─── */
function ImageTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const imgSrc = tile.metadata?.imageData ?? tile.metadata?.imageUrl;
  const [uploading, setUploading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      updateTile({ ...tile, metadata: { ...tile.metadata, imageData: reader.result as string } });
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className="relative w-full h-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden group/img">
      {imgSrc ? (
        <Image src={imgSrc} alt={tile.title ?? ''} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageIcon className="w-8 h-8 opacity-30" />
          {isDashboard && <p className="text-xs opacity-50">Click below to add image</p>}
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {isDashboard && (
        <>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 hover:bg-black/90 text-white text-xs px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm transition-opacity hover:scale-105"
          >
            <ImageIcon className="w-3 h-3" />
            {imgSrc ? 'Replace' : 'Upload'}
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Social tile — single click to edit, brand colors ─── */
function SocialTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [titleVal, setTitleVal] = useState(tile.title ?? '');
  const [usernameVal, setUsernameVal] = useState(tile.metadata?.username ?? '');

  function commitTitle() {
    setEditingTitle(false);
    updateTile({ ...tile, title: titleVal });
  }

  function commitUsername() {
    setEditingUsername(false);
    updateTile({ ...tile, metadata: { ...tile.metadata, username: usernameVal } });
  }

  const brand = (tile.metadata?.brand || '').toLowerCase();
  const brandBg: Record<string, string> = {
    twitter: 'bg-black text-white',
    x: 'bg-black text-white',
    linkedin: 'bg-blue-600 text-white',
    github: 'bg-gray-900 text-white',
    instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white',
    youtube: 'bg-red-600 text-white',
  };
  const iconBg = brandBg[brand] || 'bg-sky-50 dark:bg-sky-900/20 text-sky-500';

  return (
    <div className="p-5 h-full flex flex-col justify-between bg-card hover:shadow-md transition-shadow group/social">
      <div className="flex items-start justify-between">
        <SocialIcon brand={brand} className={`w-9 h-9 p-1.5 rounded-xl ${iconBg}`} />
        {tile.metadata?.buttonText && (
          <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-foreground">
            {tile.metadata.buttonText}
          </span>
        )}
      </div>
      <div>
        {editingTitle && isDashboard ? (
          <input
            autoFocus
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commitTitle(); }}
            className="w-full bg-transparent border-none outline-none text-xs font-bold uppercase tracking-tight text-foreground placeholder:text-zinc-400"
            placeholder="Add title..."
          />
        ) : (
          <p
            className={cn('text-xs font-bold uppercase tracking-tight text-foreground cursor-pointer hover:text-violet-600 transition-colors')}
            onClick={() => isDashboard && setEditingTitle(true)}
          >
            {tile.title || (isDashboard ? <span className="opacity-30 italic normal-case font-normal">Click to add title...</span> : '')}
          </p>
        )}
        {editingUsername && isDashboard ? (
          <input
            autoFocus
            value={usernameVal}
            onChange={(e) => setUsernameVal(e.target.value)}
            onBlur={commitUsername}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commitUsername(); }}
            className="w-full bg-transparent border-none outline-none text-[10px] text-muted-foreground mt-0.5 placeholder:text-zinc-400"
            placeholder="Add username..."
          />
        ) : (
          <p
            className={cn('text-[10px] text-muted-foreground mt-0.5 cursor-pointer hover:text-violet-600 transition-colors')}
            onClick={() => isDashboard && setEditingUsername(true)}
          >
            {tile.metadata?.username || tile.metadata?.linkText || (isDashboard ? <span className="opacity-30 italic">Click to add username...</span> : '')}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Email tile — single click to edit, mailto link ─── */
function EmailTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(tile.content ?? '');
  const [copied, setCopied] = useState(false);

  function commit() {
    setEditing(false);
    updateTile({ ...tile, content: val });
  }

  function copyEmail() {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="h-full bg-violet-100 dark:bg-violet-900/30 p-6 flex flex-col justify-end relative group/em">
      <div className={`absolute top-4 right-4 flex items-center gap-1 ${isDashboard ? 'opacity-0 group-hover/em:opacity-100' : ''} transition-opacity`}>
        {!isDashboard && val && (
          <a
            href={`mailto:${val}`}
            className="w-7 h-7 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center hover:bg-white/80 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-violet-900 dark:text-violet-100" />
          </a>
        )}
        <button
          onClick={copyEmail}
          className="w-7 h-7 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center hover:bg-white/80 transition-colors"
          title="Copy email"
        >
          {copied ? (
            <span className="text-[10px] font-bold text-violet-900">✓</span>
          ) : (
            <Copy className="w-3.5 h-3.5 text-violet-900 dark:text-violet-100" />
          )}
        </button>
      </div>

      {editing && isDashboard ? (
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commit(); }}
          className="bg-transparent border-none outline-none text-base font-medium text-violet-900 dark:text-violet-100 break-all w-full placeholder:text-violet-900/50 dark:placeholder:text-violet-100/50"
          placeholder="Add email..."
        />
      ) : (
        <p
          className={cn('text-base font-medium text-violet-900 dark:text-violet-100 break-all', isDashboard && 'cursor-pointer hover:underline')}
          onClick={() => isDashboard && setEditing(true)}
        >
          {val || (isDashboard ? <span className="opacity-50 italic text-sm font-normal">Click to add email...</span> : '')}
        </p>
      )}
    </div>
  );
}

/* ─── Master renderer ─── */
export function TileRenderer({ tile, isDashboard }: TileRendererProps) {
  const base = 'relative w-full h-full rounded-2xl overflow-hidden border border-border';

  switch (tile.type) {
    case 'text':
      return <div className={base}><TextTile tile={tile} isDashboard={isDashboard} /></div>;
    case 'heading':
      return <div className={base}><HeadingTile tile={tile} isDashboard={isDashboard} /></div>;
    case 'link':
      return <div className={base}><LinkTile tile={tile} isDashboard={isDashboard} /></div>;
    case 'image':
    case 'video':
      return <div className={base}><ImageTile tile={tile} isDashboard={isDashboard} /></div>;
    case 'social':
      return <div className={base}><SocialTile tile={tile} isDashboard={isDashboard} /></div>;
    case 'email':
      return <div className={base}><EmailTile tile={tile} isDashboard={isDashboard} /></div>;
    case 'profile':
      return <div className={base}><ProfileTile readOnly={!isDashboard} /></div>;
    case 'project':
      return (
        <div className={base}>
          <div className="h-full p-5 bg-card flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-semibold text-foreground">{tile.title || 'Project'}</p>
              {tile.content && (
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{tile.content}</p>
              )}
              {tile.metadata?.username && (
                <p className="text-[10px] text-muted-foreground mt-0.5">{tile.metadata.username}</p>
              )}
              {tile.metadata?.label && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tile.metadata.label.split(',').map((tag: string, i: number) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {tile.metadata?.previews && (
              <div className="grid grid-cols-2 gap-1 mt-2">
                {tile.metadata.previews.slice(0, 4).map((src: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <img src={src} alt="" className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            )}
            {tile.url && (
              <a
                href={tile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-violet-600 hover:underline mt-2 flex items-center gap-1"
              >
                View Project <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      );
    case 'map':
      const mapQuery = tile.metadata?.location || tile.title || '';
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
      return (
        <div className={base}>
          <div className="relative h-full group/map">
            {tile.metadata?.imageUrl ? (
              <img src={tile.metadata.imageUrl} alt={tile.title ?? ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                <MapPin className="w-8 h-8 opacity-30 text-muted-foreground" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-xs font-medium">{tile.title}</p>
              {tile.metadata?.location && (
                <p className="text-white/70 text-[10px] mt-0.5">{tile.metadata.location}</p>
              )}
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 opacity-0 group-hover/map:opacity-100 transition-opacity bg-white/90 hover:bg-white text-foreground text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-lg"
            >
              <MapPin className="w-3 h-3" />
              Maps
            </a>
          </div>
        </div>
      );
    default:
      return (
        <div className={cn(base, 'p-5 bg-card flex flex-col justify-center')}>
          <p className="text-sm font-semibold text-foreground">{tile.title || tile.type}</p>
          {tile.content && <p className="text-xs text-muted-foreground mt-1">{tile.content}</p>}
        </div>
      );
  }
}
