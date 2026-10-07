import { useEffect, useState } from "react"
import { Maximize2Icon, Minimize2Icon, SparklesIcon } from "lucide-react"

import { EMPTY_FORM, getTool, INITIAL_GENERATIONS, isContentTool } from "./data"
import type { ContentFormData, Generation, ToolId } from "./data"
import { ContentTool } from "./content-tool"
import { RecentGenerations } from "./recent-generations"
import { ToolList } from "./tool-list"
import { WebPageDesigner } from "./web-page-designer/designer"
import { WebsiteTool } from "./website-tool"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function AiStudio() {
  const [selectedTool, setSelectedTool] = useState<ToolId>("copy")
  const [formData, setFormData] = useState<ContentFormData>(EMPTY_FORM)
  const [generations, setGenerations] =
    useState<Array<Generation>>(INITIAL_GENERATIONS)
  const [fullscreen, setFullscreen] = useState(false)

  const tool = getTool(selectedTool)

  useEffect(() => {
    if (!fullscreen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        setFullscreen(false)
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [fullscreen])

  return (
    <>
      <PageHeader
        title="AI Studio"
        description="Generate content, copy, and campaigns with AI"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6">
          <ToolList value={selectedTool} onValueChange={setSelectedTool} />
          <RecentGenerations
            generations={generations}
            onDelete={(id) =>
              setGenerations((current) =>
                current.filter((item) => item.id !== id)
              )
            }
          />
        </div>

        <Card
          className={cn(
            "min-w-0 lg:col-span-2 lg:self-start",
            fullscreen && "fixed inset-0 z-50 overflow-y-auto rounded-none"
          )}
        >
          <CardHeader>
            <CardTitle className="text-lg">{tool.name}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
            <CardAction className="flex items-center gap-2">
              <Badge variant="secondary">
                <SparklesIcon data-icon="inline-start" />
                AI Powered
              </Badge>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-pressed={fullscreen}
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                onClick={() => setFullscreen((value) => !value)}
              >
                {fullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {selectedTool === "webpage" && <WebPageDesigner />}
            {selectedTool === "website" && <WebsiteTool />}
            {isContentTool(selectedTool) && (
              <ContentTool
                key={selectedTool}
                tool={selectedTool}
                data={formData}
                onDataChange={setFormData}
                onSaveDraft={(generation) =>
                  setGenerations((current) => [generation, ...current])
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
