import type { CSSProperties } from "react"

export type ElementType =
  "heading" | "text" | "button" | "image" | "container" | "input" | "textarea"

export type BuilderElement = {
  id: string
  type: ElementType
  /** Text for text-like elements, URL for images, placeholder for inputs. */
  content?: string
  styles?: CSSProperties
  children?: Array<BuilderElement>
}

export type SectionType =
  "hero" | "gallery" | "amenities" | "pricing" | "contact" | "features"

/** Serializable icon key (resolved to a component in section-icons.ts). */
export type SectionIconKey =
  "layout" | "image" | "grid" | "columns" | "form" | "rows"

export type TextAlign = "left" | "center" | "right"

export type SectionStyles = {
  backgroundColor?: string
  backgroundImage?: string
  padding?: number
  /** Min height in px. 0 / undefined means auto. */
  height?: number
  textAlign?: TextAlign
  textColor?: string
}

export type Section = {
  id: string
  name: string
  type: SectionType
  icon: SectionIconKey
  styles: SectionStyles
  elements: Array<BuilderElement>
}

export type Device = "desktop" | "tablet" | "mobile"

export type Selection = {
  sectionId: string | null
  elementId: string | null
}
