"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/store/profile-store";
import { ProfileFont, ProfileBackground, HeroAccent, HeroAccentKind, DEFAULT_HERO_ACCENT } from "@/types/profile";
import { GRID_CONFIG } from "@/types/profile";

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

const ACCENT_KINDS: { value: HeroAccentKind; label: string; emoji: string; color: string }[] = [
  { value: 'available',     label: 'Available',     emoji: '✦', color: 'bg-emerald-500' },
  { value: 'oss',           label: 'Open source',   emoji: '✦', color: 'bg-violet-500' },
  { value: 'open-to-work',  label: 'Open to work',  emoji: '✦', color: 'bg-amber-500' },
  { value: 'building',      label: 'Building',      emoji: '✦', color: 'bg-sky-500' },
  { value: 'speaking',      label: 'Speaking',      emoji: '✦', color: 'bg-pink-500' },
  { value: 'custom',        label: 'Custom',        emoji: '✦', color: 'bg-zinc-700' },
];

const ACCENT_COLORS = [
  { value: 'bg-emerald-500', swatch: '#10b981' },
  { value: 'bg-violet-500',  swatch: '#8b5cf6' },
  { value: 'bg-amber-500',   swatch: '#f59e0b' },
  { value: 'bg-sky-500',     swatch: '#0ea5e9' },
  { value: 'bg-pink-500',    swatch: '#ec4899' },
  { value: 'bg-rose-500',    swatch: '#f43f5e' },
  { value: 'bg-zinc-700',    swatch: '#3f3f46' },
  { value: 'bg-zinc-900',    swatch: '#18181b' },
];

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { profile, updateProfile } = useProfileStore();
  const accent: HeroAccent = profile.theme.heroAccent ?? DEFAULT_HERO_ACCENT;
  const maxCols: number = profile.theme.maxCols ?? 4;

  function setAccent(patch: Partial<HeroAccent>) {
    updateProfile({
      theme: { ...profile.theme, heroAccent: { ...accent, ...patch } },
    });
  }

  function setMaxCols(cols: number) {
    updateProfile({ theme: { ...profile.theme, maxCols: cols } });
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-80 pt-10 overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Style Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8 pb-8">
          {/* Columns */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Grid Columns</Label>
            <Select
              value={maxCols.toString()}
              onValueChange={(v) => setMaxCols(parseInt(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="4" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: GRID_CONFIG.publicMaxCols - GRID_CONFIG.publicMinCols + 1 },
                  (_, i) => i + GRID_CONFIG.publicMinCols,
                ).map((col) => (
                  <SelectItem key={col} value={col.toString()}>
                    {col} Columns
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">
              Shared between editor and public viewer (chennai-react: 2–4 cols).
            </p>
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

          {/* Hero Accent chip */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Hero accent chip</Label>
            <p className="text-[10px] text-muted-foreground">
              Floats on the bottom of the hero avatar.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ACCENT_KINDS.map((k) => (
                <button
                  key={k.value}
                  onClick={() => setAccent({ kind: k.value, label: k.label, emoji: k.emoji, color: k.color })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                    accent.kind === k.value
                      ? 'border-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${k.color}`} />
                  {k.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input
                value={accent.label}
                onChange={(e) => setAccent({ label: e.target.value })}
                placeholder="e.g. Available for hire"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Emoji / symbol</Label>
              <Input
                value={accent.emoji ?? ''}
                onChange={(e) => setAccent({ emoji: e.target.value })}
                placeholder="✦"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setAccent({ color: c.value })}
                    className={`h-8 rounded-lg border-2 transition-all ${
                      accent.color === c.value ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ background: c.swatch }}
                    title={c.value}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Link (optional)</Label>
              <Input
                value={accent.href ?? ''}
                onChange={(e) => setAccent({ href: e.target.value || undefined })}
                placeholder="https://..."
                className="text-sm"
              />
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-border/40 p-3 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
              <span
                className={`px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 ${accent.color}`}
              >
                {accent.emoji && <span>{accent.emoji}</span>}
                {accent.label || 'Accent'}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
