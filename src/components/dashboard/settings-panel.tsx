'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProfileStore } from '@/store/profile-store';
import { ProfileFont, ProfileBackground, HeroStyle } from '@/types/profile';
import { GRID_CONFIG } from '@/types/profile';

const FONTS: { value: ProfileFont; label: string; className: string }[] = [
  { value: 'headline', label: 'Headline', className: 'font-bold tracking-tight' },
  { value: 'mono', label: 'Mono', className: 'font-mono' },
  { value: 'sans', label: 'Sans', className: 'font-sans' },
];

const BACKGROUNDS: { value: ProfileBackground; label: string; swatch: string }[] = [
  { value: 'white', label: 'White', swatch: '#ffffff' },
  { value: 'light-gray', label: 'Light Gray', swatch: '#f4f4f5' },
  { value: 'dark', label: 'Dark', swatch: '#09090b' },
  { value: 'gradient-sunset', label: 'Sunset', swatch: 'linear-gradient(135deg,#f97316,#ec4899)' },
  { value: 'gradient-ocean', label: 'Ocean', swatch: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { value: 'gradient-forest', label: 'Forest', swatch: 'linear-gradient(135deg,#22c55e,#14b8a6)' },
];

const HERO_STYLES: { value: HeroStyle; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Centered avatar + name + bio' },
  { value: 'banner', label: 'Banner', description: 'Full-width banner with overlay' },
  { value: 'minimal', label: 'Minimal', description: 'Left-aligned compact layout' },
  { value: 'card', label: 'Card', description: 'Card container with accent' },
  { value: 'magazine', label: 'Magazine', description: 'Large avatar, editorial style' },
];

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { profile, updateProfile, customCols, setCustomCols } = useProfileStore();

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-80 pt-10">
        <SheetHeader>
          <SheetTitle>Style Settings</SheetTitle>
        </SheetHeader>

<div className="mt-6 space-y-8">
        {/* Columns */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Grid Columns</Label>
          <Select
            value={customCols?.toString() ?? 'auto'}
            onValueChange={(v) => setCustomCols(v === 'auto' ? null : parseInt(v))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Auto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (Responsive)</SelectItem>
              {Array.from({ length: GRID_CONFIG.maxCols - GRID_CONFIG.minCols + 1 }, (_, i) => i + GRID_CONFIG.minCols).map((col) => (
                <SelectItem key={col} value={col.toString()}>{col} Columns</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Font</Label>
            <RadioGroup
              value={profile.theme.font}
              onValueChange={(v) =>
                updateProfile({ theme: { ...profile.theme, font: v as ProfileFont } })
              }
              className="space-y-2"
            >
              {FONTS.map((f) => (
                <div key={f.value} className="flex items-center gap-3">
                  <RadioGroupItem value={f.value} id={`font-${f.value}`} />
                  <Label
                    htmlFor={`font-${f.value}`}
                    className={`cursor-pointer text-base ${f.className}`}
                  >
                    {f.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Background */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Background</Label>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.value}
                  onClick={() =>
                    updateProfile({
                      theme: { ...profile.theme, background: bg.value },
                    })
                  }
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    profile.theme.background === bg.value
                      ? 'border-primary'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg border border-border/30"
                    style={{ background: bg.swatch }}
                  />
                  <span className="text-xs text-muted-foreground">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero Style */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Hero Style</Label>
            <div className="grid grid-cols-1 gap-2">
              {HERO_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() =>
                    updateProfile({
                      theme: { ...profile.theme, heroStyle: style.value },
                    })
                  }
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 transition-all text-left ${
                    profile.theme.heroStyle === style.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-sm font-medium">{style.label}</span>
                  <span className="text-xs text-muted-foreground">{style.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
