import { useEffect, useRef, useState } from "react"
import {
  CheckIcon,
  Code2Icon,
  DownloadIcon,
  EyeIcon,
  MonitorIcon,
  RotateCcwIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react"
import { toast } from "sonner"

import { CopyButton } from "../copy-button"
import { downloadFile } from "../utils"
import { ChatPanel } from "./chat-panel"
import type { ChatMessage } from "./chat-panel"
import { PAGE_HTML } from "./page-code"
import { PreviewPanel } from "./preview-panel"
import type { Device, PreviewView } from "./preview-panel"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const REPLY =
  "I've created that for you. Check the live preview and let me know if you'd like any changes!"

const DEVICES = [
  { value: "desktop", label: "Desktop", icon: MonitorIcon },
  { value: "tablet", label: "Tablet", icon: TabletIcon },
  { value: "mobile", label: "Mobile", icon: SmartphoneIcon },
] as const

export function WebPageDesigner() {
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [generating, setGenerating] = useState(false)
  const [device, setDevice] = useState<Device>("desktop")
  const [view, setView] = useState<PreviewView>("preview")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const hasPage = messages.some(
    (message) => message.role === "assistant" && !message.pending
  )

  function handleSend(prompt: string) {
    if (generating) return
    const pendingId = crypto.randomUUID()
    setGenerating(true)
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: prompt },
      {
        id: pendingId,
        role: "assistant",
        content: "Generating your page...",
        pending: true,
      },
    ])
    timer.current = setTimeout(() => {
      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId
            ? { ...message, content: REPLY, pending: false }
            : message
        )
      )
      setGenerating(false)
    }, 2000)
  }

  function startOver() {
    clearTimeout(timer.current)
    setMessages([])
    setGenerating(false)
    setView("preview")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          value={device}
          onValueChange={(value) => {
            if (value) setDevice(value as Device)
          }}
          aria-label="Preview device"
        >
          {DEVICES.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              aria-label={option.label}
            >
              <option.icon data-icon="inline-start" />
              <span className="hidden sm:inline">{option.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={0}
            value={view}
            onValueChange={(value) => {
              if (value) setView(value as PreviewView)
            }}
            aria-label="Preview or code"
          >
            <ToggleGroupItem value="preview">
              <EyeIcon data-icon="inline-start" />
              Preview
            </ToggleGroupItem>
            <ToggleGroupItem value="code">
              <Code2Icon data-icon="inline-start" />
              View Code
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPage}
            onClick={() => {
              downloadFile("property-page.html", PAGE_HTML, "text/html")
              toast.success("Page exported", {
                description: "property-page.html was downloaded.",
              })
            }}
          >
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <ChatPanel
            messages={messages}
            generating={generating}
            onSend={handleSend}
          />
        </div>
        <div className="min-w-0">
          <PreviewPanel device={device} view={view} hasPage={hasPage} />
        </div>
      </div>

      {hasPage && (
        <>
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckIcon className="size-4 text-primary" />
              Page generated successfully
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <CopyButton
                text={PAGE_HTML}
                label="Copy Code"
                showLabel
                variant="outline"
              />
              <Button variant="outline" size="sm" onClick={startOver}>
                <RotateCcwIcon data-icon="inline-start" />
                Start Over
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  toast.success("Page added to your website", {
                    description:
                      "Open the website builder to place and publish it.",
                  })
                }
              >
                <CheckIcon data-icon="inline-start" />
                Use This Page
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
