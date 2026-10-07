# Replication plan: myprop.live

Rebuilding the reference app in `reference/` (React Router + hand-copied shadcn/Radix components, exported from Figma Make) as a TanStack Start + Tailwind v4 + shadcn/ui app on shadcn's default theme.

- **Sources:** the code in `reference/` and the live site at https://myprop-live.figma.site
- **Base library:** Radix (`radix-nova`), because the reference uses 26 `@radix-ui/*` packages
- **Theme:** shadcn default neutral. Reference colors, fonts and gradients are not copied.
- **Data:** everything is mock data plus local state. The reference has no backend, no auth and no API calls.

## Routes

| Route | Reference file | New route file | Shell |
|---|---|---|---|
| `/` | `pages/LandingPage.tsx` | `src/routes/index.tsx` | Public |
| `/login` | `pages/Login.tsx` | `src/routes/login.tsx` | Public |
| `/register` | `pages/Register.tsx` | `src/routes/register.tsx` | Public |
| `/forgot-password` | `pages/ForgotPassword.tsx` | `src/routes/forgot-password.tsx` | Public |
| `/builder` | redirect | `src/routes/builder.tsx` | Redirects to `/app/websites` |
| `/app` | `pages/Dashboard.tsx` | `src/routes/app.index.tsx` | App shell |
| `/app/websites` | `pages/Websites.tsx` | `src/routes/app.websites.tsx` | App shell |
| `/app/websites/$id/builder` | `pages/WebsiteBuilder.tsx` | `src/routes/app_.websites.$id.builder.tsx` | Full screen, no sidebar |
| `/app/leads` | `pages/Leads.tsx` | `src/routes/app.leads.tsx` | App shell |
| `/app/campaigns` | `pages/Campaigns.tsx` | `src/routes/app.campaigns.tsx` | App shell |
| `/app/ai-studio` | `pages/AIStudio.tsx` | `src/routes/app.ai-studio.tsx` | App shell |
| `/app/analytics` | `pages/Analytics.tsx` | `src/routes/app.analytics.tsx` | App shell |
| `/app/templates` | `pages/Templates.tsx` | `src/routes/app.templates.tsx` | App shell |
| `/app/settings` | `pages/Settings.tsx` | `src/routes/app.settings.tsx` | App shell |

## Shared pieces

| Piece | Location | shadcn components |
|---|---|---|
| App shell: sidebar with 8 nav items, header with search, notifications and user menu | `src/routes/app.tsx`, `src/components/app-shell/` | sidebar, input-group, popover, item, empty, scroll-area, dropdown-menu, avatar, badge |
| Logo (Globe tile + "myprop.live") | `src/components/logo.tsx` | — |
| Page header (title, description, actions) | `src/components/page-header.tsx` | — |
| Mock data and option lists (projects, sources, budgets, stages, tags, amenities, website tools, websites, templates) | `src/lib/mock-data.ts` | — |
| Toasts and tooltips | `src/routes/__root.tsx` (`<Toaster/>`, `<TooltipProvider/>`) | sonner, tooltip |

## Pages

### Public pages
- **Landing:** sticky header with anchor nav, then hero (badge, headline, two CTAs, three stats, image), 6 feature cards, 3 "How it works" steps, 4 template cards, 3 pricing plans ("Growth" is marked most popular), a CTA band and a footer.
  - **Components:** card, badge, button, aspect-ratio, sheet (mobile menu), separator.
- **Login / Register / Forgot password:** split layout with an image on the left (hidden on mobile), a form, and Google/GitHub buttons.
  - **Components:** field, input, checkbox, button.

### Dashboard (`/app`)
- 4 KPI cards.
- Charts: "Leads Over Time" (area), "Lead Sources" (pie), "Conversion Funnel" (horizontal bar).
- "Recent Leads" list with an Add Lead dialog.
- "Active Websites" list.
- **Components:** card, badge, chart, item, avatar, dialog.

### Websites (`/app/websites`)
- Grid of website cards: thumbnail, status, domain copy, stats, enabled tools, edit/builder link.
- **Create Website wizard** (7 steps): Basic Info, Property Type, Amenities, AI Settings, Template, Additional Content, Website Tools.
- **Lighthouse report dialog:** idle, then generating, then scores plus 4 tabs.
- **Components:** card, aspect-ratio, badge, tooltip, dialog, progress, field, select, toggle-group, switch, radio-group, tabs, alert, empty, spinner.

### Website Builder (`/app/websites/$id/builder`)
- **Top bar:** back, site name and domain, undo/redo, device toggle, Save, Preview, Publish.
- **Left panel:** Sections tab (sortable list, add-section templates) and Layers tab (element tree).
- **Center canvas:** device-width preview.
- **Right panel:** Properties, for the selected element or section.
- **Edit Website Info dialog** (7 tabs).
- **Components:** tabs, toggle-group, tooltip, scroll-area, select, slider, textarea, collapsible, sheet (mobile panels), alert-dialog, empty.
- **Not covered by shadcn:** drag and drop (`@dnd-kit`) and undo/redo history (custom hook).

### Leads (`/app/leads`)
- Kanban board with 7 pipeline stages, search and a filters sheet.
- Lead detail sheet with an activity timeline and an AI suggested reply.
- **Dialogs:** Add Lead, Edit Lead, Manage Tags, Call Lead (call state machine plus call log), Schedule Site Visit, Send WhatsApp (templates).
- **Components:** card, avatar, dropdown-menu, sheet, scroll-area, field, checkbox, toggle-group, popover, calendar, command, alert-dialog, empty.

### Campaigns (`/app/campaigns`)
- Two views: List and Automation Builder.
- **List view:** 4 stat cards and the campaign list (metrics, progress, view, edit, pause, delete).
- **Create Campaign wizard** (5 steps): Basics, Audience, Message, Schedule, Review.
- **Edit Campaign dialog** (4 tabs).
- **Automation builder:** a trigger plus action steps (WhatsApp, Email, SMS, Wait, Condition, Assign, Tag, Score, Notification, Webhook).
- **Components:** tabs, card, badge, progress, dialog, alert-dialog, radio-group, checkbox, field, popover, calendar, item.

### AI Studio (`/app/ai-studio`)
- **Tool picker** (6 tools) and a history sheet.
- **Generator form** with output for copy, WhatsApp, social posts and FAQs.
- **AI Web Page Designer:** chat on one side, live preview or code on the other.
- **Components:** card, radio-group/item, field, select, textarea, tabs, sheet, alert-dialog, skeleton, spinner, message-scroller, message, bubble, toggle-group.

### Analytics (`/app/analytics`)
- Date range control and CSV export.
- 4 KPI cards.
- Charts: area (3 series), pie, grouped bar.
- Conversion funnel and a top websites table.
- **Components:** chart, card, badge, select, popover, calendar, progress, table.

### Templates (`/app/templates`)
- Search, price filter, category chips, tag filters, a template grid and an empty state.
- **Template Preview dialog:** device toggle and a full mock page.
- **Use Template dialog** (2 steps: names, then subdomain).
- **Generate Custom Template wizard** (5 steps).
- **Components:** input-group, toggle-group, badge, card, aspect-ratio, dialog, field, radio-group, checkbox, progress, empty, spinner.

### Settings (`/app/settings`)
- **Tabs:** Profile, Domains, Team, Integrations, Billing.
- **Profile:** profile form, notification switches, password change.
- **Domains:** domain list and the Add Domain dialog with DNS records.
- **Team:** team list, roles, Invite dialog.
- **Integrations:** 8 integration cards and API keys with a Generate Key dialog.
- **Billing:** current plan with usage bars, payment method, billing history.
- **Components:** tabs, card, field, switch, input-group, badge, avatar, select, dialog, alert-dialog, alert, progress, table.

## Bugs in the reference

These are fixed in the rebuild, not copied:

- **Toasts never show.** No `<Toaster/>` is mounted. It is now mounted in the root.
- **Leads search and filters don't filter,** and the kanban column counts are hard-coded.
- **Several dialogs keep stale state between opens:**
  - the Create Website and Generate Template wizards
  - Lighthouse (shows one site's report for every site)
  - Add Domain (reopens on step 2)
  - Manage Tags and Schedule Visit (not initialized from the lead)
- **Website Builder:**
  - Element IDs collide (`Date.now()`).
  - Icons are lost after undo.
  - Pricing units are inverted (₹85 Cr vs ₹85 L).
  - Preview opens a 404.
  - Edits and reorders are not undoable.
  - The saved layout is never loaded back.
- **Analytics:** funnel bar widths are not monotonic. They used step-to-step %; they now use % of visitors.
- **Edit Campaign:** loses paused and weekly/monthly schedules, and drops audience and message edits.
- **Mobile:**
  - The landing page has no nav.
  - The user menu is unreachable below `sm`.
  - Wizard step labels overflow.
  - Hover-only actions don't work on touch screens.
  - Fixed-width panels and grids overflow.
- **Native browser dialogs:** `alert()` and `confirm()` are replaced with toasts and AlertDialog.
- **Seen only on the live site** (it matches the reference route for route, with no extra pages):
  - Builder "Duplicate Section" crashes the app.
  - The builder toolbar sits under the app header, so Save, Publish and Undo can't be clicked. The rebuild puts the builder outside the app shell.
  - Pie chart labels are clipped.
  - Unknown URLs show React Router's developer 404 screen.

## Placeholders

These stay placeholders. There is no backend, so they are simulated:

- Auth: login and register just navigate to `/app`, and OAuth buttons do nothing real.
- AI generation: canned content after a short delay.
- Lighthouse reports: mock data.
- Campaign sending, automation execution, publishing and domain verification.
- Integrations: Connect and Test toggle local state only.
- All metrics and charts use static or derived mock numbers.

## For review with your manager

- [ ] Every page and flow on the live site is listed above.
- [ ] Theme: keep shadcn's neutral default, or set brand colors through the theme variables in `src/styles.css`.
- [ ] Which placeholders should become real features first (auth, persistence, real AI).
- [ ] Mobile behavior is acceptable (sidebar becomes an off-canvas sheet; builder panels become sheets).
