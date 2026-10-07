// Mock analytics data. The reference numbers describe a 30-day window; other
// ranges scale them (with a little deterministic variation) so switching the
// date range visibly changes the dashboard.
import { addDays, differenceInCalendarDays, format, subDays } from "date-fns"

export type RangePreset = "30" | "60" | "90" | "custom"

export type DateWindow = { from: Date; to: Date }

const BASE_TREND = [
  { leads: 145, qualified: 89, converted: 23 },
  { leads: 178, qualified: 102, converted: 31 },
  { leads: 203, qualified: 125, converted: 38 },
  { leads: 189, qualified: 118, converted: 42 },
  { leads: 234, qualified: 156, converted: 51 },
  { leads: 267, qualified: 178, converted: 58 },
]

const BASE_SOURCES = [
  { key: "website", name: "Website", value: 45 },
  { key: "whatsapp", name: "WhatsApp", value: 30 },
  { key: "social", name: "Social Media", value: 15 },
  { key: "referral", name: "Referral", value: 10 },
] as const

const BASE_CAMPAIGNS = [
  { name: "Skyline Launch", sent: 1245, converted: 45, cpl: 280 },
  { name: "Green Valley", sent: 3456, converted: 28, cpl: 420 },
  { name: "Marina Bay", sent: 567, converted: 32, cpl: 195 },
  { name: "Weekend Visit", sent: 892, converted: 18, cpl: 510 },
]

const BASE_FUNNEL = [
  { stage: "Visitors", count: 12450 },
  { stage: "Leads", count: 4285 },
  { stage: "Qualified", count: 1856 },
  { stage: "Site Visits", count: 982 },
  { stage: "Closed", count: 425 },
]

const BASE_WEBSITES = [
  { name: "Skyline Heights", visitors: 4285, leads: 234, revenueCr: 2.1 },
  { name: "Marina Bay Apartments", visitors: 3567, leads: 189, revenueCr: 1.8 },
  { name: "Green Valley Villas", visitors: 2890, leads: 156, revenueCr: 1.5 },
]

export function presetWindow(days: number, today = new Date()): DateWindow {
  return { from: subDays(today, days - 1), to: today }
}

export function windowDays(range: DateWindow) {
  return Math.max(1, differenceInCalendarDays(range.to, range.from) + 1)
}

/** Small, stable wobble so scaled ranges don't look like pure multiples. */
function wobble(days: number, index: number, amount = 0.06) {
  if (days === 30) return 1
  return 1 + Math.sin(days * 0.37 + index * 1.7) * amount
}

export function formatInr(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`
}

export function formatCrore(value: number) {
  return `₹${value.toFixed(1)}Cr`
}

export function buildAnalytics(range: DateWindow) {
  const days = windowDays(range)
  const factor = days / 30
  const scale = (value: number, index = 0) =>
    Math.max(0, Math.round(value * factor * wobble(days, index)))

  const funnel = BASE_FUNNEL.map((step, index) => ({
    stage: step.stage,
    count: scale(step.count, index),
  }))
  // Keep the funnel monotonic after the wobble.
  for (let i = 1; i < funnel.length; i++) {
    funnel[i].count = Math.min(funnel[i].count, funnel[i - 1].count)
  }
  const visitors = funnel[0].count
  const totalLeads = funnel[1].count
  const closed = funnel[funnel.length - 1].count

  const funnelSteps = funnel.map((step, index) => ({
    ...step,
    ofVisitors: visitors ? (step.count / visitors) * 100 : 0,
    fromPrevious:
      index === 0 || !funnel[index - 1].count
        ? null
        : (step.count / funnel[index - 1].count) * 100,
  }))

  // Up to six equal buckets across the selected window.
  const points = BASE_TREND.slice(-Math.min(BASE_TREND.length, days))
  const bucket = days / points.length
  const trend = points.map((point, index) => ({
    date: format(addDays(range.from, Math.floor(index * bucket)), "MMM d"),
    leads: scale(point.leads, index),
    qualified: scale(point.qualified, index + 2),
    converted: scale(point.converted, index + 4),
  }))

  const sourceTotal = BASE_SOURCES.reduce(
    (sum, source, index) => sum + source.value * wobble(days, index, 0.12),
    0
  )
  const sources = BASE_SOURCES.map((source, index) => {
    const share = (source.value * wobble(days, index, 0.12) * 100) / sourceTotal
    return {
      key: source.key,
      name: source.name,
      share,
      leads: Math.round((totalLeads * share) / 100),
      fill: `var(--color-${source.key})`,
    }
  })

  const campaigns = BASE_CAMPAIGNS.map((campaign, index) => ({
    name: campaign.name,
    sent: scale(campaign.sent, index),
    converted: scale(campaign.converted, index + 1),
    cpl: Math.round(campaign.cpl * wobble(days, index + 3, 0.08)),
  }))

  const websites = BASE_WEBSITES.map((site, index) => {
    const siteVisitors = scale(site.visitors, index)
    const siteLeads = scale(site.leads, index + 2)
    return {
      name: site.name,
      visitors: siteVisitors,
      leads: siteLeads,
      cvr: siteVisitors ? (siteLeads / siteVisitors) * 100 : 0,
      revenueCr: site.revenueCr * factor * wobble(days, index + 1),
    }
  })
    .sort((a, b) => b.revenueCr - a.revenueCr)
    .map((site, index) => ({ ...site, rank: index + 1 }))

  const growth = Math.log2(factor)
  const kpis = {
    totalLeads,
    // Closed deals as a share of leads (425 / 4,285 = 9.92% for 30 days).
    conversionRate: totalLeads ? (closed / totalLeads) * 100 : 0,
    costPerLead: 325 + growth * 9,
    visitors,
    trends: {
      totalLeads: 18.2 - growth * 2.1,
      conversionRate: 2.4 - growth * 0.6,
      costPerLead: -12.5 + growth * 1.8,
      visitors: 24.8 - growth * 3.4,
    },
  }

  return {
    days,
    kpis,
    trend,
    sources,
    campaigns,
    funnel: funnelSteps,
    overallConversion: visitors ? (closed / visitors) * 100 : 0,
    websites,
  }
}

export type AnalyticsData = ReturnType<typeof buildAnalytics>
