import { endOfDay, format, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import { sourceLabel, stageLabel } from "./data"
import type { LeadSource, LeadStage } from "./data"
import type { ListLeadsParams } from "@/api/generated/model"

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

/**
 * Maps the toolbar's search and filter state to listLeads query params.
 * Empty values are dropped so equal filters always produce the same query
 * key, and no filters at all gives `undefined` (the unfiltered list's key).
 */
export function toListLeadsParams(
  filters: LeadFilters,
  search: string
): ListLeadsParams | undefined {
  const from = filters.dateRange?.from
  const to = filters.dateRange?.to ?? from
  const params: ListLeadsParams = {
    q: search.trim() || undefined,
    source: nonEmpty(filters.sources),
    stage: nonEmpty(filters.stages),
    budget: nonEmpty(filters.budgets),
    configuration: nonEmpty(filters.configurations),
    project: nonEmpty(filters.projects),
    tag: nonEmpty(filters.tags),
    addedFrom: from ? startOfDay(from).toISOString() : undefined,
    addedTo: to ? endOfDay(to).toISOString() : undefined,
  }
  const entries = Object.entries(params as Record<string, unknown>).filter(
    ([, v]) => v !== undefined
  )
  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

function nonEmpty<T>(list: Array<T>) {
  return list.length > 0 ? list : undefined
}
