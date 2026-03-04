import { ProfileBackground, ProfileFont } from '@/types/profile';

/**
 * Background class applied inside the dashboard editor.
 * 'white' and 'dark' are intentionally empty — next-themes CSS variables
 * handle those via the :root / .dark selectors, so no explicit bg class is needed.
 */
export const dashboardBgClassMap: Record<ProfileBackground, string> = {
  'white':            '',
  'light-gray':       'bg-zinc-100 dark:bg-zinc-900',
  'dark':             '',
  'gradient-sunset':  'bg-gradient-to-br from-orange-400 to-pink-500',
  'gradient-ocean':   'bg-gradient-to-br from-cyan-400 to-blue-500',
  'gradient-forest':  'bg-gradient-to-br from-green-400 to-teal-500',
};

/** Tailwind font class derived from the profile theme font setting. */
export const fontClassMap: Record<ProfileFont, string> = {
  headline: 'font-bold tracking-tight',
  mono:     'font-mono',
  sans:     'font-sans',
};
