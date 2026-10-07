import type { BuilderElement, Section } from "./types"

export function uid() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }
  // Fallback for insecure contexts (e.g. plain http on a LAN IP).
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function findElement(
  elements: Array<BuilderElement>,
  id: string | null
): BuilderElement | null {
  if (!id) return null
  for (const element of elements) {
    if (element.id === id) return element
    if (element.children) {
      const found = findElement(element.children, id)
      if (found) return found
    }
  }
  return null
}

export function updateElementInTree(
  elements: Array<BuilderElement>,
  id: string,
  update: (element: BuilderElement) => BuilderElement
): Array<BuilderElement> {
  return elements.map((element) => {
    if (element.id === id) return update(element)
    if (element.children) {
      return {
        ...element,
        children: updateElementInTree(element.children, id, update),
      }
    }
    return element
  })
}

function cloneElement(element: BuilderElement): BuilderElement {
  return {
    ...element,
    id: uid(),
    styles: element.styles ? { ...element.styles } : undefined,
    children: element.children?.map(cloneElement),
  }
}

/**
 * Re-keys a section with stable ids so server and client renders match
 * (used for the initial default layout only).
 */
export function withStableIds(section: Section, prefix: string): Section {
  let counter = 0
  const rekey = (element: BuilderElement): BuilderElement => ({
    ...element,
    id: `${prefix}-el-${++counter}`,
    children: element.children?.map(rekey),
  })
  return { ...section, id: prefix, elements: section.elements.map(rekey) }
}

/** Deep copy of a section with fresh ids for the section and every element. */
export function cloneSection(section: Section): Section {
  return {
    ...section,
    id: uid(),
    name: `${section.name} (Copy)`,
    styles: { ...section.styles },
    elements: section.elements.map(cloneElement),
  }
}

export function isSectionArray(value: unknown): value is Array<Section> {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Section).id === "string" &&
        Array.isArray((item as Section).elements)
    )
  )
}

const NAMED_COLORS: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
}

/** Normalizes a CSS color to #rrggbb for native color inputs. */
export function toHexColor(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback
  const color = value.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(color)) return color
  if (/^#[0-9a-f]{3}$/.test(color)) {
    return `#${[...color.slice(1)].map((c) => c + c).join("")}`
  }
  return NAMED_COLORS[color] ?? fallback
}
