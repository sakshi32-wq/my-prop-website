import { useState } from "react"
import type { CSSProperties } from "react"
import { arrayMove } from "@dnd-kit/sortable"
import { toast } from "sonner"

import { createDefaultSections } from "./section-templates"
import type { SectionTemplate } from "./section-templates"
import { cloneSection, findElement, updateElementInTree } from "./tree-utils"
import type {
  BuilderElement,
  Device,
  Section,
  SectionStyles,
  Selection,
} from "./types"
import { useHistory } from "./use-history"

export type ElementPatch = {
  content?: string
  styles?: CSSProperties
}

export function useBuilderState() {
  const history = useHistory<Array<Section>>(createDefaultSections)
  const sections = history.value
  const { commit, undo, redo } = history

  const [device, setDevice] = useState<Device>("desktop")
  const [selection, setSelection] = useState<Selection>(() => ({
    sectionId: sections.at(0)?.id ?? null,
    elementId: null,
  }))

  // Selection is validated against the current sections, so undo/redo or
  // deletes never leave a dangling selection.
  const selectedSection =
    sections.find((s) => s.id === selection.sectionId) ?? null
  const selectedElement: BuilderElement | null = selectedSection
    ? findElement(selectedSection.elements, selection.elementId)
    : null

  function select(sectionId: string | null, elementId: string | null = null) {
    setSelection({ sectionId, elementId })
  }

  function addSection(template: SectionTemplate) {
    const section = template.create()
    commit((prev) => [...prev, section])
    select(section.id)
    toast.success(`${template.name} added`)
  }

  function deleteSection(id: string) {
    const index = sections.findIndex((s) => s.id === id)
    if (index === -1) return
    const section = sections[index]
    commit((prev) => prev.filter((s) => s.id !== id))
    if (selection.sectionId === id) {
      // Select the next section, or the previous one when deleting the last.
      const neighbor =
        index + 1 < sections.length
          ? sections[index + 1]
          : index > 0
            ? sections[index - 1]
            : null
      select(neighbor?.id ?? null)
    }
    toast.success(`"${section.name}" deleted`, {
      action: { label: "Undo", onClick: undo },
    })
  }

  function duplicateSection(id: string) {
    const original = sections.find((s) => s.id === id)
    if (!original) return
    const copy = cloneSection(original)
    commit((prev) => {
      const index = prev.findIndex((s) => s.id === id)
      if (index === -1) return prev
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]
    })
    select(copy.id)
    toast.success("Section duplicated")
  }

  function moveSection(activeId: string, overId: string) {
    commit((prev) => {
      const from = prev.findIndex((s) => s.id === activeId)
      const to = prev.findIndex((s) => s.id === overId)
      if (from === -1 || to === -1 || from === to) return prev
      return arrayMove(prev, from, to)
    })
  }

  function renameSection(id: string, name: string) {
    commit(
      (prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)),
      `section:${id}:name`
    )
  }

  function updateSectionStyles(id: string, patch: Partial<SectionStyles>) {
    commit(
      (prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, styles: { ...s.styles, ...patch } } : s
        ),
      `section:${id}:styles:${Object.keys(patch).join(",")}`
    )
  }

  function updateElement(
    sectionId: string,
    elementId: string,
    patch: ElementPatch
  ) {
    const fields = [
      ...(patch.content !== undefined ? ["content"] : []),
      ...Object.keys(patch.styles ?? {}),
    ]
    commit(
      (prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: updateElementInTree(s.elements, elementId, (el) => ({
                  ...el,
                  ...(patch.content !== undefined && {
                    content: patch.content,
                  }),
                  styles: { ...el.styles, ...patch.styles },
                })),
              }
            : s
        ),
      `element:${elementId}:${fields.join(",")}`
    )
  }

  return {
    sections,
    device,
    setDevice,
    selection,
    selectedSection,
    selectedElement,
    select,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    undo,
    redo,
    resetSections: history.reset,
    addSection,
    deleteSection,
    duplicateSection,
    moveSection,
    renameSection,
    updateSectionStyles,
    updateElement,
  }
}

export type BuilderState = ReturnType<typeof useBuilderState>
