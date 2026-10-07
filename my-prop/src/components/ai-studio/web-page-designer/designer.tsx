import { useState } from "react"
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
import { PreviewPanel } from "./preview-panel"
import type { Device, PreviewView } from "./preview-panel"
import { useDesignPage } from "@/api/generated/ai/ai"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const DEVICES = [
  { value: "desktop", label: "Desktop", icon: MonitorIcon },
  { value: "tablet", label: "Tablet", icon: TabletIcon },
  { value: "mobile", label: "Mobile", icon: SmartphoneIcon },
] as const

export function WebPageDesigner() {
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [device, setDevice] = useState<Device>("desktop")
  const [view, setView] = useState<PreviewView>("preview")
  // The page's HTML from the latest reply.
  const [html, setHtml] = useState("")
  const designPage = useDesignPage({
    mutation: { meta: { errorToast: false } },
  })
  const generating = designPage.isPending

  const hasPage = html.length > 0

  function handleSend(prompt: string) {
    if (generating) return
    const pendingId = crypto.randomUUID()
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
    const settle = (content: string) =>
      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId
            ? { ...message, content, pending: false }
            : message
        )
      )
    designPage.mutate(
      { data: { prompt } },
      {
        onSuccess: (design) => {
          setHtml(design.html)
          settle(design.reply)
        },
        // Shown in the chat instead of a toast.
        onError: (error) =>
          settle(`Sorry, I couldn't design that: ${error.message}`),
      }
    )
  }

  function startOver() {
    designPage.reset()
    setMessages([])
    setHtml("")
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
              downloadFile("property-page.html", html, "text/html")
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
          <PreviewPanel device={device} view={view} html={html} />
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
                text={html}
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
