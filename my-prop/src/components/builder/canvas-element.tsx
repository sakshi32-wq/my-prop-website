import type { CSSProperties, MouseEvent } from "react"

import { cn } from "@/lib/utils"

import type { BuilderElement, Device } from "./types"

// Hover outline only on the innermost hovered element.
const HOVER_OUTLINE =
  "[&:hover:not(:has([data-element-id]:hover))]:outline-1 [&:hover:not(:has([data-element-id]:hover))]:outline-dashed [&:hover:not(:has([data-element-id]:hover))]:outline-primary/60"

/** Approximates a responsive site on the narrow device previews. */
function responsiveStyles(
  styles: CSSProperties | undefined,
  device: Device
): CSSProperties {
  const result: CSSProperties = { ...styles }
  if (device === "desktop") return result
  if (
    result.display === "grid" &&
    typeof result.gridTemplateColumns === "string"
  ) {
    if (device === "mobile") result.gridTemplateColumns = "1fr"
    else if (result.gridTemplateColumns.startsWith("repeat(3"))
      result.gridTemplateColumns = "repeat(2, 1fr)"
  }
  if (device === "mobile") {
    if (typeof result.fontSize === "number" && result.fontSize > 24) {
      result.fontSize = Math.round(result.fontSize * 0.7)
    }
    if (typeof result.padding === "number" && result.padding > 24) {
      result.padding = Math.round(result.padding / 2)
    }
  }
  return result
}

type CanvasElementProps = {
  element: BuilderElement
  device: Device
  selectedElementId: string | null
  onSelect?: (elementId: string) => void
}

export function CanvasElement({
  element,
  device,
  selectedElementId,
  onSelect,
}: CanvasElementProps) {
  const interactive = onSelect !== undefined
  const style = responsiveStyles(element.styles, device)
  const props = {
    "data-element-id": element.id,
    style,
    className: cn(
      interactive && "cursor-pointer outline-offset-2",
      interactive && HOVER_OUTLINE,
      interactive &&
        selectedElementId === element.id &&
        "outline-2 outline-primary outline-solid"
    ),
    onClick: interactive
      ? (event: MouseEvent) => {
          event.stopPropagation()
          event.preventDefault()
          onSelect(element.id)
        }
      : undefined,
  }

  switch (element.type) {
    case "heading":
      return <h2 {...props}>{element.content}</h2>
    case "text":
      return <p {...props}>{element.content}</p>
    case "button":
      return (
        <button type="button" {...props}>
          {element.content}
        </button>
      )
    case "image":
      return element.content ? (
        <img src={element.content} alt="" {...props} />
      ) : (
        <div {...props} />
      )
    case "input":
      return (
        <input
          {...props}
          placeholder={element.content}
          readOnly={interactive}
          tabIndex={interactive ? -1 : undefined}
          aria-label={element.content}
        />
      )
    case "textarea":
      return (
        <textarea
          {...props}
          placeholder={element.content}
          readOnly={interactive}
          tabIndex={interactive ? -1 : undefined}
          aria-label={element.content}
        />
      )
    case "container":
      return (
        <div {...props}>
          {element.children?.map((child) => (
            <CanvasElement
              key={child.id}
              element={child}
              device={device}
              selectedElementId={selectedElementId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )
  }
}
