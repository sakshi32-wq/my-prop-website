# API rollout: schema-first, domain by domain

Moving every page from local mock state (`useState(INITIAL_…)`) to the schema-first
API layer: `openapi/openapi.yaml` → Orval-generated TanStack Query hooks → components,
served by stateful MSW handlers until a backend exists. Leads was the pilot; it is the
reference implementation for everything below.

- **Branch:** `feat/schema-first-api`
- **One commit per domain**, made only after that domain's gate passes. A domain that is
  ticked below is committed; anything in the working tree that isn't is unfinished.

## Resuming

1. `git switch feat/schema-first-api && git log --oneline` to see what's done.
2. Find the first unticked domain in the checklist. If `git status` shows changes for
   it, continue from them; otherwise start at step 1 of the recipe.
3. Run `yarn api:generate` after any schema change. Never edit `src/api/generated/`.

## Checklist

| # | Domain (tag) | Source of mock state today | Status |
|---|---|---|---|
| 0 | leads | `leads/leads-page.tsx`, `dashboard/recent-leads-card.tsx` | ✅ done (pilot) |
| 1 | campaigns | `campaigns/campaigns-page.tsx` (`createMockCampaigns`) | ✅ done |
| 2 | team | `settings/team-tab.tsx` (`INITIAL_MEMBERS`) | ✅ done |
| 3 | domains | `settings/domains-tab.tsx` (`INITIAL_DOMAINS`) | ✅ done |
| 4 | api-keys | `settings/api-keys-card.tsx` (`INITIAL_KEYS`) | ✅ done |
| 5 | integrations | `settings/integrations-tab.tsx` (`INITIAL_CONNECTED`) | ✅ done |
| 6 | websites | `routes/app.websites.tsx`, `dashboard/active-websites-card.tsx`, `builder/storage.ts` (localStorage) | ✅ done |
| 7 | templates | `routes/app.templates.tsx` (`TEMPLATES`) | ✅ done |
| 8 | profile (tag `account`) | `settings/profile-info-card.tsx`, `notifications-card.tsx`, `security-card.tsx`, `app-shell/user-menu.tsx` | ✅ done |
| 9 | analytics | `analytics/*`, `dashboard/kpi-cards.tsx` and charts (read-only) | ✅ done |

Out of scope for now (still simulated, see `docs/replication-plan.md`): auth, AI
generation, Lighthouse reports, billing.

### Round 2

Committed together in one commit on `feat/schema-first-api`. It was held back for
review first, so it isn't split per domain like Round 1.

| # | Domain (tag) | Source of local state | Status |
|---|---|---|---|
| 10 | notifications | `app-shell/notifications-popover.tsx` | ✅ done |
| 11 | lead activities (under the `leads` tag) | `leads/lead-detail-sheet.tsx` timeline, `call-lead-dialog.tsx`, `send-whatsapp-dialog.tsx`, `schedule-visit-dialog.tsx` | ✅ done |
| 12 | automations | `campaigns/automation/*` | ✅ done |
| 13 | ai (generation + history) | `ai-studio/*` | ✅ done |
| 14 | lighthouse (under `websites`) | `websites/lighthouse-report-dialog.tsx` | ✅ done |
| 15 | billing | `settings/billing-tab.tsx` | ✅ done |
| 16 | auth | `auth/*-form.tsx`, `app-shell/user-menu.tsx` logout | ✅ done |

## Recipe (per domain)

Follow the Leads files as the template for each step.

1. **Read** the domain's components and data module. List the server state (entities)
   versus UI state (dialogs, filters, wizard steps), and every mutation and where it is
   called.
2. **Schema** (`openapi/openapi.yaml`): add a tag and operations with `operationId` and
   `tags`. Paths are relative to `/api`, ids are `format: uuid`, errors use the shared
   `Error` responses (`NotFound`, `UnprocessableEntity`, `Unauthorized`). Filters are query
   params (`style: form, explode: true` for arrays). Use `PATCH` with a partial
   `<Entity>Update` schema for updates, and `<Entity>Input` for creates.
3. **Orval** (`orval.config.ts`): add `mutationInvalidates` rules (create → list;
   update/delete → list + detail). Run `yarn api:generate`.
4. **Data module**: re-export the entity types from `@/api/generated/model` instead of
   redefining them. Keep labels/options there, and turn the initial data into `DEMO_…`
   seed data with fixed UUIDs and ISO date strings. Check option lists against generated
   enums with `satisfies`.
5. **Mocks**: add a table to `src/mocks/db.ts` (and to `db.reset()`), write stateful
   handlers in `src/mocks/handlers/<tag>.ts` (`await delay()`, 404/422 with the `Error`
   body), and add them, plus `get<Tag>Mock()`, to `src/mocks/handlers.ts`.
6. **Components**:
   - Lists use `useList…(params, { query: { placeholderData: keepPreviousData } })`, a
     `Skeleton` while pending, and `QueryError` (Alert + Retry) on error.
   - Updates and deletes are optimistic: `<domain>/optimistic.ts` wraps the generic
     `optimisticPatch` / `optimisticRemove` from `src/api/optimistic.ts` (see
     `campaigns/optimistic.ts`). `optimisticRemove` puts the deleted item in the
     context as `removed`, so `onSuccess` can name it.
   - Creates aren't optimistic: the button shows a `Spinner` while pending, then the
     dialog closes and the toast shows in `onSuccess`.
   - Success toasts go in `onSuccess`. Errors are toasted by the MutationCache.
   - Dialogs used on several pages own their mutation.
7. **Tests**: `<domain>/<page>.test.tsx` (seed via `db`, cover loading → data, create,
   optimistic update/delete, the error state via `server.use`) and
   `src/mocks/handlers/<tag>.test.ts` (calls the generated client directly). To assert
   a loading or optimistic in-between state, hold the request with `gate()` from
   `src/test/msw.ts` and `release()` it after the assertion.
8. **Gate**: `yarn run check && yarn lint && yarn typecheck && yarn test && yarn build`.
   Then check the page in the browser on a freshly started `yarn dev`. A dev server that
   was running before `src/client.tsx` existed doesn't register MSW, and `/api/*` returns
   406.
9. **Commit** the domain (schema, generated code, mocks, components, tests), tick it
   here in the same commit, and note anything a reviewer should know under Notes.

## Notes

- `yarn check` runs Yarn 1's built-in command. Use `yarn run check` for Prettier.
- MSW 3 uses `onUnhandledFrame`, not `onUnhandledRequest`.
- Mock data lives in page memory: a full reload resets it to the seed data.
- **Dates:** the API uses ISO strings (`date-time`, or `date` for calendar-only
  values). If a form needs `Date` objects, keep a UI draft type derived from the
  generated input type and convert at the boundary (`toDraft` / `toCampaignInput` in
  `campaigns/campaign-data.ts`).
- **campaigns:** the client sends the launch `status` (`scheduled` vs `active`), because
  the date and time are local with no timezone. A real backend may want a
  `scheduledAt` date-time and decide the status itself. The Automation Builder tab is
  still local state; it's a candidate for an `automations` tag later.
- **Settings tabs** are all force-mounted, and the active one comes from `?tab=` in the
  URL. Every settings query runs when `/app/settings` loads, whichever tab is showing.
  Browser checks can open `/app/settings?tab=<name>` directly. Settings data modules
  are named `settings/<domain>-data.ts`, with `settings/<domain>-optimistic.ts`.
- **domains:** "Add Domain" now creates the domain (pending) before the DNS step, and
  the DNS records come from the server. The DNS step has no "Back" button any more,
  because the domain already exists by then. Verify is `POST /domains/{id}/verify`;
  the mock never activates a domain because there's no DNS behind it.
  `Domain.websiteId` is a website UUID, and the website picker loads from
  `listWebsites` (done with #6).
- **api-keys (behaviour change, needs sign-off):** like a real API, the secret is only
  returned by `POST /api-keys`. The list returns a masked `preview`, so the
  Reveal/Hide and list-level Copy buttons were removed. The create dialog still shows
  and copies the new secret once. The mock stores only the preview.
- **integrations:** ids are catalog slugs (`IntegrationId` enum), not UUIDs. Each
  `IntegrationItem` owns its connect and disconnect mutations, so its pending state is
  per item. Connect isn't optimistic; disconnect is, and its toast keeps the Undo
  button, which reconnects. Settings are saved with `PATCH /integrations/{id}`, and
  "Test Connection" calls `POST /integrations/{id}/test`. **Open question for the
  backend:** settings, including credentials such as the Twilio token, are returned
  in full by `GET /integrations`. A real API may want those fields write-only, with
  the form showing a "saved" placeholder instead. `useSimulatedRequest` was removed
  because nothing uses it any more.
- **websites:** `WEBSITES` moved out of `lib/mock-data` into `websites/data.ts` as seed
  data. The wizard now `POST`s `/websites` and opens the builder at the new id (it used
  to go to `/builder/new`). The builder loads `GET /websites/{id}` and
  `/websites/{id}/content`, saves with `PUT .../content`, and publishes with
  `POST .../publish`, which needs saved sections. It no longer uses `localStorage`:
  `builder/storage.ts` and the "restored your draft" toast are gone. Page sections
  are an opaque JSON document to the API (`WebsiteSection` with
  `additionalProperties`); the builder still checks them with `isSectionArray`.
  Uploaded files are sent as metadata only, because there is no upload endpoint yet.
  The Lighthouse report is still simulated. Component tests that need `Link` or
  `useNavigate` use `renderWithRouter` from `src/test/render.tsx`.
- **templates:** the library's URL filters (`q`, `price`, `category`, `tags`) map to
  `listTemplates` params, so filtering runs on the server; the search box is
  debounced. A `?preview=<id>` link loads with `getTemplate`, even when the template
  is outside the current filters. Template ids are UUIDs and images are URLs
  (`thumbnailUrl`, `galleryUrls`). The AI generator is still simulated, but "Save to
  Library" is `POST /templates`, and "Use Template" on an unsaved result saves it
  first, so websites only reference real templates. "Use template" creates a real
  website (`createWebsite` with `name` and `subdomain`; a taken address returns 422)
  and opens the builder at its id, and creating a website increments the template's
  `uses`. The website wizard's template step loads from the API and preselects the
  first template. **Cross-tag invalidation:** to invalidate another tag's query, pass
  `file` as that tag's folder relative to the output root (see `createWebsite` in
  `orval.config.ts`). There is no component test for the templates page itself,
  because it is bound to its file route's search params; the browser check covers
  it. The suite's `testTimeout` is 15 s because the wizard tests are long.
- **Dev noise (not an app bug):** when a browser session is killed mid-request, the
  TanStack devtools console pipe can echo the resulting error between client and
  server in a growing nested burst ("[Server] … [Server] …"). It stops by itself.
- **account:** `GET`/`PATCH /me` back the profile form and the header's user menu,
  so renaming yourself updates the header. Notification switches are optimistic
  patches of one cached object, using `patchQueries` directly rather than the list
  helpers. The password change is `POST /me/password`; the mock accepts any current
  password because there's no real auth yet. Single-record mock state uses
  `createSingleton` in `src/mocks/db.ts`. The team's "John Doe" owner row is a
  separate team-member record and doesn't follow profile renames.
- **analytics:** read-only. `GET /analytics/overview` feeds the dashboard's KPI cards,
  7-day chart, sources pie and funnel; the four share one cached request.
  `GET /analytics/report?from&to` feeds the Analytics page, with `keepPreviousData`
  when the range changes. The report is computed by the mock server
  (`src/mocks/analytics.ts`, previously `buildAnalytics` in the client).
  `toAnalyticsView` adds the UI-only labels and chart colours. The numbers are demo
  values and aren't derived from the other mock tables (for example, Total Leads
  doesn't count the leads board).
- **notifications (round 2):** list, mark one read, mark all read, delete, all
  optimistic. Icons come from the `type`; times are shown relative to `createdAt`.
- **lead activities (round 2):** `GET /leads/{id}/activities` feeds the detail
  sheet's timeline. `POST .../calls`, `.../messages` and `.../site-visits` record
  actions; the server writes each title and description from the option lists in
  `leads/data.ts`. The server also records "captured" on create and "stage-change"
  on update. Scheduling a visit moves new/contacted/interested leads to "scheduled"
  on the server (the page's own stage bump is gone). WhatsApp still opens `wa.me`
  on the click itself, and the message is recorded in the background.
- **automations (round 2):** the builder loads `listAutomations` and edits the first
  automation (seeded with the starter flow). Step edits stay local until "Save
  Automation", which sends a `PUT` (or a `POST` when none exists yet). The server
  requires a single leading trigger, at least one action, and unique step ids. The
  UI still edits one automation; a picker for several is a possible next step.
- **ai (round 2):** `POST /ai/generate` returns structured content (copy sections,
  messages, posts or FAQs) plus `plainText` and `title`. The canned generators moved
  from `ai-studio/content.ts` to `src/mocks/ai-content.ts`, and the output
  components render the response. "Save to Drafts" is `POST /ai/generations`; the
  history list loads, and deletes optimistically, through `/ai/generations`. The
  page designer's chat calls `POST /ai/page-design`, and its code view and download
  use the returned HTML; errors show in the chat rather than as a toast
  (`meta.errorToast: false`). "Apply to Website" and "Use This Content" still only
  show a toast.
- **lighthouse (round 2):** `GET /websites/{id}/lighthouse` returns the latest report,
  or 404 when there isn't one (shown as "Run Lighthouse Analysis").
  `POST /websites/{id}/lighthouse` runs an audit; the mock takes 2.5 s in the browser
  and 5 ms in tests. The progress bar eases towards 95% while the request runs, and
  the fresh report shows straight away. The report components take the report as
  data; icons stay in the UI.
- **billing (round 2):** `GET /billing/subscription` returns the plan, status
  (`active`/`cancelling`), renewal date, usage and card; "Websites" usage counts the
  mock websites table. Cancel and resume are `POST`s, and "Upgrade Plan" is
  `POST /billing/upgrade-requests`. `GET /billing/invoices` feeds the history; invoice
  downloads are still built in the browser. Editing or adding cards stays a
  "payment partner" message.
- **auth (round 2):** `POST /auth/login` and `/auth/register` return
  `{ token, user }`; the forms store the token with `setAuthToken` (in
  `src/api/fetcher.ts`), clear cached queries and open `/app`.
  `POST /auth/forgot-password` always returns 204. Logout calls `POST /auth/logout`,
  then clears the token and cache even if the call fails. The mock keeps `users` and
  `sessions`: `/me` answers for the token's user, and a request without a token acts
  as the demo user, because there are no route guards yet. Login only checks that
  the email has an account (demo: `john@example.com`); passwords aren't checked. The
  Google/GitHub buttons are still simulated. Tests clear `localStorage` after each
  test.
