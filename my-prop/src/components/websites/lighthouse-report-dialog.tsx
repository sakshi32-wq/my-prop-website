import { useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { GaugeIcon, GlobeIcon, RefreshCwIcon, ZapIcon } from "lucide-react"
import { toast } from "sonner"

import { ApiError } from "@/api/fetcher"
import {
  useGetLatestLighthouseReport,
  useRunLighthouseAudit,
} from "@/api/generated/websites/websites"
import { QueryError } from "@/components/query-error"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"

import { ScoreGrid } from "./lighthouse/report-sections"
import { ReportTabs } from "./lighthouse/report-tabs"

/** Roughly how long an audit takes; the progress bar fills over this time. */
const EXPECTED_MS = 2500
const TICK_MS = 100

export function LighthouseReportDialog({
  open,
  onOpenChange,
  website,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  website: { id: string; name: string; domain: string } | null
}) {
  const websiteId = website?.id ?? ""
  const latestQuery = useGetLatestLighthouseReport(websiteId, {
    query: { enabled: open && !!website, retry: false },
  })
  const runAudit = useRunLighthouseAudit({
    mutation: {
      onSuccess: () =>
        toast.success("Lighthouse report ready", {
          description: website?.name,
        }),
      onSettled: stopTimer,
    },
  })
  const [progress, setProgress] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const running =
    runAudit.isPending && runAudit.variables.websiteId === websiteId
  // A 404 just means this website has never been audited.
  const neverRun =
    latestQuery.error instanceof ApiError && latestQuery.error.status === 404
  // A fresh audit is shown straight away, while the latest report refetches.
  const audited =
    runAudit.data?.websiteId === websiteId ? runAudit.data : undefined
  const report = running ? undefined : (audited ?? latestQuery.data)

  function stopTimer() {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }

  useEffect(() => stopTimer, [])

  function handleOpenChange(next: boolean) {
    if (!next) {
      stopTimer()
      runAudit.reset()
    }
    onOpenChange(next)
  }

  function generate() {
    if (!website) return
    stopTimer()
    setProgress(0)
    const started = Date.now()
    // The audit has no progress events, so ease towards 95% until it ends.
    timer.current = setInterval(() => {
      const elapsed = Date.now() - started
      setProgress(Math.min(95, Math.round((elapsed / EXPECTED_MS) * 100)))
    }, TICK_MS)
    runAudit.mutate({ websiteId: website.id })
  }

  const phase = running
    ? "generating"
    : report
      ? "report"
      : latestQuery.isPending && open && website
        ? "loading"
        : latestQuery.isError && !neverRun
          ? "error"
          : "idle"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-5xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="flex items-center gap-2">
            <GaugeIcon className="size-4 shrink-0" />
            <span className="truncate">
              Lighthouse Report{website ? ` – ${website.name}` : ""}
            </span>
          </DialogTitle>
          <DialogDescription className="flex min-w-0 items-center gap-1.5">
            <GlobeIcon className="size-4 shrink-0" />
            <span className="truncate">{website?.domain}</span>
          </DialogDescription>
        </DialogHeader>

        {phase === "report" && report ? (
          <>
            <ScrollArea className="-mx-4 h-[calc(90dvh-11rem)] min-h-0">
              <div className="flex flex-col gap-4 px-4 pb-1">
                <ScoreGrid scores={report.scores} />
                <ReportTabs report={report} />
              </div>
            </ScrollArea>
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs text-muted-foreground">
                Ran {formatDistanceToNow(report.ranAt, { addSuffix: true })}
              </span>
              <Button variant="outline" size="sm" onClick={generate}>
                <RefreshCwIcon data-icon="inline-start" />
                Run again
              </Button>
            </div>
          </>
        ) : phase === "loading" ? (
          <div
            className="flex justify-center py-16"
            aria-busy="true"
            aria-label="Loading the last report"
          >
            <Spinner />
          </div>
        ) : phase === "error" ? (
          <QueryError
            title="Couldn't load the last report"
            error={latestQuery.error}
            onRetry={() => void latestQuery.refetch()}
          />
        ) : (
          <Empty className="py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {phase === "generating" ? <Spinner /> : <GaugeIcon />}
              </EmptyMedia>
              <EmptyTitle>
                {phase === "generating"
                  ? "Generating Report..."
                  : "Run Lighthouse Analysis"}
              </EmptyTitle>
              <EmptyDescription>
                {phase === "generating"
                  ? "Analyzing performance, accessibility, best practices, and SEO. This may take a few moments..."
                  : "Get comprehensive insights about your website's performance, accessibility, SEO, and best practices."}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {phase === "generating" ? (
                <div className="flex w-full flex-col gap-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Analyzing website...</span>
                    <span className="tabular-nums">{progress}%</span>
                  </div>
                  <Progress value={progress} aria-label="Report progress" />
                </div>
              ) : (
                <Button onClick={generate} disabled={!website}>
                  <ZapIcon data-icon="inline-start" />
                  Generate Report
                </Button>
              )}
            </EmptyContent>
          </Empty>
        )}
      </DialogContent>
    </Dialog>
  )
}
