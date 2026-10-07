import { format, subDays } from "date-fns"

import type { DashboardOverview } from "@/api/generated/model"

export type { DashboardOverview } from "@/api/generated/model"

export function formatChange(changePct: number) {
  return `${changePct > 0 ? "+" : ""}${changePct.toFixed(1)}%`
}

const LAST_7_DAYS = [45, 52, 48, 65, 58, 72, 55]
const today = new Date()

/** Seed data for the mock API (src/mocks/db.ts). Demo numbers. */
export const DEMO_DASHBOARD_OVERVIEW: DashboardOverview = {
  totalLeads: { value: 2847, changePct: 12.5 },
  todaysLeads: { value: 48, changePct: 8.2 },
  activeCampaigns: { value: 12, launchingToday: 3 },
  conversionRate: { value: 24.8, changePct: -2.1 },
  leadsLast7Days: LAST_7_DAYS.map((leads, index) => ({
    date: format(subDays(today, 6 - index), "yyyy-MM-dd"),
    leads,
  })),
  sources: [
    { key: "website", share: 45 },
    { key: "whatsapp", share: 30 },
    { key: "social", share: 15 },
    { key: "referral", share: 10 },
  ],
  funnel: [
    { stage: "Visitors", count: 1250 },
    { stage: "Leads", count: 425 },
    { stage: "Qualified", count: 185 },
    { stage: "Meetings", count: 98 },
    { stage: "Closed", count: 42 },
  ],
}
