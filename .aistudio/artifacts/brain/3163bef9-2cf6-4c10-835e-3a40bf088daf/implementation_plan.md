# PocketKit 400-Tool Expansion & Theme Architecture Plan

Expand PocketKit from 206 to 400+ client-side web utility tools while fixing dark/light theme switching with a 3-way toggle (Light, Dark, and System Auto) and introducing sub-category pill navigation for instant browsing across the massive catalog.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design choices were confirmed in Phase 1 interactive planning:

- **Confirmed Domain Focus**: Developer, API, network, database, and system architecture utilities (DevOps config generators, SQL dialect converters, API schema generators, networking & CIDR calculators, code AST inspectors, and cloud infrastructure validators).
- **Confirmed Theme Switcher Behavior**: Light, Dark, and System Auto with smooth transition between modes, persisting preference to `localStorage` and syncing with OS preferences when in Auto mode.
- **Confirmed Catalog Browsing**: Instant fuzzy search with sub-category pill tags (e.g. *Docker & Containers*, *SQL & ORM*, *API & Webhooks*, *DNS & Networking*, *Security & Auth*, *Formatting & AST*) for rapid multi-dimensional filtering across 400 tools.

---

## 1. Overview & Core Concept

- **What It Does**: PocketKit becomes a comprehensive, all-in-one developer and web professional utility workbench containing 400+ instant, privacy-first, 100% client-side tools. It eliminates the need to visit dozens of ad-cluttered single-purpose websites for routine development, formatting, calculation, conversion, and inspection tasks.
- **Target Audience / Persona**: Software engineers, DevOps/SREs, backend developers, frontend designers, system administrators, security analysts, and technical students who need immediate, offline-ready utilities without sending sensitive data, keys, or code snippets to third-party servers.
- **Key Value**: Instant load performance with zero-bundle bloat via dynamic `React.lazy()` chunking, zero latency client-side execution, unified copy/download actions, preset sample data, and accessible dark/light/system theme switching.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Catalog Exploration & Filtering**: Users land on the catalog featuring 400 tools. The header displays an updated count badge (`400+ Tools`). Users can click top-level category buttons (Code & Dev, DevOps & Cloud, Network & Sysadmin, APIs & DB, Security & Crypto, Text, Audio, Math, Media) and instantly refine the list using horizontal sub-category pill tags or instant fuzzy text search (`Cmd+K`).
2. **Theme Toggling**: Users click the theme button in the header to cycle smoothly between `Light` (clean slate-50/white surface), `Dark` (deep zinc-950 slate surface with high-contrast text), and `System Auto` (follows OS `prefers-color-scheme`). An active indicator and icon clearly reflect the current state.
3. **Tool Execution & Output Interaction**:
   - Every new tool displays an input panel with one-click **"Load Sample"** preset buttons.
   - Outputs update instantaneously in real-time or upon action click.
   - Standardized action bar: one-click **Copy to Clipboard** with visual toast/confirmation, and **Download File** (`.yaml`, `.sql`, `.json`, `.ts`, `.sh`, `.txt`, `.conf`) with intuitive filename formatting.

### Visual Identity & Theme Tokens
- **Theme Constitution**:
  - Light mode: Canvas `#F8FAFC` (slate-50), Structural card `#FFFFFF` with hairline border `border-slate-200/80`, Typography `#0F172A` (slate-900).
  - Dark mode: Canvas `#090D16` (deep dark slate), Structural card `#0F172A` with hairline border `border-slate-800`, Typography `#F8FAFC` (slate-50).
  - Accent Token: Indigo/Blue (`#3B82F6` / `#2563EB`) strictly reserved for active states, primary CTA buttons, and focus rings.
- **Typographic Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` or modern geometric display font, balanced with `text-wrap: balance`.
  - Body & Labels: Crisp 14px–15px sans prose with tabular numerals (`tabular-nums`) for all metrics, counts, and sizes.
  - Code & AST: Clean monospace (`font-mono text-xs md:text-sm`) with syntax clarity.
- **Anti-Slop Discipline**:
  - No fake comment headers (`// 01_DEV`), no hallucinatory innovation scoreboards, and no decorative pulsing green dots.
  - Category and tool tags use clean unboxed typographic labels (`·` separators).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Tailwind CSS v4 Theme Architecture
- **Problem**: Tailwind CSS v4 (`@tailwindcss/vite`) default behavior evaluates `dark:` variant against `@media (prefers-color-scheme: dark)` rather than HTML `.dark` class. As a result, toggling `.dark` in `App.tsx` had zero effect on the UI.
- **Chosen Approach**:
  1. Add `@variant dark (&:where(.dark, .dark *));` to `src/index.css`.
  2. Implement a 3-way state (`'light' | 'dark' | 'system'`) stored in `localStorage`.
  3. Attach a `matchMedia('(prefers-color-scheme: dark)')` change listener that re-evaluates `document.documentElement.classList` whenever system settings change while in `system` mode.
- **Alternatives Considered**: Forcing class-only mode without system sync (rejected because users requested auto system support).

### Decision 2: 194 New Tools Division & Modular Code Splitting
- **Problem**: Adding ~200 new tools to reach 400 total could inflate the main bundle or cause memory/render slowdowns if loaded synchronously.
- **Chosen Approach**:
  - Group the new tools into focused suite bundles loaded via `React.lazy()` with `Suspense`:
    1. `DevOpsCloudSuite.tsx` (Kubernetes, Dockerfile, Nginx, Crontab, Systemd, Terraform HCL, AWS IAM, SSH Config, Helm, Cloudflare Workers).
    2. `ApiDatabaseSuite.tsx` (cURL converters, SQL dialect transformers, Prisma visualizer, REST status code lookup, Webhook inspector, GraphQL AST explorer, JSON to TypeScript/Zod, JWT simulator, BigQuery/ClickHouse formatters).
    3. `NetworkSysadminSuite.tsx` (DNS record builder, Traceroute simulator, HTTP/3 QUIC header inspector, MTU overhead calculator, Port conflict analyzer, IP/CIDR summarizer, MAC OUI lookup, Subnet calculator, Bandwidth speed estimator, Syslog builder).
    4. `CodeTransformSuite.tsx` (JavaScript AST explorer, CSS specificity calculator, Regex visualizer, Protobuf to JSON schema, Postman to OpenAPI, SVG path morpher, Unicode NFC/NFD normalizer, Bitwise operator playground, Minified stack trace formatter, Git patch/diff generator).
  - Keep each tool self-contained, 100% client-side (no external API dependencies), ensuring instant offline execution.
- **Trade-Off**: Implementing robust client-side parsers and generators in pure TypeScript rather than calling backend microservices guarantees zero privacy leaks and infinite free scaling.

### Decision 3: Sub-Category Pill Navigation
- **Problem**: Browsing 400 tools across 9 primary categories can cause list fatigue.
- **Chosen Approach**:
  - Add secondary sub-category pill filters under the active category bar (e.g. within *Code & Dev*: `All`, `JSON & YAML`, `SQL & Data`, `Regex & AST`, `DevOps & Docker`, `API & Webhooks`).
  - Combine with an instant fuzzy search engine indexing tool titles, descriptions, and keywords.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│  - Theme Context ('light' | 'dark' | 'system')                         │
│  - Tailwind v4 @variant dark (&:where(.dark, .dark *))                 │
│  - System Media Query Listener                                         │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
         ┌──────────┴──────────┐          ┌──────────┴──────────┐
         │     Header.tsx      │          │    HomePage.tsx     │
         │ - 3-Way Cycle Icon  │          │ - 400-Tool Catalog  │
         │ - Search Modal (Cmd+K)│        │ - Category Pills    │
         │ - Favorite Counter  │          │ - Sub-Category Pills│
         └─────────────────────┘          │ - Fuzzy Filter Index│
                                          └──────────┬──────────┘
                                                     │
                                          ┌──────────┴──────────┐
                                          │  ToolRenderer.tsx   │
                                          │ - React.lazy Chunks │
                                          │ - Suspense Skeleton │
                                          └──────────┬──────────┘
                                                     │
         ┌───────────────────┬───────────────────────┼───────────────────┐
         ▼                   ▼                       ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ DevOps & Cloud  │ │  API & Database │ │Network & Sysadmin│ │ Code Transform  │
│ - K8s Manifest  │ │ - cURL Converter│ │ - DNS Records   │ │ - JS AST Viewer │
│ - Nginx Config  │ │ - SQL Dialect   │ │ - CIDR Subnet   │ │ - CSS Specific  │
│ - Dockerfile    │ │ - Prisma / Zod  │ │ - Traceroute Sim│ │ - Regex Visual  │
│ - Cron Builder  │ │ - Webhook Test  │ │ - MTU Overhead  │ │ - Protobuf/OpenAPI│
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Component & State Lifecycle
1. **Theme Initialization**: On mount, read `localStorage.getItem('pocketkit_theme') || 'system'`. If `'dark'` or (`'system'` and `prefers-color-scheme: dark`), append class `dark` to `document.documentElement`. Listen to `change` event on `window.matchMedia('(prefers-color-scheme: dark)')` to update dynamically without page reloads.
2. **Catalog Metadata Integration**:
   - `src/data/toolsData.ts` and `src/data/newToolsData.ts` expanded with ~194 tool descriptors, bringing total registered tools to 400.
   - Each tool contains: `id`, `name`, `description`, `category`, `subCategory`, `icon`, `keywords`, `tags`, and `badge`.
3. **Execution Verification**:
   - After user plan approval, code modifications will be applied.
   - Full TypeScript and Vite compilation check via `compile_applet`.
