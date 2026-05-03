# Connect.me

A modern, drag-and-drop personal link-in-bio builder — like Linktree meets Bento, built with Next.js 15 and React 19.

## Features

- **WYSIWYG Dashboard** — drag, resize, and inline-edit tiles in a grid layout. What you see in the editor is exactly what visitors see on your public profile.
- **Tile Types** — link (with OG-preview fetch), image, text, heading, social, email, and more.
- **Unified Rendering** — shared `ProfileSidebar`, `TileGrid`, and `TileCard` components power both the dashboard (edit mode) and `/:username` (read-only public view).
- **Theme System** — light/dark mode via `next-themes`, configurable font (headline / mono / sans) and background (solid, gradient).
- **Responsive Grid** — `react-grid-layout` with dynamic column count (2–4) and square tiles driven by container width.
- **Route Groups** — `(public)/` for visitor-facing pages, `(app)/` for authenticated pages. URLs are unaffected.
- **Optimised Assets** — `next/font/google` for zero-layout-shift fonts, `next/image` where applicable.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix primitives |
| State | Zustand (persisted to localStorage) |
| Grid | react-grid-layout |
| Animation | Framer Motion, Lenis smooth scroll |
| AI | Genkit + Google GenAI (scaffolded) |
| Backend (Phase 2) | Firebase Auth, Firestore, Firebase Storage* |

**\*Firebase Storage requires Blaze (Pay-as-you-go) plan.** See [docs/firebase-storage-notice.md](docs/firebase-storage-notice.md) for details and workarounds.

## Project Structure

```
src/
├── app/
│   ├── (public)/            # Visitor routes: /, /login, /[username]
│   ├── (app)/               # Auth routes: /dashboard
│   ├── api/link-preview/    # OG metadata fetch endpoint
│   ├── layout.tsx           # Root layout (fonts, theme provider)
│   └── globals.css          # Tailwind directives + RGL imports
├── components/
│   ├── dashboard/           # Shared edit/view components
│   │   ├── profile-sidebar  # Sidebar (editable prop)
│   │   ├── tile-grid        # Grid engine (readOnly prop)
│   │   ├── tile-card        # Tile wrapper (readOnly prop)
│   │   ├── control-dock     # Floating toolbar (dashboard only)
│   │   ├── settings-panel   # Theme sheet (dashboard only)
│   │   └── tile-edit-dialog # Modal editor (dashboard only)
│   ├── profile/
│   │   ├── public-profile   # Public page shell (uses shared components)
│   │   └── tile-renderer    # Per-type tile content renderer
│   └── ui/                  # shadcn/ui primitives
├── store/
│   └── profile-store.ts     # Zustand store (profile + tiles)
├── types/
│   └── profile.ts           # Tile, UserProfile, GRID_CONFIG
└── lib/
    ├── mock-data.ts          # Seed profile (Phase 1)
    ├── theme-utils.ts        # BG/font class maps
    └── utils.ts              # cn() helper
```

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server (Turbopack, port 9002)
npm run dev

# Type-check
npm run typecheck

# Production build
npm run build && npm start
```

## Roadmap

- **Phase 1** ✅ — Dashboard UI, public profile, tile system, theme engine, WYSIWYG parity
- **Phase 2** — Firebase Auth, Firestore persistence, Storage uploads, real `/[username]` routes
- **Phase 3** — Custom domains, analytics, SEO, monetisation
