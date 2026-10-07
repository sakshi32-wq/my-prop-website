import { useEffect, useRef, useSyncExternalStore } from "react"
import { LayoutTemplateIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { useBuilder } from "./builder-context"
import { CanvasPage } from "./canvas-page"
import { SECTION_TEMPLATES } from "./section-templates"

// Below md the device switcher is hidden, so always preview the mobile layout.
const SMALL_SCREEN = "(max-width: 47.99rem)"

function subscribeSmallScreen(onChange: () => void) {
  const query = window.matchMedia(SMALL_SCREEN)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function useIsSmallScreen() {
  return useSyncExternalStore(
    subscribeSmallScreen,
    () => window.matchMedia(SMALL_SCREEN).matches,
    () => false
  )
}

export function BuilderCanvas() {
  const { sections, device, selection, select, addSection } = useBuilder()
  const isSmallScreen = useIsSmallScreen()
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep the selected section/element visible (e.g. when picked from Layers).
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const target = selection.elementId
      ? container.querySelector(`[data-element-id="${selection.elementId}"]`)
      : selection.sectionId
        ? container.querySelector(`[data-section-id="${selection.sectionId}"]`)
        : null
    target?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selection.sectionId, selection.elementId])

  return (
    <div
      ref={containerRef}
      className="min-w-0 flex-1 overflow-auto bg-muted p-4 sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) select(null)
      }}
    >
      {sections.length === 0 ? (
        <Empty className="h-full border bg-background">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutTemplateIcon />
            </EmptyMedia>
            <EmptyTitle>This page is empty</EmptyTitle>
            <EmptyDescription>
              Add a section to start building your website.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => addSection(SECTION_TEMPLATES[0])}>
              <PlusIcon data-icon="inline-start" />
              Add Hero Banner
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <CanvasPage
          sections={sections}
          device={isSmallScreen ? "mobile" : device}
          selection={selection}
          onSelect={(sectionId, elementId) => select(sectionId, elementId)}
        />
      )}
    </div>
  )
}
