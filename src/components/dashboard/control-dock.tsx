'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Sun,
  Moon,
  Monitor,
  Share2,
  Eye,
  Smartphone,
  Link2,
  Image,
  Quote,
  Heading1,
  AtSign,
  Settings,
  Play,
  LayoutGrid,
} from 'lucide-react';
import { useRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfileStore } from '@/store/profile-store';
import { Tile, TileSize, tileSizeToLayout } from '@/types/profile';

const TILE_BUTTONS: Array<{ label: string; type: Tile['type']; size: TileSize; Icon: React.ElementType }> = [
  { label: 'Link',    type: 'link',    size: '1x1', Icon: Link2    },
  { label: 'Image',   type: 'image',   size: '2x2', Icon: Image    },
  { label: 'Text',    type: 'text',    size: '2x1', Icon: Quote    },
  { label: 'Heading', type: 'heading', size: '3x1', Icon: Heading1 },
  { label: 'Video',   type: 'video',   size: '2x2', Icon: Play     },
  { label: 'Social',  type: 'social',  size: '1x1', Icon: AtSign   },
];

interface ControlDockProps {
  onPreview: () => void;
  onSettings: () => void;
  mobileView: boolean;
  onToggleMobileView: () => void;
}

export function ControlDock({ onPreview, onSettings, mobileView, onToggleMobileView }: ControlDockProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { profile, addTile, autoArrangeTiles } = useProfileStore();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isDark = resolvedTheme === 'dark';

  const dockBg     = isDark ? 'bg-zinc-50'    : 'bg-zinc-950';
  const dockBorder  = isDark ? 'border-zinc-200' : 'border-zinc-800';
  const dockText    = isDark ? 'text-zinc-700'  : 'text-zinc-300';
  const btnHover    = isDark ? 'hover:bg-zinc-100 hover:text-zinc-900' : 'hover:bg-zinc-800 hover:text-white';
  const btnActive   = isDark ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-700 text-white';
  const divider     = isDark ? 'bg-zinc-200'   : 'bg-zinc-700';
  const shareBtn    = 'bg-violet-600 hover:bg-violet-500 text-white';

  function handleShare() {
    const url = `${window.location.origin}/${profile.username}`;
    navigator.clipboard.writeText(url).then(() => toast.success('Profile link copied!'));
  }

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }

  const ThemeIcon = isDark ? Sun : Moon;

  function handleAddTile(type: Tile['type'], size: TileSize) {
    if (type === 'image') {
      imageInputRef.current?.click();
      return;
    }
    const { w, h } = type === 'heading' ? { w: 3, h: 1 } : tileSizeToLayout[size];
    const maxY = Math.max(0, ...profile.tiles.map((t) => t.layout.y + t.layout.h));
    const newTile = {
      id: `${type}-${Date.now()}`,
      type,
      size,
      layout: { x: 0, y: maxY, w, h },
      title:   type === 'heading' ? 'Heading' : '',
      content: type === 'text'    ? 'Your text here...'
             : type === 'email'   ? 'hello@you.com'
             : undefined,
    };
    addTile(newTile);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const { w, h } = tileSizeToLayout['2x2'];
      const maxY = Math.max(0, ...profile.tiles.map((t) => t.layout.y + t.layout.h));
      addTile({
        id: `image-${Date.now()}`,
        type: 'image',
        size: '2x2',
        layout: { x: 0, y: maxY, w, h },
        title: file.name.replace(/\.[^.]+$/, ''),
        metadata: { imageData: reader.result as string },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleAutoArrange() {
    autoArrangeTiles();
    toast.success('Tiles auto-arranged!');
  }

  const iconBtn = `h-9 w-9 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer ${dockText} ${btnHover}`;

  return (
    <TooltipProvider delayDuration={200}>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div
        className="pointer-events-auto"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className={`flex items-center gap-0.5 px-2 py-1.5 rounded-full border shadow-2xl ${dockBg} ${dockBorder}`}>

          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={onSettings} className={iconBtn}>
                <Settings className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Settings</p></TooltipContent>
          </Tooltip>

          {/* Auto Arrange */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleAutoArrange} className={iconBtn}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Auto-arrange</p></TooltipContent>
          </Tooltip>

          <div className={`w-px h-5 mx-1 ${divider}`} />

          {/* Share */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium transition-colors duration-150 cursor-pointer ${shareBtn}`}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Copy profile link</p></TooltipContent>
          </Tooltip>

          <div className={`w-px h-5 mx-1 ${divider}`} />

          {/* Tile type buttons */}
          {TILE_BUTTONS.map(({ label, type, size, Icon }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <button onClick={() => handleAddTile(type, size)} className={iconBtn}>
                  <Icon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent><p>Add {label}</p></TooltipContent>
            </Tooltip>
          ))}

          <div className={`w-px h-5 mx-1 ${divider}`} />

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={toggleTheme} className={iconBtn}>
                <ThemeIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>{isDark ? 'Light mode' : 'Dark mode'}</p></TooltipContent>
          </Tooltip>

          {/* Mobile/Desktop toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={onToggleMobileView} className={`${iconBtn} ${mobileView ? btnActive : ''}`}>
                {mobileView ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent><p>{mobileView ? 'Desktop view' : 'Mobile view'}</p></TooltipContent>
          </Tooltip>

          {/* Preview */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={onPreview} className={iconBtn}>
                <Eye className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent><p>Preview profile</p></TooltipContent>
          </Tooltip>

        </div>
      </motion.div>
      </div>
    </TooltipProvider>
  );
}
