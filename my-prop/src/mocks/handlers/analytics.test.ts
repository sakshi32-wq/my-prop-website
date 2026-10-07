import { describe, expect, it } from "vitest"

import {
  getAnalyticsReport,
  getDashboardOverview,
} from "@/api/generated/analytics/analytics"
import { DEMO_DASHBOARD_OVERVIEW } from "@/components/dashboard/data"

describe("analytics mock API", () => {
  it("returns the dashboard overview", async () => {
    expect(await getDashboardOverview()).toEqual(DEMO_DASHBOARD_OVERVIEW)
  })

  it("builds a report for the requested dates", async () => {
    const report = await getAnalyticsReport({
      from: "2026-09-01",
      to: "2026-09-30",
    })
    expect(report.days).toBe(30)
    expect(report.kpis.totalLeads).toBe(4285)
    expect(report.trend[0].date).toBe("2026-09-01")
    // The funnel never grows from one step to the next.
    for (let i = 1; i < report.funnel.length; i++)
      expect(report.funnel[i].count).toBeLessThanOrEqual(
        report.funnel[i - 1].count
      )
    expect(
      (await getAnalyticsReport({ from: "2026-07-03", to: "2026-09-30" })).days
    ).toBe(90)
  })

  it("rejects bad date ranges", async () => {
    await expect(
      getAnalyticsReport({ from: "2026-09-30", to: "2026-09-01" })
    ).rejects.toMatchObject({ status: 422 })
    await expect(
      getAnalyticsReport({ from: "yesterday", to: "2026-09-01" })
    ).rejects.toMatchObject({ status: 422 })
  })
})
