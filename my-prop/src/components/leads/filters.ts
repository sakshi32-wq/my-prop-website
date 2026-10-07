import { endOfDay, format, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import { sourceLabel, stageLabel } from "./data"
import type { Lead } from "./data"
import type { LeadSource, LeadStage } from "@/lib/mock-data"

export type LeadFilters = {
  sources: Array<LeadSource>
  budgets: Array<string>
  configurations: Array<string>
  projects: Array<string>
  tags: Array<string>
  stages: Array<LeadStage>
  dateRange: DateRange | undefined
}

export type ListFilterKey = Exclude<keyof LeadFilters, "dateRange">

export const EMPTY_FILTERS: LeadFilters = {
  sources: [],
  budgets: [],
  configurations: [],
  projects: [],
  tags: [],
  stages: [],
  dateRange: undefined,
}

const LIST_KEYS: Array<ListFilterKey> = [
  "sources",
  "budgets",
  "configurations",
  "projects",
  "tags",
  "stages",
]

export function countActiveFilters(filters: LeadFilters) {
  return (
    LIST_KEYS.reduce((sum, key) => sum + filters[key].length, 0) +
    (filters.dateRange?.from ? 1 : 0)
  )
}

export function formatDateRange(range: DateRange | undefined) {
  if (!range?.from) return ""
  if (!range.to || range.to.getTime() === range.from.getTime())
    return format(range.from, "d MMM yyyy")
  return `${format(range.from, "d MMM")} – ${format(range.to, "d MMM yyyy")}`
}

export type FilterChip = {
  id: string
  label: string
  remove: (filters: LeadFilters) => LeadFilters
}

export function filterChips(filters: LeadFilters): Array<FilterChip> {
  const chips: Array<FilterChip> = []
  for (const key of LIST_KEYS) {
    for (const value of filters[key]) {
      const label =
        key === "sources"
          ? sourceLabel(value)
          : key === "stages"
            ? stageLabel(value)
            : value
      chips.push({
        id: `${key}:${value}`,
        label,
        remove: (f) => ({
          ...f,
          [key]: (f[key] as Array<string>).filter((v) => v !== value),
        }),
      })
    }
  }
  if (filters.dateRange?.from) {
    chips.push({
      id: "dateRange",
      label: `Added: ${formatDateRange(filters.dateRange)}`,
      remove: (f) => ({ ...f, dateRange: undefined }),
    })
  }
  return chips
}

function matchesSearch(lead: Lead, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const isPhoneQuery = /^[\d\s+()-]+$/.test(q)
  return (
    lead.name.toLowerCase().includes(q) ||
    lead.email.toLowerCase().includes(q) ||
    lead.phone.includes(q) ||
    (isPhoneQuery &&
      lead.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "")))
  )
}

function inList<T>(list: Array<T>, value: T) {
  return list.length === 0 || list.includes(value)
}

export function applyFilters(
  leads: Array<Lead>,
  filters: LeadFilters,
  query: string
) {
  const from = filters.dateRange?.from
    ? startOfDay(filters.dateRange.from)
    : undefined
  const to = from
    ? endOfDay(filters.dateRange?.to ?? filters.dateRange?.from ?? from)
    : undefined

  return leads.filter(
    (lead) =>
      matchesSearch(lead, query) &&
      inList(filters.sources, lead.source) &&
      inList(filters.budgets, lead.budget) &&
      inList(filters.configurations, lead.configuration) &&
      inList(filters.projects, lead.project) &&
      inList(filters.stages, lead.stage) &&
      (filters.tags.length === 0 ||
        filters.tags.some((tag) => lead.tags.includes(tag))) &&
      (!from || !to || (lead.addedAt >= from && lead.addedAt <= to))
  )
}
