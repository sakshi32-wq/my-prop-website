import { useMemo, useState } from "react"
import { keepPreviousData } from "@tanstack/react-query"
import { format } from "date-fns"
import { DownloadIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { toast } from "sonner"

import { CampaignCard } from "./campaign-card"
import { presetWindow, toAnalyticsView, toReportParams } from "./data"
import type { DateWindow, RangePreset } from "./data"
import { DateRangeControl } from "./date-range-control"
import { buildCsv, downloadCsv } from "./export-report"
import { FunnelCard } from "./funnel-card"
import { KpiCards } from "./kpi-cards"
import { LeadsChart } from "./leads-chart"
import { SourcesChart } from "./sources-chart"
import { TopWebsites } from "./top-websites"
import { useGetAnalyticsReport } from "@/api/generated/analytics/analytics"
import { PageHeader } from "@/components/page-header"
import { QueryError } from "@/components/query-error"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

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

  const reportQuery = useGetAnalyticsReport(toReportParams(range), {
    query: { placeholderData: keepPreviousData },
  })
  const data = useMemo(
    () => (reportQuery.data ? toAnalyticsView(reportQuery.data) : undefined),
    [reportQuery.data]
  )

  function exportReport() {
    if (!data) return
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
            <Button variant="outline" disabled={!data} onClick={exportReport}>
              <DownloadIcon data-icon="inline-start" />
              Export Report
            </Button>
          </>
        }
      />

      {data ? (
        <div
          aria-busy={reportQuery.isPlaceholderData}
          className={cn(
            "flex flex-col gap-6 transition-opacity",
            reportQuery.isPlaceholderData && "opacity-60"
          )}
        >
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
        </div>
      ) : reportQuery.isError ? (
        <QueryError
          title="Couldn't load analytics"
          error={reportQuery.error}
          onRetry={() => void reportQuery.refetch()}
        />
      ) : (
        <div
          className="flex flex-col gap-6"
          aria-busy="true"
          aria-label="Loading analytics"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-96 rounded-xl lg:col-span-2" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      )}
    </>
  )
}
