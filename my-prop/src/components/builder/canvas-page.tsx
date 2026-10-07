import type { CSSProperties } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { CanvasElement } from "./canvas-element"
import type { Device, Section, Selection } from "./types"

export const DEVICE_WIDTH: Record<Device, string> = {
  desktop: "max-w-6xl",
  tablet: "max-w-2xl",
  mobile: "max-w-sm",
}

function sectionStyle(section: Section, device: Device): CSSProperties {
  const { styles } = section
  const padding = styles.padding ?? 40
  return {
    backgroundColor: styles.backgroundColor,
    // Darken background photos so text stays readable.
    backgroundImage: styles.backgroundImage
      ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${styles.backgroundImage}")`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: device === "mobile" ? Math.round(padding / 2) : padding,
    minHeight: styles.height ? styles.height : undefined,
    textAlign: styles.textAlign ?? "left",
    color: styles.textColor ?? "#000000",
  }
}

type CanvasPageProps = {
  sections: Array<Section>
  device: Device
  /** When omitted the page renders read-only (preview mode). */
  selection?: Selection
  onSelect?: (sectionId: string, elementId?: string | null) => void
}

export function CanvasPage({
  sections,
  device,
  selection,
  onSelect,
}: CanvasPageProps) {
  const interactive = onSelect !== undefined

  return (
    <div
      className={cn(
        "mx-auto w-full overflow-hidden bg-background shadow-lg transition-[max-width] duration-300",
        DEVICE_WIDTH[device]
      )}
    >
      {sections.map((section) => {
        const selected = interactive && selection?.sectionId === section.id
        const sectionSelected = selected && !selection.elementId
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            style={sectionStyle(section, device)}
            onClick={
              interactive
                ? (event) => {
                    event.stopPropagation()
                    onSelect(section.id)
                  }
                : undefined
            }
            className={cn(
              "relative",
              interactive &&
                "cursor-pointer hover:ring-2 hover:ring-primary/40 hover:ring-inset",
              selected && "ring-2 ring-primary ring-inset hover:ring-primary",
              sectionSelected && "ring-4"
            )}
          >
            {selected && (
              <Badge className="absolute top-2 left-2">{section.name}</Badge>
            )}
            {section.elements.map((element) => (
              <CanvasElement
                key={element.id}
                element={element}
                device={device}
                selectedElementId={selected ? selection.elementId : null}
                onSelect={
                  interactive
                    ? (elementId) => onSelect(section.id, elementId)
                    : undefined
                }
              />
            ))}
          </section>
        )
      })}
    </div>
  )
}
