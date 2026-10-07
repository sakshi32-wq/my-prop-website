import { useState } from "react"

import { ChoiceIcon } from "../choice-icon"
import { ADDABLE_STEP_TYPES, STEP_TYPES } from "./automation-data"
import type { StepType } from "./automation-data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function AddStepDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (type: StepType) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Automation Step</DialogTitle>
          <DialogDescription>
            Choose the type of step you want to add to your automation
          </DialogDescription>
        </DialogHeader>
        <AddStepForm onAdd={onAdd} />
      </DialogContent>
    </Dialog>
  )
}

function AddStepForm({ onAdd }: { onAdd: (type: StepType) => void }) {
  const [type, setType] = useState<StepType>("whatsapp")

  return (
    <>
      <div className="-mx-4 min-h-0 flex-1 overflow-y-auto px-4 py-1">
        <RadioGroup
          value={type}
          onValueChange={(v) => setType(v as StepType)}
          aria-label="Step type"
          className="grid gap-3 sm:grid-cols-2"
        >
          {ADDABLE_STEP_TYPES.map((value) => {
            const meta = STEP_TYPES[value]
            return (
              <FieldLabel key={value} htmlFor={`step-type-${value}`}>
                <Field orientation="horizontal">
                  <ChoiceIcon icon={meta.icon} />
                  <FieldContent>
                    <FieldTitle>{meta.name}</FieldTitle>
                    <FieldDescription>{meta.description}</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={value} id={`step-type-${value}`} />
                </Field>
              </FieldLabel>
            )
          })}
        </RadioGroup>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={() => onAdd(type)}>Add Step</Button>
      </DialogFooter>
    </>
  )
}
