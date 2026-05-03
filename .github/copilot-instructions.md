# Copilot Instructions for connect.me

## Project Overview

connect.me is a Next.js 15 app using the App Router with Turbopack, React 19, Tailwind CSS 4, and Zustand for state management. It features a drag-and-drop tile dashboard with public/private views.

**Knowledge Graph**: This project uses [graphify](https://github.com/safishamsi/graphify) for token optimization and code understanding.

### Graphify Configuration
- **Graph file**: `graphify-out/graph.json`
- **Report**: `graphify-out/GRAPH_REPORT.md`
- **HTML viz**: `graphify-out/graph.html`
- **GitHub**: https://github.com/safishamsi/graphify
- **MCP Server**: Configured in `.vscode/mcp.json` for agent access

### Token Optimization Rules
1. **Before answering codebase questions**: Check `graphify-out/graph.json` first
2. **After code changes**: Rebuild with `/graphify .`
3. **For large refactors**: Query with `/graphify query "question"`
4. **Skip redundant reads**: Use graph to avoid reading unconnected files

### Graph-Driven Development
- **God Nodes**: Check `GRAPH_REPORT.md` → "God Nodes" section
- **Communities**: Related files grouped - check before cross-cutting changes
- **Surprising Connections**: Review unexpected links in the report

## Dev Commands

- `npm run dev` - Dev server on port **9002** (not default 3000)
- `npm run typecheck` - Type checking
- `npm run lint` - Linting
- `npm run build && npm start` - Production build + start
- `npm run genkit:dev` / `genkit:watch` - AI development server

## Project Structure Rules

- Route groups: `(public)/` = visitor pages (`/`, `/login`, `/:username`), `(app)/` = auth pages (`/dashboard`)
- Shared components in `src/components/dashboard/` power both edit mode and public view
- State: Zustand store at `src/store/profile-store.ts` (persisted to localStorage)
- Types: `src/types/profile.ts`
- UI components: `src/components/ui/` (shadcn/ui based)

## Tech Stack Conventions

### Next.js 15+ (App Router)
- Use Server Components by default; add `'use client'` only when needed (interactivity, hooks)
- Always await params in page components: `const { username } = await params`
- Use `next/link` for navigation, not `<a>` tags
- Prefer Server Actions for form mutations
- Use metadata API in `layout.tsx` or `page.tsx` for SEO

### React 19
- Use functional components with hooks
- Prefer `useState`/`useReducer` for local state
- Use `useCallback` and `useMemo` sparingly (only for performance issues)
- React 19 automatic memoization means less manual optimization needed

### Tailwind CSS 4
- Use utility classes directly in JSX
- Follow mobile-first responsive design
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- Theme colors defined in `tailwind.config.ts`

### TypeScript
- Strict mode enabled
- Define types in `src/types/` for shared interfaces
- Use `type` instead of `interface` for object types (project preference)
- Avoid `any`; use `unknown` when type is truly unknown

### Zustand Store
- Store at `src/store/profile-store.ts`
- Persist to localStorage using zustand middleware
- Keep actions and state in same store file

## Coding Style

### Naming Conventions
- Components: PascalCase (`ProfileTile.tsx`)
- Files: kebab-case (`profile-store.ts`, `tile-grid.tsx`)
- Functions: camelCase (`handleClick`, `fetchData`)
- Constants: UPPER_SNAKE_CASE (`MAX_TILES`)
- CSS classes: kebab-case (Tailwind standard)

### Code Organization
- One component per file
- Co-locate types with components when component-specific
- Export components as named exports
- Use barrel exports sparingly (avoid index.ts files that re-export everything)

### Imports Order
1. React/Next.js imports
2. Third-party libraries
3. Absolute imports (`@/`, `~/` aliases)
4. Relative imports
5. Types and interfaces

Use automatic import sorting; separate groups with blank lines.

### Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- Semicolons required
- Trailing commas in multiline objects/arrays

## Tool Usage Rules

### MCP Servers
- **Context7**: MUST call `context7_resolve-library-id` before `context7_query-docs` unless user provides library ID in format `/org/project`
- **Next.js MCP** (dev server): Available at `http://localhost:9002/_next/mcp` when dev server running
- **Browser Playwright**: Use for UI testing and verification

### Skills
Load these skills with the `skill` tool when working with related features:
- `next-best-practices` - Next.js 15+ patterns, RSC boundaries, async APIs
- `next-cache-components` - Next.js 16 cache directives

### Context7 Documentation
- Can call each Context7 tool at most **3 times per question**
- If first query doesn't answer, retry with `researchMode: true`
- Do NOT include sensitive information in queries

### Graphify Commands (Quick Reference)
- `/graphify .` - Rebuild graph for current directory
- `/graphify query "question"` - Ask the graph
- `/graphify path NodeA NodeB` - Find shortest path
- `/graphify explain NodeName` - Explain a concept

## DCP (Data Compression Protocol) Rules

- **compress** is the ONLY tool for context management
- Use compress when sections are genuinely closed and raw conversation has served its purpose:
  - Research concluded and findings are clear
  - Implementation finished and verified
  - Exploration exhausted and patterns understood
  - Dead-end noise can be discarded
- DO NOT compress if:
  - Raw context is still relevant and needed for edits or precise references
  - Target content is still actively in progress
  - You may need exact code, error messages, or file contents in immediate next steps

## Component Patterns

### Dashboard Components
- Use `react-grid-layout` for draggable/resizable tiles
- Edit mode vs public view controlled via props or store state
- Tile data structure: `{ id, type, x, y, w, h, config }`

### UI Components (shadcn/ui)
- Located in `src/components/ui/`
- Use Radix UI primitives under the hood
- Customize via className props, not direct style modifications

## Common Tasks

### Adding a New Tile Type
1. Define type in `src/types/profile.ts`
2. Create component in `src/components/dashboard/`
3. Add to tile renderer switch/map
4. Update store initial state if needed

### Modifying Store
1. Update `src/store/profile-store.ts`
2. Ensure persistence works (check localStorage)
3. Update types if state shape changes

## Notes

- No test suite exists yet
- No CI workflows configured
- Dev server requires port 9002 (check if blocked)
- Phase 1 complete; Phase 2 adds Firebase Auth/Firestore
