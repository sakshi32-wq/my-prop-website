import { useEffect, useEffectEvent, useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon, GlobeIcon } from "lucide-react"
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
import { createDefaultSections } from "./section-templates"
import { isSectionArray } from "./tree-utils"
import type { Section } from "./types"
import { useBuilderState } from "./use-builder-state"
import { serializableInfo } from "./website-info"
import type { WebsiteInfo } from "./website-info"
import { ApiError } from "@/api/fetcher"
import {
  useGetWebsite,
  useGetWebsiteContent,
  usePublishWebsite,
  useSaveWebsiteContent,
} from "@/api/generated/websites/websites"
import type { Website, WebsiteContent } from "@/api/generated/model"
import { QueryError } from "@/components/query-error"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"

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

/** Loads the website and its saved content, then mounts the editor. */
export function WebsiteBuilderPage({ websiteId }: { websiteId: string }) {
  const websiteQuery = useGetWebsite(websiteId)
  const contentQuery = useGetWebsiteContent(websiteId)

  if (websiteQuery.isSuccess && contentQuery.isSuccess)
    return (
      <BuilderEditor website={websiteQuery.data} content={contentQuery.data} />
    )

  const error = websiteQuery.error ?? contentQuery.error
  if (error instanceof ApiError && error.status === 404)
    return (
      <div className="flex h-svh items-center justify-center p-4">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GlobeIcon />
            </EmptyMedia>
            <EmptyTitle>Website not found</EmptyTitle>
            <EmptyDescription>
              It may have been deleted, or the link is wrong.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" asChild>
              <Link to="/app/websites">
                <ArrowLeftIcon data-icon="inline-start" />
                Back to websites
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )

  if (error)
    return (
      <div className="flex h-svh items-center justify-center p-4">
        <QueryError
          className="max-w-lg"
          title="Couldn't open the website builder"
          error={error}
          onRetry={() => {
            void websiteQuery.refetch()
            void contentQuery.refetch()
          }}
        />
      </div>
    )

  return (
    <div
      className="flex h-svh flex-col"
      aria-busy="true"
      aria-label="Loading website builder"
    >
      <Skeleton className="h-14 rounded-none" />
      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <Skeleton className="hidden w-64 lg:block" />
        <Skeleton className="flex-1" />
        <Skeleton className="hidden w-72 lg:block" />
      </div>
    </div>
  )
}

function BuilderEditor({
  website,
  content,
}: {
  website: Website
  content: WebsiteContent
}) {
  const websiteId = website.id
  const { domain } = website
  // The loaded state is the "saved" snapshot, so the editor starts clean.
  const [loaded] = useState(() => {
    const valid = content.sections === null || isSectionArray(content.sections)
    return {
      valid,
      snapshot: {
        sections: isSectionArray(content.sections)
          ? content.sections
          : createDefaultSections(),
        info: content.info,
      } satisfies Snapshot,
    }
  })
  const builder = useBuilderState(() => loaded.snapshot.sections)
  const { sections, undo, redo } = builder
  const [info, setInfo] = useState<WebsiteInfo>(loaded.snapshot.info)
  const [snapshot, setSnapshot] = useState<Snapshot>(loaded.snapshot)
  const [panel, setPanel] = useState<"sections" | "properties" | null>(null)
  const [editInfoOpen, setEditInfoOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const saveContent = useSaveWebsiteContent()
  const publishWebsite = usePublishWebsite({
    mutation: {
      onSuccess: (site) =>
        toast.success("Website published", {
          description: `Your changes are live at ${site.domain}`,
        }),
    },
  })

  const dirty = snapshot.sections !== sections || snapshot.info !== info

  const warnInvalidLayout = useEffectEvent(() => {
    if (!loaded.valid)
      toast.error("Couldn't load your saved layout", {
        description: "Starting from the default layout instead.",
      })
  })
  useEffect(() => warnInvalidLayout(), [])

  // Sheets are only for small screens; close them when the layout widens.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)")
    const onChange = () => {
      if (query.matches) setPanel(null)
    }
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  function save({
    silent = false,
    onSaved,
  }: { silent?: boolean; onSaved?: () => void } = {}) {
    const saved = { sections, info }
    saveContent.mutate(
      {
        websiteId,
        data: { info: serializableInfo(info), sections },
      },
      {
        onSuccess: () => {
          setSnapshot(saved)
          if (!silent) toast.success("Website saved")
          onSaved?.()
        },
      }
    )
  }

  function publish() {
    if (sections.length === 0) {
      toast.error("Add at least one section before publishing")
      return
    }
    // Publishing makes the saved content live, so save first.
    save({
      silent: true,
      onSaved: () => publishWebsite.mutate({ websiteId }),
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
      if (!saveContent.isPending) save()
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
          saving={saveContent.isPending}
          publishing={publishWebsite.isPending}
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
