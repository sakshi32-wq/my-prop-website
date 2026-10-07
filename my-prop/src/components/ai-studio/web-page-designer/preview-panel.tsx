import { Code2Icon, EyeIcon, Maximize2Icon } from "lucide-react"

import { MockPage } from "./mock-page"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

export type Device = "desktop" | "tablet" | "mobile"
export type PreviewView = "preview" | "code"

const FRAME_WIDTH: Record<Device, string> = {
  desktop: "max-w-full",
  tablet: "max-w-[768px]",
  mobile: "max-w-[375px]",
}

export function PreviewPanel({
  device,
  view,
  html,
}: {
  device: Device
  view: PreviewView
  /** The page's HTML; empty until a design has been generated. */
  html: string
}) {
  const hasPage = html.length > 0
  return (
    <Card size="sm" className="h-[32rem] lg:h-[36rem]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          {view === "code" ? (
            <>
              <Code2Icon className="size-4 text-muted-foreground" />
              HTML/CSS Code
            </>
          ) : (
            <>
              <EyeIcon className="size-4 text-muted-foreground" />
              Live Preview
            </>
          )}
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className="capitalize">
            {device}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        {!hasPage ? (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {view === "code" ? <Code2Icon /> : <Maximize2Icon />}
              </EmptyMedia>
              <EmptyTitle>
                {view === "code" ? "No code yet" : "Nothing to preview yet"}
              </EmptyTitle>
              <EmptyDescription>
                Your generated page will appear here
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : view === "code" ? (
          <pre className="h-full overflow-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
            <code>{html}</code>
          </pre>
        ) : (
          <div className="h-full overflow-auto rounded-lg bg-muted p-2 sm:p-4">
            <div
              className={cn(
                "mx-auto w-full overflow-hidden rounded-lg border transition-[max-width] duration-300",
                FRAME_WIDTH[device]
              )}
            >
              <MockPage />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
