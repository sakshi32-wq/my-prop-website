import {
  BoxIcon,
  Columns3Icon,
  HeadingIcon,
  ImageIcon,
  LayoutGridIcon,
  MousePointerClickIcon,
  PanelsTopLeftIcon,
  PilcrowIcon,
  Rows3Icon,
  TextCursorInputIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { ElementType, SectionIconKey } from "./types"

// Section state stores a serializable key; the component is resolved here.
export const SECTION_ICONS: Record<SectionIconKey, LucideIcon> = {
  layout: PanelsTopLeftIcon,
  image: ImageIcon,
  grid: LayoutGridIcon,
  columns: Columns3Icon,
  form: TextCursorInputIcon,
  rows: Rows3Icon,
}

export const ELEMENT_ICONS: Record<ElementType, LucideIcon> = {
  heading: HeadingIcon,
  text: PilcrowIcon,
  button: MousePointerClickIcon,
  image: ImageIcon,
  container: BoxIcon,
  input: TextCursorInputIcon,
  textarea: TextCursorInputIcon,
}

export const ELEMENT_LABELS: Record<ElementType, string> = {
  heading: "Heading",
  text: "Text",
  button: "Button",
  image: "Image",
  container: "Container",
  input: "Input",
  textarea: "Text area",
}
