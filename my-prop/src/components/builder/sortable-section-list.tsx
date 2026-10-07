import { useId } from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { useBuilder } from "./builder-context"
import { SECTION_ICONS } from "./section-icons"
import type { Section } from "./types"

function SortableSectionRow({
  section,
  selected,
  onSelect,
  onDelete,
}: {
  section: Section
  selected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })
  const Icon = SECTION_ICONS[section.icon]

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group/row flex items-center gap-1 rounded-lg pr-1 text-sm transition-colors hover:bg-muted",
        selected && "bg-muted",
        isDragging && "relative z-10 opacity-70 shadow-md"
      )}
    >
      <Button
        ref={setActivatorNodeRef}
        variant="ghost"
        size="icon-xs"
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label={`Reorder ${section.name}`}
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon />
      </Button>
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected || undefined}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-md py-1.5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          selected ? "font-medium text-foreground" : "text-muted-foreground"
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span className="truncate">{section.name}</span>
      </button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100"
            aria-label={`Delete ${section.name}`}
            onClick={onDelete}
          >
            <Trash2Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete section</TooltipContent>
      </Tooltip>
    </li>
  )
}

export function SortableSectionList() {
  const { sections, selection, select, moveSection, deleteSection } =
    useBuilder()
  const dndId = useId()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      moveSection(String(active.id), String(over.id))
    }
  }

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-0.5">
          {sections.map((section) => (
            <SortableSectionRow
              key={section.id}
              section={section}
              selected={selection.sectionId === section.id}
              onSelect={() => select(section.id)}
              onDelete={() => deleteSection(section.id)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
