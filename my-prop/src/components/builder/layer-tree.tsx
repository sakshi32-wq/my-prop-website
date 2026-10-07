import { ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

import { ELEMENT_ICONS, ELEMENT_LABELS } from "./section-icons"
import type { BuilderElement } from "./types"

function layerLabel(element: BuilderElement) {
  if (element.type === "image" || element.type === "container") {
    return ELEMENT_LABELS[element.type]
  }
  return element.content?.trim() || ELEMENT_LABELS[element.type]
}

function LayerRow({
  element,
  depth,
  selectedElementId,
  onSelect,
}: {
  element: BuilderElement
  depth: number
  selectedElementId: string | null
  onSelect: (id: string) => void
}) {
  const Icon = ELEMENT_ICONS[element.type]
  const hasChildren = !!element.children?.length
  const selected = selectedElementId === element.id

  const row = (
    <div
      className="flex items-center gap-0.5"
      style={{ paddingLeft: depth * 12 }}
    >
      {hasChildren ? (
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="[&[data-state=open]>svg]:rotate-90"
            aria-label={`Toggle ${layerLabel(element)}`}
          >
            <ChevronRightIcon className="transition-transform" />
          </Button>
        </CollapsibleTrigger>
      ) : (
        <span aria-hidden className="size-6 shrink-0" />
      )}
      <Button
        variant={selected ? "secondary" : "ghost"}
        size="xs"
        className={cn(
          "min-w-0 flex-1 justify-start",
          !selected && "text-muted-foreground"
        )}
        aria-current={selected || undefined}
        onClick={() => onSelect(element.id)}
      >
        <Icon data-icon="inline-start" />
        <span className="truncate">{layerLabel(element)}</span>
      </Button>
    </div>
  )

  if (!hasChildren) return <li>{row}</li>

  return (
    <li>
      <Collapsible defaultOpen={depth === 0}>
        {row}
        <CollapsibleContent>
          <LayerTree
            elements={element.children ?? []}
            depth={depth + 1}
            selectedElementId={selectedElementId}
            onSelect={onSelect}
          />
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

export function LayerTree({
  elements,
  depth = 0,
  selectedElementId,
  onSelect,
}: {
  elements: Array<BuilderElement>
  depth?: number
  selectedElementId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {elements.map((element) => (
        <LayerRow
          key={element.id}
          element={element}
          depth={depth}
          selectedElementId={selectedElementId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}
