import { useEffect, useRef, useState } from "react"
import { GaugeIcon, GlobeIcon, RefreshCwIcon, ZapIcon } from "lucide-react"
import { toast } from "sonner"

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

const GENERATION_MS = 3000
const TICK_MS = 100

type Phase = "idle" | "generating" | "report"

export function LighthouseReportDialog({
  open,
  onOpenChange,
  website,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  website: { id: string; name: string; domain: string } | null
}) {
  // The report is tied to one website: opening another one starts from idle.
  const [run, setRun] = useState<{ websiteId: string; phase: Phase } | null>(
    null
  )
  const [progress, setProgress] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const phase: Phase =
    run && website && run.websiteId === website.id ? run.phase : "idle"

  function stopTimer() {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }

  useEffect(() => stopTimer, [])

  function reset() {
    stopTimer()
    setRun(null)
    setProgress(0)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function generate() {
    if (!website) return
    const websiteId = website.id
    stopTimer()
    setProgress(0)
    setRun({ websiteId, phase: "generating" })
    const started = Date.now()
    timer.current = setInterval(() => {
      const elapsed = Date.now() - started
      setProgress(Math.min(100, Math.round((elapsed / GENERATION_MS) * 100)))
      if (elapsed >= GENERATION_MS) {
        stopTimer()
        setRun({ websiteId, phase: "report" })
        toast.success("Lighthouse report ready", {
          description: website.name,
        })
      }
    }, TICK_MS)
  }

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

        {phase === "report" ? (
          <>
            <ScrollArea className="-mx-4 h-[calc(90dvh-11rem)] min-h-0">
              <div className="flex flex-col gap-4 px-4 pb-1">
                <ScoreGrid />
                <ReportTabs />
              </div>
            </ScrollArea>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={generate}>
                <RefreshCwIcon data-icon="inline-start" />
                Run again
              </Button>
            </div>
          </>
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
