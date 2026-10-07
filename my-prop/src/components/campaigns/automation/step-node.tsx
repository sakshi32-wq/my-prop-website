import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { ChoiceIcon } from "../choice-icon"
import { STEP_TYPES, configBadges } from "./automation-data"
import type { AutomationStep } from "./automation-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type NodeProps = {
  step: AutomationStep
  index: number
  onEdit: () => void
  onDelete?: () => void
  dragHandle?: React.ReactNode
}

export function StepNode({
  step,
  index,
  onEdit,
  onDelete,
  dragHandle,
}: NodeProps) {
  const meta = STEP_TYPES[step.type]
  const isTrigger = step.type === "trigger"

  return (
    <Item
      variant={isTrigger ? "muted" : "outline"}
      className="flex-nowrap items-start"
    >
      <ChoiceIcon
        icon={meta.icon}
        className={cn(isTrigger && "bg-primary text-primary-foreground")}
      />
      <ItemContent className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <ItemTitle>{step.name}</ItemTitle>
          <Badge variant={isTrigger ? "default" : "secondary"}>
            {isTrigger ? "Trigger" : `Step ${index}`}
          </Badge>
        </div>
        {step.description && (
          <ItemDescription>{step.description}</ItemDescription>
        )}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {configBadges(step).map((label) => (
            <Badge key={label} variant="outline">
              {label}
            </Badge>
          ))}
        </div>
      </ItemContent>
      <ItemActions className="gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${step.name}`}
              onClick={onEdit}
            >
              <PencilIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit step</TooltipContent>
        </Tooltip>
        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Delete ${step.name}`}
                onClick={onDelete}
              >
                <Trash2Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete step</TooltipContent>
          </Tooltip>
        )}
        {dragHandle}
      </ItemActions>
    </Item>
  )
}

export function Connector() {
  return <Separator orientation="vertical" className="mx-auto h-6" />
}

export function SortableStepNode(props: Omit<NodeProps, "dragHandle">) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.step.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("flex flex-col", isDragging && "relative z-10 opacity-80")}
    >
      <Connector />
      <StepNode
        {...props}
        dragHandle={
          <Button
            ref={setActivatorNodeRef}
            variant="ghost"
            size="icon-sm"
            aria-label={`Reorder ${props.step.name}`}
            className="cursor-grab touch-none active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon />
          </Button>
        }
      />
    </li>
  )
}
