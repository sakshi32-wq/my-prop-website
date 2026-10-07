import { useState } from "react"
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
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { PlusIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { AddStepDialog } from "./add-step-dialog"
import { AutomationHeader } from "./automation-header"
import { STEP_TYPES, createStep, initialSteps } from "./automation-data"
import type { AutomationStep, StepType } from "./automation-data"
import { EditStepDialog } from "./edit-step-dialog"
import { Connector, SortableStepNode, StepNode } from "./step-node"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type OpenDialog = "add" | "edit" | "delete" | null

export function AutomationBuilder() {
  const [name, setName] = useState("New Automation")
  // The trigger is always the first step.
  const [steps, setSteps] = useState<AutomationStep[]>(initialSteps)
  const [dialog, setDialog] = useState<OpenDialog>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = steps.find((s) => s.id === selectedId)
  const [trigger, ...actions] = steps

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function openFor(kind: "edit" | "delete", id: string) {
    setSelectedId(id)
    setDialog(kind)
  }

  function closeDialog(open: boolean) {
    if (!open) setDialog(null)
  }

  function addStep(type: StepType) {
    const step = createStep(type)
    setSteps((prev) => [...prev, step])
    toast.success(`${STEP_TYPES[type].name} step added`)
    // Jump straight into configuring the new step.
    openFor("edit", step.id)
  }

  function saveStep(updated: AutomationStep) {
    setSteps((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setDialog(null)
    toast.success("Step updated successfully")
  }

  function deleteStep() {
    if (!selected || selected.type === "trigger") return
    setSteps((prev) => prev.filter((s) => s.id !== selected.id))
    setDialog(null)
    toast.success(`"${selected.name}" deleted`)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    setSteps(([first, ...rest]) => {
      const from = rest.findIndex((s) => s.id === active.id)
      const to = rest.findIndex((s) => s.id === over.id)
      if (from === -1 || to === -1) return [first, ...rest]
      return [first, ...arrayMove(rest, from, to)]
    })
  }

  function saveAutomation() {
    if (actions.length === 0) {
      toast.error("Add at least one step after the trigger")
      return
    }
    toast.success(`"${name}" saved`, {
      description: `${steps.length} steps configured`,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <AutomationHeader
        name={name}
        onNameChange={setName}
        stepCount={steps.length}
        action={
          <Button onClick={saveAutomation}>
            <SaveIcon data-icon="inline-start" />
            Save Automation
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Automation Flow</CardTitle>
          <CardDescription>
            Steps run from top to bottom. Drag the handle to reorder them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="mx-auto flex w-full max-w-2xl flex-col">
            <li>
              <StepNode
                step={trigger}
                index={0}
                onEdit={() => openFor("edit", trigger.id)}
              />
            </li>
            <DndContext
              id="automation-steps"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={actions.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {actions.map((step, i) => (
                  <SortableStepNode
                    key={step.id}
                    step={step}
                    index={i + 1}
                    onEdit={() => openFor("edit", step.id)}
                    onDelete={() => openFor("delete", step.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <li className="flex flex-col items-center">
              <Connector />
              <Button variant="outline" onClick={() => setDialog("add")}>
                <PlusIcon data-icon="inline-start" />
                Add Step
              </Button>
            </li>
          </ol>
        </CardContent>
      </Card>

      <AddStepDialog
        open={dialog === "add"}
        onOpenChange={closeDialog}
        onAdd={addStep}
      />

      <EditStepDialog
        step={selected}
        open={dialog === "edit"}
        onOpenChange={closeDialog}
        onSave={saveStep}
      />

      <AlertDialog open={dialog === "delete"} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {selected?.name ?? "this step"}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteStep}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
