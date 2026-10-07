import { useEffect, useRef, useState } from "react"
import {
  CheckIcon,
  ExternalLinkIcon,
  MonitorIcon,
  Share2Icon,
  SmartphoneIcon,
  SparklesIcon,
  StarIcon,
  TabletIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  PREVIEW_SECTIONS,
  TEMPLATE_FEATURES,
  copyToClipboard,
  templateShareUrl,
} from "@/components/templates/template-data"
import type {
  LibraryTemplate,
  PreviewSectionId,
} from "@/components/templates/template-data"
import { TemplatePreviewSite } from "@/components/templates/template-preview-site"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type ViewMode = "desktop" | "tablet" | "mobile"

const VIEW_WIDTHS: Record<ViewMode, string> = {
  desktop: "max-w-none",
  tablet: "max-w-[768px]",
  mobile: "max-w-[375px]",
}

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  template,
  onUseTemplate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: LibraryTemplate | null
  onUseTemplate: (template: LibraryTemplate) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95dvh] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[95vw]">
        {template && (
          // Keyed so view mode and active section reset per template.
          <PreviewContent
            key={template.id}
            template={template}
            onUseTemplate={onUseTemplate}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function PreviewContent({
  template,
  onUseTemplate,
}: {
  template: LibraryTemplate
  onUseTemplate: (template: LibraryTemplate) => void
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("desktop")
  const [activeSection, setActiveSection] = useState<PreviewSectionId>("hero")
  const sections = useRef(new Map<PreviewSectionId, HTMLElement>())
  const scrollLockUntil = useRef(0)

  const sectionRef = (id: PreviewSectionId) => (el: HTMLElement | null) => {
    if (el) sections.current.set(id, el)
    else sections.current.delete(id)
  }

  // Highlight whichever section is in the middle of the visible area.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < scrollLockUntil.current) return
        const visible = entries.find((entry) => entry.isIntersecting)
        const id = visible?.target.getAttribute("data-section")
        if (id) setActiveSection(id as PreviewSectionId)
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    sections.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollToSection(id: PreviewSectionId) {
    setActiveSection(id)
    scrollLockUntil.current = Date.now() + 800
    sections.current
      .get(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  async function share() {
    const copied = await copyToClipboard(templateShareUrl(template.id))
    if (copied) {
      toast.success("Link copied", {
        description: `Anyone with the link can preview ${template.name}.`,
      })
    } else {
      toast.error("Couldn't copy the link", {
        description: templateShareUrl(template.id),
      })
    }
  }

  return (
    <>
      <DialogHeader className="border-b p-4 pr-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="text-lg">{template.name}</DialogTitle>
            {template.isPremium && (
              <Badge>
                <SparklesIcon data-icon="inline-start" />
                Premium
              </Badge>
            )}
            <Badge variant="secondary">{template.category}</Badge>
          </div>
          <DialogDescription className="sr-only">
            Preview the {template.name} template with responsive view options
            and detailed sections.
          </DialogDescription>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              spacing={0}
              aria-label="Preview device"
              className="hidden md:flex"
              value={viewMode}
              onValueChange={(value) => {
                if (value) setViewMode(value as ViewMode)
              }}
            >
              <ToggleGroupItem value="desktop" aria-label="Desktop view">
                <MonitorIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="tablet" aria-label="Tablet view">
                <TabletIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="mobile" aria-label="Mobile view">
                <SmartphoneIcon />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="outline" size="sm" onClick={share}>
              <Share2Icon data-icon="inline-start" />
              Share
            </Button>
            <Button size="sm" onClick={() => onUseTemplate(template)}>
              <CheckIcon data-icon="inline-start" />
              Use Template
            </Button>
          </div>
        </div>
      </DialogHeader>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="bg-muted p-3 sm:p-6 lg:flex-1 lg:overflow-y-auto">
          <div
            className={cn(
              "mx-auto w-full transition-[max-width] duration-300",
              VIEW_WIDTHS[viewMode]
            )}
          >
            <TemplatePreviewSite template={template} sectionRef={sectionRef} />
          </div>
        </div>

        <aside className="flex flex-col gap-6 border-t p-4 sm:p-6 lg:order-first lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-r">
          <section className="flex flex-col gap-3">
            <h3 className="font-semibold">Template Details</h3>
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Rating</dt>
                <dd className="flex items-center gap-1 font-medium">
                  <StarIcon className="size-4 fill-current" aria-hidden />
                  {template.rating.toFixed(1)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Used by</dt>
                <dd className="font-medium">
                  {template.uses.toLocaleString()} users
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{template.category}</dd>
              </div>
            </dl>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {template.description}. This professionally designed template
              includes all essential sections and features to create a stunning
              property website that converts visitors into leads.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="font-semibold">Key Features</h3>
            <ul className="flex flex-col gap-2 text-sm">
              {TEMPLATE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-muted-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h3 id="preview-sections" className="font-semibold">
              Template Sections
            </h3>
            <ToggleGroup
              type="single"
              orientation="vertical"
              aria-labelledby="preview-sections"
              className="w-full"
              value={activeSection}
              onValueChange={(value) => {
                if (value) scrollToSection(value as PreviewSectionId)
              }}
            >
              {PREVIEW_SECTIONS.map((section) => (
                <ToggleGroupItem
                  key={section.id}
                  value={section.id}
                  className="justify-start"
                >
                  {section.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>

          <Separator />

          <div className="flex flex-col gap-2">
            <Button onClick={() => onUseTemplate(template)}>
              <CheckIcon data-icon="inline-start" />
              Use This Template
            </Button>
            <Button variant="outline" onClick={share}>
              <Share2Icon data-icon="inline-start" />
              Copy Share Link
            </Button>
            <Button variant="outline" asChild>
              <a
                href={templateShareUrl(template.id)}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLinkIcon data-icon="inline-start" />
                Open in New Tab
              </a>
            </Button>
          </div>
        </aside>
      </div>
    </>
  )
}
