// In-memory tables behind the stateful mock handlers. Rows are copied on the
// way in and out, so callers can't mutate the store by accident.
import type {
  ApiKey,
  Automation,
  Campaign,
  DashboardOverview,
  Domain,
  Integration,
  Invoice,
  Lead,
  LeadActivity,
  LighthouseReport,
  Notification,
  NotificationPreferences,
  Profile,
  TeamMember,
  SavedGeneration,
  Subscription,
  Template,
  Website,
  WebsiteContent,
} from "@/api/generated/model"
import { DEMO_GENERATIONS } from "@/components/ai-studio/data"
import { DEMO_NOTIFICATIONS } from "@/components/app-shell/notifications-data"
import { DEMO_AUTOMATIONS } from "@/components/campaigns/automation/automation-data"
import { DEMO_CAMPAIGNS } from "@/components/campaigns/campaign-data"
import { DEMO_DASHBOARD_OVERVIEW } from "@/components/dashboard/data"
import { DEMO_LEADS, DEMO_LEAD_ACTIVITIES } from "@/components/leads/data"
import {
  DEMO_NOTIFICATION_PREFERENCES,
  DEMO_PROFILE,
} from "@/components/settings/account-data"
import { DEMO_API_KEYS } from "@/components/settings/api-keys-data"
import {
  DEMO_INVOICES,
  DEMO_SUBSCRIPTION,
} from "@/components/settings/billing-data"
import { DEMO_DOMAINS } from "@/components/settings/domains-data"
import { DEMO_INTEGRATIONS } from "@/components/settings/integrations-data"
import { DEMO_TEAM_MEMBERS } from "@/components/settings/team-data"
import { DEMO_TEMPLATES } from "@/components/templates/template-data"
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

/** A single record (e.g. the signed-in user's profile). */
function createSingleton<TValue extends object>(seed: TValue) {
  let value = structuredClone(seed)
  return {
    get: () => structuredClone(value),
    update(patch: Partial<TValue>) {
      value = { ...value, ...structuredClone(patch) }
      return structuredClone(value)
    },
    reset() {
      value = structuredClone(seed)
    },
  }
}

export const db = {
  leads: createTable<Lead>(() => DEMO_LEADS),
  leadActivities: createTable<LeadActivity>(() => DEMO_LEAD_ACTIVITIES),
  campaigns: createTable<Campaign>(() => DEMO_CAMPAIGNS),
  automations: createTable<Automation>(() => DEMO_AUTOMATIONS),
  teamMembers: createTable<TeamMember>(() => DEMO_TEAM_MEMBERS),
  domains: createTable<Domain>(() => DEMO_DOMAINS),
  apiKeys: createTable<ApiKey>(() => DEMO_API_KEYS),
  integrations: createTable<Integration>(() => DEMO_INTEGRATIONS),
  templates: createTable<Template>(() => DEMO_TEMPLATES),
  websites: createTable<Website>(() => DEMO_WEBSITES),
  lighthouseReports: createTable<LighthouseReport>(() => []),
  websiteContents: createTable<StoredWebsiteContent>(() =>
    DEMO_WEBSITES.map((website) => ({
      id: website.id,
      websiteId: website.id,
      info: demoWebsiteInfo(website),
      sections: null,
      savedAt: null,
    }))
  ),
  /** Accounts; the first one is the demo user. */
  users: createTable<Profile>(() => [DEMO_PROFILE]),
  /** Session tokens (the row id) mapped to their user. */
  sessions: createTable<{ id: string; userId: string }>(() => []),
  notificationPreferences: createSingleton<NotificationPreferences>(
    DEMO_NOTIFICATION_PREFERENCES
  ),
  notifications: createTable<Notification>(() => DEMO_NOTIFICATIONS),
  generations: createTable<SavedGeneration>(() => DEMO_GENERATIONS),
  dashboardOverview: createSingleton<DashboardOverview>(
    DEMO_DASHBOARD_OVERVIEW
  ),
  subscription: createSingleton<Subscription>(DEMO_SUBSCRIPTION),
  invoices: createTable<Invoice>(() => DEMO_INVOICES),
  /** Restores every table to its seed data. Called after each test. */
  reset() {
    db.leads.reset()
    db.leadActivities.reset()
    db.campaigns.reset()
    db.automations.reset()
    db.teamMembers.reset()
    db.domains.reset()
    db.apiKeys.reset()
    db.integrations.reset()
    db.templates.reset()
    db.websites.reset()
    db.lighthouseReports.reset()
    db.websiteContents.reset()
    db.users.reset()
    db.sessions.reset()
    db.notificationPreferences.reset()
    db.dashboardOverview.reset()
    db.notifications.reset()
    db.generations.reset()
    db.subscription.reset()
    db.invoices.reset()
  },
}
