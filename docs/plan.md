# Connect.me — Implementation Plan (v2)

> Bento.me-style personal profile builder: drag-and-drop tile grid, per-user dashboards, real Google/GitHub auth, Firestore database, Firebase Storage for media, and smart link previews.

---

## 1. Current Codebase Audit

### What already exists

| File | Status | Notes |
|------|--------|-------|
| `src/types/profile.ts` | ✅ Solid | `Tile`, `TileSize`, `TileType`, `UserProfile` types exist |
| `src/lib/mock-data.ts` | ✅ Good | Sample profile with realistic tile data |
| `src/app/page.tsx` | ✅ Good | Landing page is well-built |
| `src/app/login/page.tsx` | ⚠️ Replace | Current login is bloated — replace with minimal animated page |
| `src/app/dashboard/page.tsx` | ⚠️ Monolith | 334 lines, no component separation |
| `src/app/[username]/page.tsx` | ⚠️ Partial | Hardcoded mock data for all users |
| `src/components/profile/tile-renderer.tsx` | ✅ Good | Handles most tile types, minor updates needed |
| `src/app/globals.css` | ✅ Good | `.bento-grid`, `.tile-*` CSS classes exist |
| `package.json` | ⚠️ Missing | No grid/dnd, animation, or theme libs — see Dependency Analysis below |

### Key Gaps vs. Spec

| Gap | Impact |
|-----|--------|
| No real authentication | All users see same mock data |
| No database | Data is lost on refresh |
| No file uploads | Images/videos must be URLs only |
| No link preview scraping | URLs added to tiles show no preview |
| HTML5 drag API — no touch, no ghost | Bad UX on mobile and desktop |
| Bio limit 270 chars (spec: 150) | Wrong |
| Delete icon mixed with other hover icons | Spec: delete-only top, size bottom |
| Settings icon does nothing | Spec: proper settings panel |
| Mobile public profile not stacked | Spec: avatar → name → bio → tiles |
| No `heading` tile type | Section labels are first-class concept |
| Dashboard is a monolith | Violates React reusability rules |

---

## 2. Dependency Analysis

The following packages were evaluated from a reference project. Each is assessed for fit and assigned a phase.

### ✅ Use — Phase 1 (install now)

| Package | Why |
|---------|-----|
| `react-grid-layout` + `@types/react-grid-layout` | **Replaces `@dnd-kit` entirely.** Built specifically for bento/dashboard grids: drag, drop, AND resize in one library. Tiles get `{x, y, w, h}` position — far more powerful than sort-order alone. Responsive breakpoints built-in. |
| `framer-motion` | Login page staggered lettermark animation, tile entrance/exit transitions, DragOverlay polish. Much cleaner than CSS keyframe hacks. |
| `next-themes` | Replaces manual `document.classList.toggle('dark')`. Wraps the app in a `<ThemeProvider>`, provides `useTheme()` hook, prevents SSR hydration flash, reads OS preference automatically. |
| `sonner` | Replaces the Radix `@radix-ui/react-toast` — far simpler: just call `toast.success('Copied!')` anywhere with no context/state wiring. |
| `lodash` + `@types/lodash` | `debounce` for bio/name auto-save, `cloneDeep` for immutable tile state updates, `throttle` for drag events. Import individual functions to tree-shake (`import debounce from 'lodash/debounce'`). |
| `lenis` | Smooth scroll on the public profile page — lightweight, zero-config. |
| `sharp` | Server-side image processing in the `/api/link-preview` route (thumbnail resizing/optimizing OG images). Next.js also uses it internally for `next/image`. |
| `zustand` | UI state store (view mode, editing tile, active profile). |

### ✅ Use — Phase 3 (defer)

| Package | Why |
|---------|-----|
| `react-github-calendar` | GitHub contribution graph inside the GitHub tile. Live data. Phase 3 live-embed feature. |
| `@react-three/fiber` + `three` + `@react-three/postprocessing` + `postprocessing` | Enhanced 3D animated login wordmark (floating letters in 3D space). Optional visual upgrade. Too heavy for Phase 1. |
| `vanilla-tilt` | 3D perspective tilt on tile hover — decorative polish. Phase 3. |

### ❌ Skip (with reasons)

| Package | Reason |
|---------|--------|
| `@aws-sdk/client-s3` | We use **Firebase Storage**, not AWS S3. |
| `@clerk/nextjs` | We use **Firebase Auth** (Google + GitHub OAuth). Clerk is a full auth platform that would conflict. |
| `mongoose` | We use **Firestore** (NoSQL). Mongoose is a MongoDB ODM — wrong database entirely. |

### ℹ️ Already in `package.json` (no action needed)

`@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `dotenv`, `tailwind-merge`, `tailwindcss-animate`, `react`, `react-dom`, `next`, `firebase`

> **Note on versions:** The reference project uses `next: 16.1.4` and `react: 19.2.3`. Current repo is on `next: 15.5.9` and `react: ^19.2.1`. The diff is minor — do not upgrade Next.js mid-Phase-1 as it may break App Router behavior. Pin upgrades to the start of Phase 2.

---

## 3. Full Stack Architecture Decision

### Auth — Firebase Authentication
- **Google OAuth** + **GitHub OAuth** via Firebase Auth
- Both are one-click sign-ins — zero passwords to manage
- `onAuthStateChanged` listener manages session lifecycle (persists across tabs and page refreshes)
- After first login, user is directed to `/onboarding` to **claim a unique username** (`connect.me/<username>`)
- Username uniqueness checked against Firestore before claim is committed

### Database — Firebase Firestore

```
/users/{uid}
  displayName: string
  username: string           ← unique, used as the public URL slug
  avatarUrl: string          ← Firebase Storage download URL
  bio: string                ← max 150 chars
  location?: string
  theme: ProfileTheme
  createdAt: Timestamp

/users/{uid}/tiles/{tileId}
  type: TileType
  title?: string
  content?: string
  size: TileSize
  order: number              ← drag-sort index
  url?: string
  metadata: {
    imageStoragePath?: string    ← Firebase Storage path
    videoStoragePath?: string    ← Firebase Storage path
    linkPreview?: LinkPreview    ← OG metadata
    ...
  }
  createdAt: Timestamp

/usernames/{username}        ← lookup map for uniqueness checks
  uid: string
```

Why Firestore?
- Real-time listeners: tile change on dashboard → public profile updates immediately
- Already in `package.json` (`firebase ^11.9.1`) — no extra install
- Free tier (Spark plan) handles early-stage product comfortably
- Per-user security via Firestore rules

### Media Storage — Firebase Storage

```
/avatars/{uid}/avatar.{ext}            ← profile picture (max 5 MB)
/tiles/{uid}/{tileId}/image.{ext}      ← tile image (max 10 MB)
/tiles/{uid}/{tileId}/video.{ext}      ← tile video (max 50 MB)
```

- Only the authenticated owner (`uid`) can write; anyone can read
- Returns a permanent download URL stored in the Firestore tile document

### Link Preview — Next.js Route Handler (OG Scraper)

When a user adds any link URL to a tile, the app calls:

```
GET /api/link-preview?url=<encoded-url>
```

The server-side handler:
1. Fetches the target URL (avoids browser CORS restrictions)
2. Parses `og:title`, `og:description`, `og:image`, `og:site_name`, and favicon
3. Returns `{ title, description, image, favicon, siteName }`
4. The result is stored as `tile.metadata.linkPreview` in Firestore

**What this means for tiles:** Any link — Instagram, LinkedIn, a blog post, a GitHub repo — automatically gets a rich card preview with thumbnail, domain name, and description, shown directly in the tile.

---

## 4. Login Page — Complete Redesign

### Design Principle
**Minimal. Animated. Theme-aware.**

- Full screen: pure white (light) or `zinc-950` (dark) — no gradients, no noise
- Respects OS `prefers-color-scheme` before user preference is loaded
- No navigation, no footer, no marketing copy
- Single centered card that fades in smoothly on load

### Lettermark Animation
The "Connect.me" wordmark uses a staggered letter entrance:
- Each character is wrapped in a `<span>` with an `animation-delay` incrementing by 40ms
- Animation: `translateY(8px) → translateY(0)` + `opacity: 0 → 1` over 400ms ease-out
- After all letters settle (~400ms), the CTA button fades in

### User Flow

```
/login
  ↓
[Animated "Connect.me" wordmark]
[Single "Get Started" / "Continue" button — fades in after animation]
  ↓ click
[Slide-up panel or inline expansion]
  ├── [G]  Continue with Google
  └── [⬡]  Continue with GitHub
  ↓ OAuth success
  ├── Existing user  → /dashboard
  └── New user       → /onboarding  (username claim)
```

No email/password fields. No "Forgot password". No sign-up form. Just two clear options.

---

## 5. Username Onboarding (New Users Only)

Route: `/onboarding`

- Pre-fills Google/GitHub display name and avatar
- Input: "Choose your username" with live `connect.me/____` preview
- Debounced Firestore lookup against `/usernames/` for availability
- Shows: ✅ available / ❌ taken / ⚠️ invalid characters
- On confirm → atomically writes `/users/{uid}` + `/usernames/{username}` → redirects to `/dashboard`

---

## 6. Session & Route Protection

```typescript
// src/hooks/use-auth.ts
import { getAuth, onAuthStateChanged } from 'firebase/auth';
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => onAuthStateChanged(getAuth(), (u) => { setUser(u); setLoading(false); }), []);
  return { user, loading };
}
```

```typescript
// src/middleware.ts
// Redirects unauthenticated users away from /dashboard, /onboarding
// Redirects authenticated users away from /login
```

- Session is persisted by Firebase SDK across page refreshes and tabs with no extra work
- Loading state prevents flash of wrong content on initial render

---

## 7. Updated File Structure

```
src/
├── lib/
│   └── firebase/
│       ├── config.ts             ← Firebase app init (reads env vars)
│       ├── auth.ts               ← signInWithGoogle, signInWithGithub, signOut
│       ├── firestore.ts          ← getProfile, setProfile, addTile, updateTile, deleteTile, reorderTiles
│       └── storage.ts            ← uploadAvatar, uploadTileImage, uploadTileVideo
├── store/
│   └── profile-store.ts          ← Zustand (UI state only: view mode, active editing tile)
├── types/
│   └── profile.ts                ← Updated with heading, LinkPreview, imageStoragePath, order
├── hooks/
│   ├── use-auth.ts               ← Firebase auth state wrapper
│   ├── use-profile.ts            ← Firestore real-time profile listener
│   └── use-mobile.tsx            ← existing
├── components/
│   ├── dashboard/
│   │   ├── dashboard-layout.tsx
│   │   ├── profile-sidebar.tsx
│   │   ├── tile-grid.tsx
│   │   ├── tile-card.tsx
│   │   ├── tile-edit-dialog.tsx
│   │   ├── control-dock.tsx
│   │   └── settings-panel.tsx
│   └── profile/
│       ├── tile-renderer.tsx     ← existing + updates
│       └── public-profile.tsx    ← new
├── app/
│   ├── page.tsx                  ← Landing (no change)
│   ├── login/page.tsx            ← REPLACE: minimal animated login
│   ├── onboarding/page.tsx       ← NEW: username claim
│   ├── dashboard/page.tsx        ← Thin orchestrator
│   ├── [username]/page.tsx       ← Public profile (reads Firestore)
│   ├── api/
│   │   └── link-preview/route.ts ← NEW: OG metadata scraper
│   └── globals.css
└── middleware.ts                  ← NEW: route protection
```

---

## 8. Updated Types (`src/types/profile.ts`)

```typescript
export const BIO_MAX_CHARS = 150;

export type TileSize = '1x1' | '2x1' | '1x2' | '2x2' | '3x1';

export type TileType =
  | 'link' | 'social' | 'image' | 'video' | 'text' | 'heading'
  | 'spotify' | 'github' | 'youtube' | 'bio' | 'discord'
  | 'luma' | 'instagram' | 'whatsapp' | 'map' | 'email' | 'project';

export interface LinkPreview {
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  url: string;
}

// Grid layout position for react-grid-layout
export interface TileLayout {
  x: number;   // column start (0-based)
  y: number;   // row start (0-based, RGL manages this automatically)
  w: number;   // width in columns (1–3)
  h: number;   // height in rows (1–2)
}

// Helper: derive w/h from TileSize shorthand
export const tileSizeToLayout: Record<TileSize, Pick<TileLayout, 'w' | 'h'>> = {
  '1x1': { w: 1, h: 1 },
  '2x1': { w: 2, h: 1 },
  '1x2': { w: 1, h: 2 },
  '2x2': { w: 2, h: 2 },
  '3x1': { w: 3, h: 1 },
};

export interface Tile {
  id: string;
  type: TileType;
  title?: string;
  content?: string;
  size: TileSize;                   // shorthand label (used by size picker buttons)
  layout: TileLayout;              // actual grid position managed by react-grid-layout
  url?: string;
  metadata?: {
    brand?: string;
    imageUrl?: string;              // remote URL
    imageStoragePath?: string;      // Firebase Storage path (Phase 2+)
    videoUrl?: string;
    videoStoragePath?: string;      // Firebase Storage path (Phase 2+)
    description?: string;
    username?: string;
    accentColor?: string;
    label?: string;
    isGif?: boolean;
    location?: string;
    previews?: string[];
    buttonText?: string;
    linkText?: string;
    linkPreview?: LinkPreview;      // OG metadata from /api/link-preview
  };
}

export interface ProfileTheme {
  mode: 'light' | 'dark';
  font: 'body' | 'headline' | 'serif' | 'mono';
  background: 'white' | 'mesh' | 'gradient-blue' | 'gradient-sunset';
}

export interface UserProfile {
  uid: string;                      // Firebase Auth UID
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  location?: string;
  tiles: Tile[];
  theme: ProfileTheme;
  createdAt?: string;
}
```

---

## 9. Grid & Drag-Drop — `react-grid-layout`

**`@dnd-kit` is dropped in favour of `react-grid-layout`.** This is a dedicated dashboard grid library that provides drag, drop, AND resize in one package — exactly what a bento builder needs.

| Feature | @dnd-kit | react-grid-layout |
|---------|----------|-------------------|
| Drag tiles | ✅ | ✅ |
| Touch support | ✅ (with sensors) | ✅ (built-in) |
| Resize tiles | ❌ (needs separate lib) | ✅ built-in |
| Grid position (x,y) | ❌ (sort order only) | ✅ |
| Responsive breakpoints | ❌ | ✅ |
| Ghost/placeholder | Manual | ✅ built-in |

```bash
npm install react-grid-layout @types/react-grid-layout
```

```tsx
// src/components/dashboard/tile-grid.tsx
import GridLayout, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGrid = WidthProvider(GridLayout);

// Each tile in the layout array:
// { i: tile.id, x: tile.layout.x, y: tile.layout.y, w: tile.layout.w, h: tile.layout.h }

// onLayoutChange: receives new Layout[] → update all tile.layout values in store
// Resize handle in bottom-right corner of each tile (styled to be subtle)
```

### Size picker vs. resize handle
- **Size picker buttons** (1×1, 2×1, 1×2, 2×2) remain in the hover overlay — they are quick-presets that snap `w/h` to known values
- **Drag-resize handle** (bottom-right `react-grid-layout` handle) allows freeform resizing within the grid
- When the size picker is used, it calls `onSizeChange` which updates `tile.size` AND `tile.layout.w/h` together

---

## 10. Component Details

### 10.1 `ProfileSidebar`
- **Avatar:** clickable circle → dialog with two tabs: **Upload file** | **Use URL**
  - Phase 1: FileReader → base64 in local state
  - Phase 2: FileReader → Firebase Storage → download URL saved to Firestore
- **Display name:** inline editable large input, writes on blur
- **Bio:** `<Textarea>` with hard limit at `BIO_MAX_CHARS (150)`, live counter

### 10.2 `TileGrid`
- `ResponsiveGrid` from `react-grid-layout` (WidthProvider-wrapped)
- CSS imported: `react-grid-layout/css/styles.css` + `react-resizable/css/styles.css`
- `onLayoutChange` updates all tile layout positions in the store
- `view === 'mobile'` → constrains to `max-w-[375px]` container, `cols={2}`
- Desktop: `cols={3}`

### 10.3 `TileCard`
On hover shows exactly:
- **Top-right:** `<Trash2>` delete icon only — nothing else at the top
- **Bottom-center:** size picker pill with 4 quick-preset buttons (1×1 □, 2×1 ▭, 1×2 ▯, 2×2 ▣)
- `react-grid-layout` resize handle remains visible at bottom-right for freeform resizing
- `framer-motion` `AnimatePresence` used for hover overlay fade-in/out

### 10.4 `TileEditDialog`
- Title/heading input
- Content textarea
- **Image:** file upload (`<input type="file">`) OR URL input — whichever is filled takes priority
- **URL field:** on blur calls `/api/link-preview`, shows OG preview card below the input
- Accent color picker (text/heading tiles)
- Uses `sonner` `toast.success()` on save confirmation
- For Phase 1: file upload stores base64 locally; Phase 2 uploads to Firebase Storage

### 10.5 `ControlDock` (bottom floating dock)
```
[⚙ Settings]   [Share] | [🔗][🖼][T][H][📹] | [☀/🌙][📱/🖥]
```
- **Far left (separate button):** Settings icon → opens `SettingsPanel` sheet
- **Main pill** (left → right):
  - Share button (accent color) — uses `sonner` toast on copy
  - Divider
  - Add: Link, Image, Text, Heading, Video
  - Divider
  - Theme toggle (`useTheme()` from `next-themes`)
  - View toggle (desktop/mobile preview)

### 10.6 `SettingsPanel` (left-side Sheet)
- Profile URL display: `connect.me/<username>` with copy button (sonner toast)
- Theme background: white / gradient-blue / gradient-sunset / mesh
- Font selector: body / headline / serif / mono
- Phase 2+: Sign out button, delete account

### 10.7 `PublicProfile`
Desktop: `[Sticky sidebar: avatar + name + bio]` | `[Scrollable tile grid (read-only GridLayout)]`
Mobile:
```
Circle avatar (centered, 96px)
Display name (centered, large)
Bio (centered, muted, max 150 chars shown)
Tile grid (2 columns, full width, no drag/resize)
```
`lenis` smooth scroll applied to the public profile page container.

---

## 11. Link Preview in Tiles

When any tile has a URL and `tile.metadata.linkPreview` is populated, `TileRenderer` shows:
- `og:image` as card background or left thumbnail
- Site favicon + `siteName` as brand badge
- `og:title` as the tile heading
- `og:description` truncated to ~80 chars as subtitle

This means a LinkedIn profile link, GitHub repo, blog post, or any website becomes a rich visual card automatically.

---

## 12. Theme System — `next-themes`

`next-themes` replaces the manual `document.classList.toggle('dark')` approach. It is SSR-safe and prevents hydration flicker.

```tsx
// src/app/layout.tsx — wrap children in ThemeProvider
import { ThemeProvider } from 'next-themes';
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  {children}
</ThemeProvider>
```

```tsx
// anywhere in the app
import { useTheme } from 'next-themes';
const { theme, setTheme } = useTheme();
// theme toggle:
setTheme(theme === 'dark' ? 'light' : 'dark');
```

- Phase 1: theme stored in `localStorage` by `next-themes` automatically — survives refresh
- Phase 2: on login, read Firestore theme preference and call `setTheme()` to sync
- Login page: `defaultTheme="system"` means it inherits OS preference before any user choice
- Background and font preferences remain in Zustand store (these are profile-level, not system-level)

---

## 13. Mobile Responsiveness

### Tile grid columns
| Viewport | Columns |
|----------|---------|
| ≥ 1024px | 3 columns |
| 768–1024px | 2 columns |
| < 768px | 2 columns (span-3 tiles go full width) |

### Dashboard on mobile
- Sidebar stacks above the grid (flex-col)
- Bottom dock shrinks to icon-only, scrollable horizontally

### Public profile on mobile
```css
@media (max-width: 768px) {
  .public-layout     { flex-direction: column; align-items: center; }
  .public-sidebar    { text-align: center; width: 100%; }
  .public-avatar     { margin: 0 auto 1.5rem; }
}
```

---

## 14. Tile Types Reference

| Type | Default size | Description |
|------|-------------|-------------|
| `heading` | 2×1 | Bold label tile — transparent background, large font, moveable section title |
| `text` | 2×1 | Text block with accent background color |
| `image` | 2×2 | Image tile — upload or URL; shows `linkPreview.image` if URL given |
| `video` | 2×2 | Video embed — upload or URL |
| `link` | 1×1 | External URL — shows rich OG preview card |
| `social` | 1×1 | Social platform (LinkedIn, Twitter, GitHub, Instagram, etc.) |
| `email` | 2×1 | Email contact card |
| `map` | 2×1 | Location / map image |
| `project` | 2×2 | Project showcase with 2×2 preview thumbnail grid |

---

## 15. Execution Phases

---

### PHASE 1 — Dashboard UI (Mock Data, No Backend)

**Goal:** Build the complete, beautiful, interactive dashboard and public profile UI. Everything functional in the browser with mock data. No login, no database, no uploads yet.

**Steps:**
1. Install Phase 1 dependencies (see Section 18)
2. Update `src/types/profile.ts` — add `heading`, `LinkPreview`, `TileLayout`, `tileSizeToLayout`, `BIO_MAX_CHARS`, `imageStoragePath` — replace `order` with `layout: TileLayout`
3. Update `src/app/layout.tsx` — wrap with `next-themes` `<ThemeProvider>`, add `<Toaster>` from sonner
4. Update `src/lib/mock-data.ts` — add `layout` field to all mock tiles
5. Create `src/store/profile-store.ts` — Zustand UI state (view mode, editing tile, active profile from mock data)
6. Create `src/components/dashboard/profile-sidebar.tsx` — avatar (base64/URL in Phase 1), name, bio with 150-char limit, lodash `debounce` on bio input
7. Create `src/components/dashboard/tile-card.tsx` — `react-grid-layout` child element, hover overlay with framer-motion: delete top-right / size-picker bottom-center
8. Create `src/components/dashboard/tile-grid.tsx` — `ResponsiveGrid` (WidthProvider) wrapper, `cols={3}` desktop / `cols={2}` mobile-preview, CSS imports for RGL + react-resizable
9. Create `src/components/dashboard/tile-edit-dialog.tsx` — edit dialog, URL link preview on blur, base64 image, `sonner` toast on save
10. Create `src/components/dashboard/control-dock.tsx` — bottom dock, `useTheme()` for theme toggle, add tile / view toggle, `sonner` toast for share copy
11. Create `src/components/dashboard/settings-panel.tsx` — Sheet panel (background + font controls via store)
12. Create `src/components/dashboard/dashboard-layout.tsx` — assembles all dashboard pieces
13. Refactor `src/app/dashboard/page.tsx` → thin wrapper, imports `DashboardLayout`
14. Create `src/components/profile/public-profile.tsx` — responsive public layout (desktop + mobile), `lenis` smooth scroll
15. Update `src/app/[username]/page.tsx` → use `PublicProfile` component with mock data
16. Update `src/components/profile/tile-renderer.tsx` — add `heading` type, `linkPreview` card rendering, `imageData` base64 fallback
17. Update `src/app/globals.css` — remove manual `.bento-grid` / `.tile-*` classes (replaced by RGL), add responsive container styles
18. **REPLACE** `src/app/login/page.tsx` — framer-motion staggered lettermark animation, Google/GitHub buttons are UI-only stubs in Phase 1
19. Create `src/app/api/link-preview/route.ts` — OG metadata scraper using `sharp` for thumbnail, works independently of auth

**Phase 1 deliverable:** Pixel-perfect, fully interactive dashboard at `/dashboard`. Public profile at `/juarezfilho`. Link previews working. Animated login page. No TypeScript errors.

---

### PHASE 2 — Firebase Auth + Firestore + Storage

**Goal:** Connect real identities. Each Google/GitHub user gets their own persistent profile that survives refresh and is visible to anyone at `connect.me/<username>`.

**Steps:**
1. Create Firebase project — enable Auth (Google + GitHub providers), Firestore, Storage
2. Add `.env.local` with `NEXT_PUBLIC_FIREBASE_*` variables
3. Create `src/lib/firebase/config.ts` — init Firebase app
4. Create `src/lib/firebase/auth.ts` — `signInWithGoogle`, `signInWithGithub`, `signOut`
5. Create `src/lib/firebase/firestore.ts` — full CRUD helpers for user + tiles
6. Create `src/lib/firebase/storage.ts` — `uploadAvatar`, `uploadTileImage`, `uploadTileVideo` with progress
7. Create `src/hooks/use-auth.ts` — `onAuthStateChanged` wrapper with loading state
8. Create `src/hooks/use-profile.ts` — Firestore `onSnapshot` real-time listener
9. Create `src/app/onboarding/page.tsx` — username claim with debounced uniqueness check
10. Create `src/middleware.ts` — route protection (unauthed → /login; authed /login → /dashboard)
11. Wire login page Google/GitHub buttons to real Firebase Auth calls
12. Update `ProfileSidebar` — avatar upload via Firebase Storage (replaces base64)
13. Update `TileEditDialog` — image/video upload via Firebase Storage (with progress bar)
14. Update dashboard components — write all changes to Firestore (not just local state)
15. Update `src/app/[username]/page.tsx` — load from Firestore by username slug
16. Deploy Firestore security rules (see below)
17. Deploy Storage security rules

**Firestore security rules:**
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if true;
      allow write: if request.auth.uid == uid;
      match /tiles/{tileId} {
        allow read: if true;
        allow write: if request.auth.uid == uid;
      }
    }
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

**Phase 2 deliverable:** Full multi-user, persistent app. Google/GitHub login creates a real, isolated profile. Changes persist across devices. Public profiles load live from Firestore.

---

### PHASE 3 — Advanced Features & Production Polish

**Goal:** Production quality — live integrations, SEO, analytics, performance.

#### 3a. Live API Embeds
- **Spotify tile:** embed current track via Spotify oEmbed / Web API
- **GitHub tile:** contribution graph using `react-github-calendar` — zero-config component
- **YouTube tile:** subscriber count + latest video via YouTube Data API v3
- All API keys stay server-side in Next.js Route Handlers

#### 3b. SEO & Sharing
- Dynamic OG meta tags for every public profile — `src/app/[username]/layout.tsx` with `generateMetadata()` from Firestore
- Share button copies `https://connect.me/<username>` with toast confirmation
- Profile shows rich preview card on iMessage, WhatsApp, Slack, Twitter

#### 3c. Media Polish
- Avatar crop/zoom dialog before upload
- Progress indicator for video uploads
- Image optimization via `next/image` with proper `sizes` and `quality` props

#### 3d. Theme & Customization
- Background gradient builder (custom stops, live preview)
- Per-profile accent color
- Background image upload option
- `vanilla-tilt` hover tilt effect on tiles (opt-in toggle in settings)
- Optional 3D login wordmark using `@react-three/fiber` + `three` + `@react-three/postprocessing`

#### 3e. Analytics
- Firestore increment on each public profile page visit
- Per-tile click tracking (opt-in)
- Simple stats panel in Settings: total views, top tiles

#### 3f. Performance
- Firestore offline persistence (`enableIndexedDbPersistence`)
- Suspense boundaries with skeleton loaders for Firestore data
- `next/image` for all remote images

---

## 16. Files to Create — Phase 1

| File | Purpose |
|------|---------|
| `src/store/profile-store.ts` | Zustand UI + profile state |
| `src/components/dashboard/dashboard-layout.tsx` | Dashboard assembly |
| `src/components/dashboard/profile-sidebar.tsx` | Avatar + name + bio |
| `src/components/dashboard/tile-grid.tsx` | `react-grid-layout` responsive grid |
| `src/components/dashboard/tile-card.tsx` | RGL grid item + framer-motion hover controls |
| `src/components/dashboard/tile-edit-dialog.tsx` | Edit modal with link preview + image + sonner |
| `src/components/dashboard/control-dock.tsx` | Bottom floating dock |
| `src/components/dashboard/settings-panel.tsx` | Settings Sheet |
| `src/components/profile/public-profile.tsx` | Public profile layout + lenis scroll |
| `src/app/api/link-preview/route.ts` | OG metadata scraper API |

## 17. Files to Modify — Phase 1

| File | Change |
|------|--------|
| `src/types/profile.ts` | Add `heading`, `LinkPreview`, `TileLayout`, `tileSizeToLayout`, `BIO_MAX_CHARS`; replace `order` with `layout` |
| `src/app/layout.tsx` | Add `next-themes` `<ThemeProvider>` + sonner `<Toaster>` |
| `src/lib/mock-data.ts` | Add `layout: { x, y, w, h }` to every mock tile |
| `src/app/dashboard/page.tsx` | Thin wrapper using `DashboardLayout` |
| `src/app/[username]/page.tsx` | Use `PublicProfile` component |
| `src/app/login/page.tsx` | **Replace** with framer-motion animated version |
| `src/app/globals.css` | Remove `.bento-grid` / `.tile-*` (replaced by RGL); add container styles |
| `src/components/profile/tile-renderer.tsx` | Add `heading` type, `linkPreview` card, `imageData` support |

## 18. Dependencies

### Phase 1 — Install Now
```bash
npm install react-grid-layout @types/react-grid-layout
npm install framer-motion
npm install next-themes
npm install sonner
npm install zustand
npm install lodash @types/lodash
npm install lenis
npm install sharp
```

### Phase 2 — No new installs
```bash
# firebase ^11.9.1 is already in package.json
# All Firebase services (Auth, Firestore, Storage) are in the same SDK
```

### Phase 3 — Install when building those features
```bash
npm install react-github-calendar           # GitHub tile live calendar
npm install @react-three/fiber three        # 3D login animation
npm install @react-three/postprocessing postprocessing  # 3D post-processing
npm install vanilla-tilt                    # tile tilt hover effect
```

## 19. Environment Variables (Phase 2)

```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

`NEXT_PUBLIC_*` keys are intentionally public — Firebase client SDK is designed for browser exposure. Security comes from Firestore/Storage rules, not hidden keys.

---

## 20. Phase 1 Success Criteria

- [ ] Login page: clean white/dark (next-themes), framer-motion staggered "Connect.me" letter animation, single CTA
- [ ] Login page shows Google + GitHub sign-in buttons (UI stubs in Phase 1)
- [ ] Dashboard: left sidebar (avatar, name, bio) + full-width react-grid-layout tile grid
- [ ] Bio limited to exactly 150 chars — live counter, hard cap with lodash debounce on input
- [ ] Tiles drag-and-drop with built-in ghost/placeholder via react-grid-layout
- [ ] Tiles freeform resize via react-grid-layout resize handle (bottom-right corner)
- [ ] Tile hover: framer-motion overlay — delete icon at top-right only; size preset picker at bottom-center
- [ ] 4 size presets work (1×1, 2×1, 1×2, 2×2) — snap tile w/h instantly
- [ ] `heading` tile type: transparent background, large bold text, fully draggable/resizable
- [ ] URL in `TileEditDialog` triggers OG preview fetch and shows card preview
- [ ] Image tiles support URL input (file upload UI shown as "Phase 2" placeholder)
- [ ] Bottom dock: add Link, Image, Text, Heading, Video; `next-themes` toggle; desktop/mobile toggle
- [ ] Share/copy actions use `sonner` toast notifications
- [ ] Mobile view toggle constrains grid to 375px width, cols=2
- [ ] Settings panel opens from bottom-left icon; font + background controls functional
- [ ] Public profile at `/[username]`: desktop layout (sidebar + grid) with lenis smooth scroll
- [ ] Public profile mobile: stacked centered avatar → name → bio → tile grid
- [ ] Tile deletes on dashboard also remove from public profile (shared Zustand store)
- [ ] All dashboard components are independently importable — no monolith
- [ ] Zero TypeScript errors, zero React rules violations
- [ ] `/api/link-preview` returns OG data for any public URL

---

## 21. What Is Explicitly Deferred to Phase 2+

> No stub code, no half-implementations, no TODO comments for these:

- Real Google / GitHub OAuth (Phase 2)
- Firestore per-user data persistence (Phase 2)
- Firebase Storage file uploads — avatar, images, videos (Phase 2)
- Username claim / onboarding flow (Phase 2)
- Route protection middleware (Phase 2)
- Sign out button (Phase 2)
- Live Spotify / GitHub / YouTube embeds (Phase 3)
- `react-github-calendar` GitHub contribution tile (Phase 3)
- Profile OG meta tags for sharing (Phase 3)
- View count analytics (Phase 3)
- `vanilla-tilt` tile hover effect (Phase 3)
- Three.js 3D login animation (Phase 3)
- Custom background image upload (Phase 3)

