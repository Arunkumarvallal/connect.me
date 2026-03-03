import { ProfileBackground, ProfileFont, GRID_CONFIG } from '@/types/profile';

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

/**
 * Background class applied on the public profile page.
 * Explicit colors are required here as this view is outside next-themes control.
 */
export const publicBgClassMap: Record<ProfileBackground, string> = {
  'white':            'bg-white',
  'light-gray':       'bg-zinc-100',
  'dark':             'bg-zinc-950',
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

/**
 * Fractional grid height for heading tiles on the public profile page.
 * Derived from GRID_CONFIG so both values stay in sync automatically.
 *
 * Formula: h = (targetPx + gap) / (rowHeightPx + gap)
 * This ensures the heading renders at exactly HEADING_TARGET_PX tall.
 */
const HEADING_TARGET_PX = 52;

export const publicHeadingH =
  (HEADING_TARGET_PX + GRID_CONFIG.gap) / (GRID_CONFIG.rowHeightPx + GRID_CONFIG.gap);
