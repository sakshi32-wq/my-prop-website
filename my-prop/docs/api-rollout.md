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
| 1 | campaigns | `campaigns/campaigns-page.tsx` (`createMockCampaigns`) | ⬜ |
| 2 | team | `settings/team-tab.tsx` (`INITIAL_MEMBERS`) | ⬜ |
| 3 | domains | `settings/domains-tab.tsx` (`INITIAL_DOMAINS`) | ⬜ |
| 4 | api-keys | `settings/api-keys-card.tsx` (`INITIAL_KEYS`) | ⬜ |
| 5 | integrations | `settings/integrations-tab.tsx` (`INITIAL_CONNECTED`) | ⬜ |
| 6 | websites | `routes/app.websites.tsx`, `dashboard/active-websites-card.tsx`, `builder/storage.ts` (localStorage) | ⬜ |
| 7 | templates | `routes/app.templates.tsx` (`TEMPLATES`) | ⬜ |
| 8 | profile | `settings/profile-info-card.tsx`, `notifications-card.tsx` | ⬜ |
| 9 | analytics | `analytics/*`, `dashboard/kpi-cards.tsx` and charts (read-only) | ⬜ |

Out of scope for now (still simulated, see `docs/replication-plan.md`): auth, AI
generation, Lighthouse reports, billing.

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
   - Updates and deletes are optimistic: helpers in `<domain>/optimistic.ts` built on
     `patchQueries`/`rollback` from `src/api/optimistic.ts`.
   - Creates aren't optimistic: the button shows a `Spinner` while pending, then the
     dialog closes and the toast shows in `onSuccess`.
   - Success toasts go in `onSuccess`. Errors are toasted by the MutationCache.
   - Dialogs used on several pages own their mutation.
7. **Tests**: `<domain>/<page>.test.tsx` (seed via `db`, cover loading → data, create,
   optimistic update/delete, the error state via `server.use`) and
   `src/mocks/handlers/<tag>.test.ts` (calls the generated client directly).
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
