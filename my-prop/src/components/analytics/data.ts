import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns"

import type {
  AnalyticsReport,
  GetAnalyticsReportParams,
} from "@/api/generated/model"

export type { AnalyticsReport } from "@/api/generated/model"

export type RangePreset = "30" | "60" | "90" | "custom"

export type DateWindow = { from: Date; to: Date }

export function presetWindow(days: number, today = new Date()): DateWindow {
  return { from: subDays(today, days - 1), to: today }
}

export function windowDays(range: DateWindow) {
  return Math.max(1, differenceInCalendarDays(range.to, range.from) + 1)
}

export function formatInr(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`
}

export function formatCrore(value: number) {
  return `₹${value.toFixed(1)}Cr`
}

/** The date window as getAnalyticsReport params (calendar dates). */
export function toReportParams(range: DateWindow): GetAnalyticsReportParams {
  return {
    from: format(range.from, "yyyy-MM-dd"),
    to: format(range.to, "yyyy-MM-dd"),
  }
}

/** Adds what only the UI needs: short date labels and chart colours. */
export function toAnalyticsView(report: AnalyticsReport) {
  return {
    ...report,
    trend: report.trend.map((point) => ({
      ...point,
      date: format(parseISO(point.date), "MMM d"),
    })),
    sources: report.sources.map((source) => ({
      ...source,
      fill: `var(--color-${source.key})`,
    })),
  }
}

export type AnalyticsData = ReturnType<typeof toAnalyticsView>
