# AL ZAHEER RETAIL RATELIST PANEL — PRD

## Original Problem Statement
Build a production-grade, mobile-first PWA "AL ZAHEER RETAIL RATELIST PANEL" — a complete digital rate list management system for a Pakistani smartphone / keypad phone / accessories retail & wholesale business. Single-file React PWA, navy + gold branding, Playfair Display + DM Sans, localStorage persistence, two user roles (Sales / Admin), PIN protection.

## Architecture
- React 19 (CRA) frontend served via supervisor on port 3000
- All state stored in `localStorage` under key `az_ratelist_v1`
- PWA: `manifest.json` + service worker (`sw.js`) cache-first
- Icons: lucide-react (outline style, similar to Tabler)
- Fonts: Google Fonts — Playfair Display + DM Sans
- No backend, no API, no third-party integrations

## User Personas
1. **Sales staff** — view-only rate list, can browse + share with customers via WhatsApp
2. **Admin / owner** — full CRUD, sees confidential CM/PP/Final/PRM columns, manages brands, PIN-protected

## Core Requirements (static)
- 3 categories: Smartphones, Keypad Phones, Accessories
- Per-brand: separate Sales list and Admin list
- Sales columns: Model, Variant (phones only), Invoice, FFP, Whole Sale, IFB
- Admin columns: Model, Variant (phones only), Invoice, WSP, CM Price, PP, Final, PRM (auto = Final − PP)
- Currency always `Rs.` prefixed; PRM green if ≥0 else red
- PIN-gated admin mode with auto-lock after N minutes of inactivity (5 / 10 / 30)
- WhatsApp share with formatted text + deep link `wa.me/?text=...`
- Export / Import JSON backup, Reset all (type RESET)
- Recent searches (last 5)

## What's Been Implemented (13 Feb 2026)
- ✅ **Multi-Branch Support** — same brands & products across all branches, but **per-branch pricing**. Branch switcher pill in header (🏬 + name + ▾), Slack-style switcher modal lists all branches with PIN status. Admin Settings → Branches section: Add / Rename / Delete branches + per-branch PIN management (gated by master password). New branches inherit current active branch's prices as baseline; admin can then edit each branch independently. Sales staff prompted for branch PIN when switching to a protected branch (session-cached). Admin bypasses all branch PINs. Product data model: `priceBy: { [branchId]: { invoice, ffp, wholeSale, ifb, wsp, cm, pp, final, prm } }`. Auto-migrates old single-branch data into Main Branch.
- ✅ **Unified product list per brand** — single source of truth (`products` array). Sales view shows Sales columns (Model, Variant, Invoice, FFP, Whole Sale, IFB); Admin view shows Admin columns (Model, Variant, Invoice, WSP, CM, PP, Final, PRM) — both pull from the **same row**, so admin edits sync to sales view instantly. Auto-migration converts older split `salesList`/`adminList` data on load. Row form in admin shows both Sales-view + Admin-only sections.
- ✅ **Master Password gate** — alphanumeric (min 6 chars) password that protects ALL PIN management actions: Change Admin PIN, Set/Change/Remove Category PIN, Change Master Password itself. To change the master password, current master password must be entered. If not set, no gate (back-compat). Triggered via Settings → Admin Account → Master Password.
- ✅ **Font switched to Inter** — single clean sans-serif across the app for a simple modern tech feel (replaced Playfair Display + DM Sans).
- ✅ **Per-Category PIN protection** — each of Smartphones / Keypad / Accessories can have its own PIN. Sales staff only access categories they have PINs for. Admin (master PIN) bypasses all category locks and manages them in Settings → Category Access (Set / Change / Remove per category). Inline "🔒 PIN" badge on home category cards. Session-only unlock — closing the tab re-locks.
- ✅ Light Blue + White modern theme (CSS variables: sky-500/sky-700/sky-50 palette)
- ✅ Shop Profile in Settings (name, WhatsApp number, address) — auto-injected in share templates + wa.me deep link
- ✅ 3 WhatsApp share templates: Formal / Casual / Promo with emoji branding
- ✅ Floating pill bottom nav + modernized FAB (gradient + rotate-on-hover)
- ✅ Splash screen with sky-cyan-to-navy gradient + shimmer
- ✅ Splash screen with AZ logo scale-in + gold shimmer + fade
- ✅ Home dashboard: 3 category cards (color-coded left border) + summary stats
- ✅ Category screen with horizontally-scrollable brand pill tabs
- ✅ Sales + Admin tables with all spec columns, sticky header, horizontal scroll fade
- ✅ Inline editing for admin (tap cell to edit), auto-save on blur
- ✅ Row add via FAB → modal form with all fields + live PRM calculation
- ✅ Row edit via pencil icon, delete via trash icon (confirm modal)
- ✅ Delete with Undo toast (4s window) for rows
- ✅ Add brand modal (admin) + long-press tab to delete brand
- ✅ Full-text search across all categories/brands/models with grouped results
- ✅ Recent searches chips
- ✅ WhatsApp share modal: per-brand or all-brands scope, WA-bubble preview, Copy + Open WhatsApp
- ✅ Confidential ADMIN share format vs Sales format
- ✅ PIN flows: first-time set (with confirm), unlock, change (current + new + confirm), forgot → reset
- ✅ Admin badge gold pulse on unlock, auto-lock after inactivity (5/10/30 min)
- ✅ Settings: change PIN, auto-lock timer, export/import/reset, app info
- ✅ Reset confirmation requires typing "RESET"
- ✅ Toast system (success/warn/error + undo)
- ✅ Full sample data preloaded (Samsung/Infinix/Realme phones, Nokia/QMobile keypad, Audionic accessories sales+admin)
- ✅ PWA manifest + service worker + AZ navy/gold icons (192/512 SVG)
- ✅ Mobile-first responsive layout, 480px max width, 44px+ tap targets
- ✅ Smooth animations (CSS transforms only): stagger reveal, slide-up sheets, flash, shimmer
- ✅ data-testid on every interactive + critical element

## Prioritized Backlog
- P1: Swipe-left to delete on mobile (currently uses trash icon only)
- P1: Bulk selection mode via long-press on rows (currently single delete)
- P2: "Add to Home Screen" install banner after 3rd open
- P2: Display formatted "Rs.X,XXX" in admin cells when not focused (currently raw on edit input)
- P2: Sticky first column (Model) on horizontal scroll
- P3: Dark mode variant
- P3: Print-friendly rate list PDF
