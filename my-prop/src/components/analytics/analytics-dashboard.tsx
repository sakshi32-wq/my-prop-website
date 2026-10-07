import { useMemo, useState } from "react"
import { format } from "date-fns"
import { DownloadIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { toast } from "sonner"

import { CampaignCard } from "./campaign-card"
import { buildAnalytics, presetWindow } from "./data"
import type { DateWindow, RangePreset } from "./data"
import { DateRangeControl } from "./date-range-control"
import { buildCsv, downloadCsv } from "./export-report"
import { FunnelCard } from "./funnel-card"
import { KpiCards } from "./kpi-cards"
import { LeadsChart } from "./leads-chart"
import { SourcesChart } from "./sources-chart"
import { TopWebsites } from "./top-websites"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

export function AnalyticsDashboard() {
  const [preset, setPreset] = useState<RangePreset>("30")
  const [customRange, setCustomRange] = useState<DateRange | undefined>(() =>
    presetWindow(30)
  )

  const range: DateWindow = useMemo(() => {
    if (preset !== "custom") return presetWindow(Number(preset))
    if (!customRange?.from) return presetWindow(30)
    return { from: customRange.from, to: customRange.to ?? customRange.from }
  }, [preset, customRange])

  const data = useMemo(() => buildAnalytics(range), [range])

  function exportReport() {
    const filename = `analytics-report-${format(range.from, "yyyy-MM-dd")}_${format(range.to, "yyyy-MM-dd")}.csv`
    downloadCsv(filename, buildCsv(data, range))
    toast.success("Report exported", { description: filename })
  }

  return (
    <>
      <PageHeader
        title="Analytics Dashboard"
        description="Track performance and insights"
        actions={
          <>
            <DateRangeControl
              preset={preset}
              onPresetChange={setPreset}
              customRange={customRange}
              onCustomRangeChange={setCustomRange}
            />
            <Button variant="outline" onClick={exportReport}>
              <DownloadIcon data-icon="inline-start" />
              Export Report
            </Button>
          </>
        }
      />

      <KpiCards data={data} />

      <div className="grid gap-6 lg:grid-cols-3">
        <LeadsChart data={data} />
        <SourcesChart data={data} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CampaignCard data={data} />
        <FunnelCard data={data} />
      </div>

      <TopWebsites data={data} />
    </>
  )
}
