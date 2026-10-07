import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { UserIcon } from "lucide-react"

import { LeadCard } from "./lead-card"
import type { Lead, LeadStage } from "./data"
import type { LeadAction } from "./lead-card"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { LEAD_STAGES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type BoardProps = {
  leads: Array<Lead>
  onAction: (action: LeadAction, lead: Lead) => void
  onMove: (lead: Lead, stage: LeadStage) => void
}

function DraggableLeadCard({
  lead,
  onAction,
  onMove,
}: { lead: Lead } & Omit<BoardProps, "leads">) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: lead.id,
  })
  return (
    <LeadCard
      ref={setNodeRef}
      lead={lead}
      onAction={onAction}
      onMove={onMove}
      {...attributes}
      {...listeners}
      className={cn("touch-manipulation", isDragging && "opacity-40")}
    />
  )
}

function KanbanColumn({
  stage,
  leads,
  onAction,
  onMove,
}: {
  stage: (typeof LEAD_STAGES)[number]
} & BoardProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.value })

  return (
    <section
      aria-label={stage.label}
      className="flex w-72 shrink-0 flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 className="truncate font-medium">{stage.label}</h2>
        <Badge variant="secondary">{leads.length}</Badge>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-96 flex-1 flex-col gap-3 rounded-xl bg-muted/50 p-2 transition-colors",
          isOver && "bg-muted ring-2 ring-ring/50"
        )}
      >
        {leads.map((lead) => (
          <DraggableLeadCard
            key={lead.id}
            lead={lead}
            onAction={onAction}
            onMove={onMove}
          />
        ))}
        {leads.length === 0 && (
          <Empty className="flex-none border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserIcon />
              </EmptyMedia>
              <EmptyDescription>No leads in this stage</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </section>
  )
}

export function KanbanBoard({ leads, onAction, onMove }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 6 },
    })
  )

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null

  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(String(event.active.id))

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    if (!over) return
    const lead = leads.find((l) => l.id === active.id)
    const stage = over.id as LeadStage
    if (lead && lead.stage !== stage) onMove(lead, stage)
  }

  return (
    <DndContext
      id="leads-board"
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      {/* w-0 + min-w-full keeps the wide board from stretching the page. */}
      <ScrollArea className="w-0 min-w-full">
        <div className="flex gap-4 pb-4">
          {LEAD_STAGES.map((stage) => (
            <KanbanColumn
              key={stage.value}
              stage={stage}
              leads={leads.filter((l) => l.stage === stage.value)}
              onAction={onAction}
              onMove={onMove}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DragOverlay>
        {activeLead ? (
          <LeadCard
            lead={activeLead}
            onAction={() => {}}
            onMove={() => {}}
            dragging
            className="w-72"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

/** Loading state with the same column layout as the board. */
export function KanbanSkeleton() {
  return (
    <ScrollArea className="w-0 min-w-full">
      <div
        className="flex gap-4 pb-4"
        aria-busy="true"
        aria-label="Loading leads"
      >
        {LEAD_STAGES.map((stage, index) => (
          <section
            key={stage.value}
            aria-label={stage.label}
            className="flex w-72 shrink-0 flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-2 px-1">
              <h2 className="truncate font-medium">{stage.label}</h2>
              <Skeleton className="h-5 w-6 rounded-full" />
            </div>
            <div className="flex min-h-96 flex-col gap-3 rounded-xl bg-muted/50 p-2">
              {Array.from({ length: index % 2 === 0 ? 2 : 1 }, (_, i) => (
                <Skeleton key={i} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          </section>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
