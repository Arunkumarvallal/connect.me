
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

/* ─── Text tile — double-click to inline edit ─── */
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
        'p-6 h-full flex flex-col justify-center',
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
          className="w-full bg-transparent border-none outline-none resize-none text-lg font-bold leading-snug"
          rows={3}
        />
      ) : (
        <p
          className={cn('text-lg font-bold leading-snug', isDashboard && 'cursor-text')}
          onDoubleClick={() => isDashboard && setEditing(true)}
          title={isDashboard ? 'Double-click to edit' : undefined}
        >
          {tile.content || (isDashboard ? <span className="opacity-30 italic font-normal text-sm">Double-click to add text…</span> : null)}
        </p>
      )}
    </div>
  );
}

/* ─── Heading tile — full-width section divider, double-click to inline edit ─── */
function HeadingTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(tile.title ?? '');

  function commit() {
    setEditing(false);
    updateTile({ ...tile, title: val });
  }

  return (
    <div className="w-full h-full flex items-center">
      {editing && isDashboard ? (
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commit(); }}
          className="flex-1 bg-transparent border-none outline-none text-2xl font-black leading-none tracking-tight text-foreground"
        />
      ) : (
        <h2
          className={cn('text-2xl font-black leading-none tracking-tight text-foreground', isDashboard && 'cursor-text')}
          onDoubleClick={() => isDashboard && setEditing(true)}
          title={isDashboard ? 'Double-click to edit' : undefined}
        >
          {tile.title || (isDashboard ? <span className="opacity-30 italic font-normal text-sm">Double-click to add heading…</span> : null)}
        </h2>
      )}
    </div>
  );
}

/* ─── Link tile — double-click to inline edit ─── */
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
    <div className="relative h-full">
      <div className="h-full flex flex-col justify-between p-5 bg-card">
        {preview?.image && (
          <div className="relative w-full h-24 rounded-xl overflow-hidden mb-3">
            <Image src={preview.image} alt="" fill className="object-cover" />
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
                className="w-full bg-transparent border-none outline-none text-sm font-semibold text-foreground leading-tight"
              />
            ) : (
              <p
                className={cn('text-sm font-semibold text-foreground leading-tight truncate', isDashboard && 'cursor-text')}
                onDoubleClick={() => isDashboard && setEditingTitle(true)}
              >
                {tile.title || preview?.title || (isDashboard ? <span className="opacity-30 italic font-normal text-xs">Double-click to add title…</span> : tile.url)}
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
                className="w-full bg-transparent border-none outline-none text-xs text-muted-foreground mt-0.5"
              />
            ) : (
              <p
                className={cn('text-xs text-muted-foreground mt-0.5 truncate', isDashboard && 'cursor-text')}
                onDoubleClick={() => isDashboard && setEditingUrl(true)}
              >
                {preview?.siteName || tile.url || (isDashboard ? <span className="opacity-30 italic font-normal text-xs">Double-click to add URL…</span> : '')}
              </p>
            )}
          </div>
          {!isDashboard ? (
            <a href={tile.url} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            </a>
          ) : (
            <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-30" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Image tile — hover shows replace button in corner ─── */
function ImageTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const imgSrc = tile.metadata?.imageData ?? tile.metadata?.imageUrl;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateTile({ ...tile, metadata: { ...tile.metadata, imageData: reader.result as string } });
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
          {isDashboard && <p className="text-xs opacity-50">Click replace to add image</p>}
        </div>
      )}

      {/* Replace button — dashboard only */}
      {isDashboard && (
        <>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1 bg-black/70 hover:bg-black/90 text-white text-xs px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm"
          >
            <ImageIcon className="w-3 h-3" />
            {imgSrc ? 'Replace' : 'Upload'}
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Social tile — double-click to inline edit ─── */
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

  return (
    <div className="p-5 h-full flex flex-col justify-between bg-card">
      <div className="flex items-start justify-between">
        <SocialIcon brand={tile.metadata?.brand} className="w-9 h-9 p-1.5 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-500" />
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
            className="w-full bg-transparent border-none outline-none text-xs font-bold uppercase tracking-tight text-foreground"
          />
        ) : (
          <p
            className={cn('text-xs font-bold uppercase tracking-tight text-foreground', isDashboard && 'cursor-text')}
            onDoubleClick={() => isDashboard && setEditingTitle(true)}
          >
            {tile.title || (isDashboard ? <span className="opacity-30 italic normal-case font-normal">Double-click to add title…</span> : '')}
          </p>
        )}
        {editingUsername && isDashboard ? (
          <input
            autoFocus
            value={usernameVal}
            onChange={(e) => setUsernameVal(e.target.value)}
            onBlur={commitUsername}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commitUsername(); }}
            className="w-full bg-transparent border-none outline-none text-[10px] text-muted-foreground mt-0.5"
          />
        ) : (
          <p
            className={cn('text-[10px] text-muted-foreground mt-0.5', isDashboard && 'cursor-text')}
            onDoubleClick={() => isDashboard && setEditingUsername(true)}
          >
            {tile.metadata?.username || tile.metadata?.linkText || (isDashboard ? <span className="opacity-30 italic">Double-click to add username…</span> : '')}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Email tile — double-click to inline edit ─── */
function EmailTile({ tile, isDashboard }: { tile: Tile; isDashboard?: boolean }) {
  const { updateTile } = useProfileStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(tile.content ?? '');

  function commit() {
    setEditing(false);
    updateTile({ ...tile, content: val });
  }

  return (
    <div className="h-full bg-violet-100 dark:bg-violet-900/30 p-6 flex flex-col justify-end relative group/em">
      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center opacity-40 group-hover/em:opacity-100 transition-opacity">
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>
      {editing && isDashboard ? (
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') commit(); }}
          className="bg-transparent border-none outline-none text-base font-medium text-violet-900 dark:text-violet-100 break-all w-full"
        />
      ) : (
        <p
          className={cn('text-base font-medium text-violet-900 dark:text-violet-100 break-all', isDashboard && 'cursor-text')}
          onDoubleClick={() => isDashboard && setEditing(true)}
        >
          {tile.content || (isDashboard ? <span className="opacity-50 italic text-sm font-normal">Double-click to add email…</span> : '')}
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
      return <div className={base}><TextTile    tile={tile} isDashboard={isDashboard} /></div>;
    case 'heading':
      return <div className={base}><HeadingTile tile={tile} isDashboard={isDashboard} /></div>;
    case 'link':
      return <div className={base}><LinkTile    tile={tile} isDashboard={isDashboard} /></div>;
    case 'image':
    case 'video':
      return <div className={base}><ImageTile   tile={tile} isDashboard={isDashboard} /></div>;
    case 'social':
      return <div className={base}><SocialTile  tile={tile} isDashboard={isDashboard} /></div>;
    case 'email':
      return <div className={base}><EmailTile   tile={tile} isDashboard={isDashboard} /></div>;
    case 'profile':
      return <div className={base}><ProfileTile readOnly={!isDashboard} /></div>;
    case 'project':
      return (
        <div className={base}>
          <div className="h-full p-5 bg-card flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{tile.title}</p>
              {tile.metadata?.username && (
                <p className="text-[10px] text-muted-foreground mt-0.5">{tile.metadata.username}</p>
              )}
            </div>
            {tile.metadata?.previews && (
              <div className="grid grid-cols-2 gap-1 mt-2">
                {tile.metadata.previews.slice(0, 4).map((src: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    <img src={src} alt="" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    case 'map':
      return (
        <div className={base}>
          <div className="relative h-full">
            {tile.metadata?.imageUrl && (
              <img src={tile.metadata.imageUrl} alt={tile.title ?? ''} className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-xs font-medium">{tile.title}</p>
            </div>
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
