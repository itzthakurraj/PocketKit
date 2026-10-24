# Implementation Plan: Site Navigation & Routing Architecture Repair

Repair the navigation and routing failures across PocketKit to establish a rock-solid, bidirectional hybrid routing system (supporting both clean HTML5 paths and hash bookmarks) and verify all 104+ tools, header links, mobile drawer, category filters, and modal dialogues end-to-end.

---

## 1. Problem Diagnosis & Root Cause Analysis

1. **Path-Hash Collision in `syncRouteFromLocation`**:
   - When a user opens any tool, `handleSelectTool` pushed `/tools/:id` to `window.location.pathname`.
   - Subsequently clicking any header link (e.g. *Features*, *All Tools*, *Home*) or footer category executed `handleNavigate`, which set `window.location.hash` (e.g. `#features`) but never cleared `window.location.pathname`.
   - In `syncRouteFromLocation`, `cleanPathMatch` was evaluated before hash checks. Because `pathname` was still `/tools/:id`, it continuously matched the tool path, re-set `activeToolId`, and prevented any page from ever navigating away.
2. **Missing Hash Routes for Core Views**:
   - Neither `home` nor `all-tools` had dedicated hash handlers in `syncRouteFromLocation`.
   - Clearing the hash left `activeView` stale instead of resetting to the home directory.
3. **Category Breadcrumb Trapping**:
   - In `StandaloneToolPage.tsx`, clicking the category breadcrumb only set `window.location.hash = category:...` without clearing `activeToolId`, leaving the user trapped on the tool page.
4. **Mobile Navigation Drawer Friction**:
   - Missing explicit route synchronization when dismissing the drawer or switching tabs on small touchscreens.

---

## 2. Proposed Architecture & Solution

### A. Authoritative Hybrid Route Engine (`src/App.tsx`)
- Unify route synchronization into a single authoritative handler:
  1. **Priority 1: Policy & Modal Overlays**: Check `#privacy`, `#contact`, `#support`, `#terms`, `/privacy`, `/contact`, `/terms`. Open the corresponding modal and preserve underlying view.
  2. **Priority 2: Active Hash Views**: If a user navigates to `#features`, `#blog`, `#help`, `#install`, `#all-tools`, `#category:<id>`, `#home`, or empty hash, cleanly reset `activeToolId = null`, set `activeView`, and synchronize `window.history.replaceState` to strip stale `/tools/:id` paths.
  3. **Priority 3: Tool Navigation**: If hash matches `#/tools/:id` or path matches `/tools/:id` (and no overriding hash view is active), find tool in `TOOLS_DATA`, set `activeToolId`, and close any conflicting views.
  4. **Priority 4: Root Fallback**: When both path and hash point to root `/`, ensure `activeView = 'home'` and `activeToolId = null`.

### B. Standardized `handleNavigate` & `handleSelectTool`
- `handleNavigate(view, category)`:
  - Updates state immediately.
  - Clears `activeToolId(null)`.
  - Cleans `pathname` back to `/` and sets appropriate hash (`#features`, `#all-tools`, `#category:${category}`).
  - Closes any open modals (search, voice, policy).
- `handleSelectTool(id)`:
  - If selecting a tool: syncs path to `/tools/${id}` and hash to `#/tools/${id}`.
  - If clearing tool (`null`): syncs path to `/` and hash to `''`, restoring default home view.

### C. Tool Page & Breadcrumb Updates (`src/pages/StandaloneToolPage.tsx`)
- Update category breadcrumb click handler to invoke `onSelectTool(null)` and `onNavigate('category', tool.category)`.
- Ensure related tool buttons and back navigation buttons use the centralized handler.

### D. Header & Mobile Menu Touch Optimization (`src/components/Header.tsx`)
- Ensure every desktop and mobile drawer link reliably closes the mobile menu, triggers light tactile haptic feedback, and invokes `handleNavigate`.
- Guarantee minimum $44 \times 44\text{px}$ touch hitboxes per mobile design standards.

---

## 3. End-to-End Verification Plan

1. **Header Navigation Testing**:
   - Click *Home*, *All Tools*, *Features*, *Blog*, *Help*, *Install App* from the root page.
   - Verify each view renders its dedicated component without reload.
2. **Tool-to-Page Navigation Testing**:
   - Open any tool (e.g., `pdf-password-protect`, `case-converter`, `json-beautifier`).
   - Click *PocketKit* logo, *Features*, *All Tools*, and the *← PocketKit* breadcrumb.
   - Confirm immediate return to the selected view without getting trapped in the tool view.
3. **Category Filter Testing**:
   - On the homepage, select category cards (*PDF Tools*, *Security & Crypto*, *Calculators*).
   - Verify filtered tools display properly.
   - Click *Clear Filter (Show All 104+ Tools)* and verify restoration of full catalog.
4. **Legal & Support Modals Testing**:
   - Click *Privacy Policy* and *Contact Support* in the footer.
   - Verify correct tab opens, copy email works, and direct mail drafts smoothly.
5. **Browser History & Direct URL Testing**:
   - Test browser Back and Forward buttons (`popstate`).
   - Test direct loads of `/tools/pdf-to-word` and `#/tools/pdf-to-word`.
6. **Build & Type Safety**:
   - Run `lint_applet` and `compile_applet` to confirm 0 compilation or TypeScript errors.
