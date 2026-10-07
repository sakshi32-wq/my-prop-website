// In-memory tables behind the stateful mock handlers. Rows are copied on the
// way in and out, so callers can't mutate the store by accident.
import type {
  ApiKey,
  Campaign,
  Domain,
  Integration,
  Lead,
  TeamMember,
  Website,
  WebsiteContent,
} from "@/api/generated/model"
import { DEMO_CAMPAIGNS } from "@/components/campaigns/campaign-data"
import { DEMO_LEADS } from "@/components/leads/data"
import { DEMO_API_KEYS } from "@/components/settings/api-keys-data"
import { DEMO_DOMAINS } from "@/components/settings/domains-data"
import { DEMO_INTEGRATIONS } from "@/components/settings/integrations-data"
import { DEMO_TEAM_MEMBERS } from "@/components/settings/team-data"
import { DEMO_WEBSITES, demoWebsiteInfo } from "@/components/websites/data"

/** Builder content is keyed by its website's id. */
type StoredWebsiteContent = WebsiteContent & { id: string }

function createTable<TRow extends { id: string }>(seed: () => Array<TRow>) {
  let rows = seed().map((row) => structuredClone(row))

  return {
    all: () => rows.map((row) => structuredClone(row)),
    find(id: string) {
      const row = rows.find((r) => r.id === id)
      return row ? structuredClone(row) : undefined
    },
    insert(row: TRow) {
      rows = [structuredClone(row), ...rows]
      return structuredClone(row)
    },
    update(id: string, patch: Partial<TRow>) {
      const current = rows.find((r) => r.id === id)
      if (!current) return undefined
      const updated = { ...current, ...structuredClone(patch), id }
      rows = rows.map((r) => (r.id === id ? updated : r))
      return structuredClone(updated)
    },
    remove(id: string) {
      const before = rows.length
      rows = rows.filter((r) => r.id !== id)
      return rows.length < before
    },
    reset() {
      rows = seed().map((row) => structuredClone(row))
    },
  }
}

export const db = {
  leads: createTable<Lead>(() => DEMO_LEADS),
  campaigns: createTable<Campaign>(() => DEMO_CAMPAIGNS),
  teamMembers: createTable<TeamMember>(() => DEMO_TEAM_MEMBERS),
  domains: createTable<Domain>(() => DEMO_DOMAINS),
  apiKeys: createTable<ApiKey>(() => DEMO_API_KEYS),
  integrations: createTable<Integration>(() => DEMO_INTEGRATIONS),
  websites: createTable<Website>(() => DEMO_WEBSITES),
  websiteContents: createTable<StoredWebsiteContent>(() =>
    DEMO_WEBSITES.map((website) => ({
      id: website.id,
      websiteId: website.id,
      info: demoWebsiteInfo(website),
      sections: null,
      savedAt: null,
    }))
  ),
  /** Restores every table to its seed data. Called after each test. */
  reset() {
    db.leads.reset()
    db.campaigns.reset()
    db.teamMembers.reset()
    db.domains.reset()
    db.apiKeys.reset()
    db.integrations.reset()
    db.websites.reset()
    db.websiteContents.reset()
  },
}
