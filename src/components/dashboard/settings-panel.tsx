'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useProfileStore } from '@/store/profile-store';
import { ProfileFont, ProfileBackground } from '@/types/profile';

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

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { profile, updateProfile } = useProfileStore();

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-80 pt-10">
        <SheetHeader>
          <SheetTitle>Style Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
