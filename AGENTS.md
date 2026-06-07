# AGENTS.md

## Dev Commands

- `npm run dev` - Dev server on port **9002** (not default 3000)
- `npm run typecheck` - Type checking
- `npm run lint` - Linting
- `npm run build && npm start` - Production build + start
- `npm run genkit:dev` / `genkit:watch` - AI development server

## Project Structure

- Route groups: `(public)/` = visitor pages (`/`, `/login`, `/:username`), `(app)/` = auth pages (`/dashboard`)
- Shared components in `src/components/dashboard/` power both edit mode and public view
- State: Zustand store at `src/store/profile-store.ts` (persisted to localStorage)

## Tech Stack

- Next.js 15 (App Router, Turbopack), React 19, Tailwind CSS 4
- react-grid-layout for drag/resize tiles
- Phase 1 complete; Phase 2 adds Firebase Auth/Firestore

## Available Skills

- `next-best-practices` - Next.js 15+ patterns, RSC boundaries, async APIs
- `next-cache-components` - Next.js 16 cache directives

Load with the `skill` tool when working with Next.js features.

## Notes

- No test suite exists yet
- No CI workflows configured
- Dev server requires port 9002 (check if blocked)

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
- Environment-managed tools (task, skill, todowrite, todoread) outputs are automatically preserved during compression
- `<dcp-message-id>` and `<dcp-system-reminder>` tags are environment-injected metadata - do not output them

## Context7 Documentation Rules

- **MUST** call `context7_resolve-library-id` before `context7_query-docs` unless user provides library ID in format `/org/project` or `/org/project/version`
- Can call each Context7 tool at most **3 times per question**
- If first query doesn't answer the question, retry with `researchMode: true`
- Do NOT include sensitive information (API keys, passwords, credentials, personal data, proprietary code) in queries
- Select libraries based on: name similarity, description relevance, documentation coverage, source reputation, and benchmark score

## MCP (Model Context Protocol) Configuration

This project uses MCP servers for enhanced capabilities:

### Context7 MCP Server
- **Type**: Remote
- **URL**: https://mcp.context7.com/mcp
- **Purpose**: Provides up-to-date documentation and code examples for programming libraries and frameworks
- **Usage**: Use `context7_resolve-library-id` and `context7_query-docs` tools to query documentation

### Browser Playwright MCP Server
- **Type**: Local
- **Command**: `npx -y @anthropic/mcp-server-playwright`
- **Purpose**: Browser automation and web interaction capabilities
- **Status**: Enabled

### Next.js MCP Endpoint (Dev Server)
- **Endpoint**: `/_next/mcp` (development only)
- **Port**: 9002 (configured in package.json)
- **Purpose**: AI-assisted debugging via Next.js MCP tools
- **Available Tools**:
  - `get_errors` - Get current errors from dev server
  - `get_routes` - Discover all routes by scanning filesystem
  - `get_project_metadata` - Get project path and dev server URL
  - `get_page_metadata` - Get runtime metadata about current page render
  - `get_logs` - Get path to Next.js development log file
  - `get_server_action_by_id` - Locate a Server Action by ID

### MCP Request Format
```bash
curl -X POST http://localhost:9002/_next/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "<tool-name>",
      "arguments": {}
    }
  }'
```

Reference: https://nextjs.org/docs/app/guides/mcp