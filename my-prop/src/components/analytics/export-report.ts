import { format } from "date-fns"

import type { AnalyticsData, DateWindow } from "./data"

function csvCell(value: string | number) {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function section(
  title: string,
  header: Array<string>,
  rows: Array<Array<string | number>>
) {
  return [[title], header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")
}

export function buildCsv(data: AnalyticsData, range: DateWindow) {
  const { kpis } = data
  return [
    section(
      "Analytics Report",
      ["From", "To", "Days"],
      [
        [
          format(range.from, "yyyy-MM-dd"),
          format(range.to, "yyyy-MM-dd"),
          data.days,
        ],
      ]
    ),
    section(
      "Key Metrics",
      ["Metric", "Value", "Change %"],
      [
        ["Total Leads", kpis.totalLeads, kpis.trends.totalLeads.toFixed(1)],
        [
          "Conversion Rate %",
          kpis.conversionRate.toFixed(2),
          kpis.trends.conversionRate.toFixed(1),
        ],
        [
          "Cost Per Lead (INR)",
          Math.round(kpis.costPerLead),
          kpis.trends.costPerLead.toFixed(1),
        ],
        ["Website Visitors", kpis.visitors, kpis.trends.visitors.toFixed(1)],
      ]
    ),
    section(
      "Leads Over Time",
      ["Period Start", "Total Leads", "Qualified", "Converted"],
      data.trend.map((p) => [p.date, p.leads, p.qualified, p.converted])
    ),
    section(
      "Lead Sources",
      ["Source", "Share %", "Leads"],
      data.sources.map((s) => [s.name, s.share.toFixed(1), s.leads])
    ),
    section(
      "Campaign Performance",
      ["Campaign", "Messages Sent", "Conversions", "CPL (INR)"],
      data.campaigns.map((c) => [c.name, c.sent, c.converted, c.cpl])
    ),
    section(
      "Conversion Funnel",
      ["Stage", "Count", "% of Visitors", "% from Previous"],
      data.funnel.map((f) => [
        f.stage,
        f.count,
        f.ofVisitors.toFixed(1),
        f.fromPrevious === null ? "" : f.fromPrevious.toFixed(1),
      ])
    ),
    section(
      "Top Performing Websites",
      ["Rank", "Website", "Visitors", "Leads", "CVR %", "Revenue (Cr INR)"],
      data.websites.map((w) => [
        w.rank,
        w.name,
        w.visitors,
        w.leads,
        w.cvr.toFixed(2),
        w.revenueCr.toFixed(2),
      ])
    ),
  ].join("\n\n")
}

export function downloadCsv(filename: string, csv: string) {
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
