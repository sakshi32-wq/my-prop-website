import { useEffect, useEffectEvent, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

import { BuilderCanvas } from "./builder-canvas"
import { BuilderProvider } from "./builder-context"
import { BuilderTopBar } from "./builder-top-bar"
import { EditWebsiteInfoDialog } from "./edit-website-info-dialog"
import { PreviewDialog } from "./preview-dialog"
import { PropertiesPanel } from "./properties-panel"
import { SectionsPanel } from "./sections-panel"
import { loadDraft, saveDraft, serializableInfo } from "./storage"
import type { Section } from "./types"
import { useBuilderState } from "./use-builder-state"
import { createDefaultWebsiteInfo, getWebsiteMeta } from "./website-info"
import type { WebsiteInfo } from "./website-info"

type Snapshot = { sections: Array<Section>; info: WebsiteInfo }

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "website"
  )
}

export function WebsiteBuilderPage({ websiteId }: { websiteId: string }) {
  const builder = useBuilderState()
  const { sections, undo, redo, resetSections, select } = builder
  const { domain } = getWebsiteMeta(websiteId)
  const [info, setInfo] = useState(() => createDefaultWebsiteInfo(websiteId))
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [panel, setPanel] = useState<"sections" | "properties" | null>(null)
  const [editInfoOpen, setEditInfoOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const dirty =
    snapshot !== null &&
    (snapshot.sections !== sections || snapshot.info !== info)

  // Restore the saved draft for this website (client only).
  const restoreDraft = useEffectEvent(() => {
    try {
      const draft = loadDraft(websiteId, info)
      if (!draft) {
        setSnapshot({ sections, info })
        return
      }
      resetSections(draft.sections)
      setInfo(draft.info)
      select(draft.sections.at(0)?.id ?? null)
      setSnapshot({ sections: draft.sections, info: draft.info })
      toast("Restored your saved draft", {
        description: draft.savedAt
          ? `Last saved ${formatDistanceToNow(new Date(draft.savedAt), { addSuffix: true })}`
          : undefined,
      })
    } catch {
      setSnapshot({ sections, info })
      toast.error("Couldn't load your saved draft", {
        description: "Starting from the default layout instead.",
      })
    }
  })
  const restored = useRef(false)
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    restoreDraft()
  }, [])

  // Sheets are only for small screens; close them when the layout widens.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)")
    const onChange = () => {
      if (query.matches) setPanel(null)
    }
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  function save({ silent = false } = {}) {
    try {
      saveDraft(websiteId, sections, info)
      setSnapshot({ sections, info })
      if (!silent) toast.success("Website saved")
      return true
    } catch {
      toast.error("Couldn't save", {
        description: "Your browser storage may be full or disabled.",
      })
      return false
    }
  }

  function publish() {
    if (sections.length === 0) {
      toast.error("Add at least one section before publishing")
      return
    }
    if (!save({ silent: true })) return
    toast.success("Website published", {
      description: `Your changes are live at ${domain}`,
    })
  }

  function exportData() {
    const data = {
      website: { id: websiteId, name: info.projectName, domain },
      info: serializableInfo(info),
      sections,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${slugify(info.projectName)}-website.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
    toast.success("Website data exported", { description: link.download })
  }

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey) return
    const key = event.key.toLowerCase()
    if (key === "s") {
      event.preventDefault()
      save()
      return
    }
    // Leave native text undo alone while typing in a field.
    if (isEditableTarget(event.target)) return
    if (key === "z") {
      event.preventDefault()
      if (event.shiftKey) redo()
      else undo()
    } else if (key === "y") {
      event.preventDefault()
      redo()
    }
  })
  useEffect(() => {
    const listener = (event: KeyboardEvent) => handleKeyDown(event)
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener)
  }, [])

  const sectionsPanel = (
    <SectionsPanel
      onEditInfo={() => {
        setPanel(null)
        setEditInfoOpen(true)
      }}
      onExport={exportData}
    />
  )

  return (
    <BuilderProvider value={builder}>
      <div className="flex h-svh flex-col overflow-hidden bg-background">
        <BuilderTopBar
          name={info.projectName}
          domain={domain}
          dirty={dirty}
          onSave={() => save()}
          onPreview={() => setPreviewOpen(true)}
          onPublish={publish}
          onOpenSections={() => setPanel("sections")}
          onOpenProperties={() => setPanel("properties")}
        />

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-72 shrink-0 border-r lg:block">
            {sectionsPanel}
          </aside>
          <BuilderCanvas />
          <aside className="hidden w-80 shrink-0 border-l lg:block">
            <PropertiesPanel />
          </aside>
        </div>
      </div>

      {/* Below lg the side panels live in sheets. */}
      <Sheet
        open={panel === "sections"}
        onOpenChange={(open) => setPanel(open ? "sections" : null)}
      >
        <SheetContent side="left" className="gap-0 p-0 lg:hidden">
          <SheetHeader>
            <SheetTitle>Sections &amp; Layers</SheetTitle>
            <SheetDescription>
              Reorder, add and inspect page sections.
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <div className="min-h-0 flex-1">{sectionsPanel}</div>
        </SheetContent>
      </Sheet>
      <Sheet
        open={panel === "properties"}
        onOpenChange={(open) => setPanel(open ? "properties" : null)}
      >
        <SheetContent side="right" className="gap-0 p-0 lg:hidden">
          <SheetHeader>
            <SheetTitle>Properties</SheetTitle>
            <SheetDescription>
              Edit the selected section or element.
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <div className="min-h-0 flex-1">
            <PropertiesPanel showHeading={false} />
          </div>
        </SheetContent>
      </Sheet>

      <EditWebsiteInfoDialog
        open={editInfoOpen}
        onOpenChange={setEditInfoOpen}
        info={info}
        onSave={setInfo}
      />
      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        sections={sections}
        device={builder.device}
        name={info.projectName}
        domain={domain}
      />
    </BuilderProvider>
  )
}
