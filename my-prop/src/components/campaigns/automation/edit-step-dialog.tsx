import { useState } from "react"

import { STEP_TYPES } from "./automation-data"
import type { AutomationStep, StepConfig } from "./automation-data"
import { StepConfigFields } from "./step-config-fields"
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

export type StepErrors = Partial<Record<"name" | keyof StepConfig, string>>

function validate(step: AutomationStep): StepErrors {
  const errors: StepErrors = {}
  const c = step.config
  if (step.type !== "trigger" && !step.name.trim())
    errors.name = "Step name is required."
  if (step.type === "wait" && !(Number(c.delay) >= 1))
    errors.delay = "Enter a delay of at least 1."
  if (step.type === "tag" && !c.tagName?.trim())
    errors.tagName = "Enter a tag name."
  if (step.type === "score" && !Number.isInteger(c.scoreValue))
    errors.scoreValue = "Enter a whole number, e.g. 10 or -5."
  if (step.type === "webhook") {
    try {
      const url = new URL(c.webhookUrl ?? "")
      if (!/^https?:$/.test(url.protocol)) throw new Error()
    } catch {
      errors.webhookUrl = "Enter a valid http(s) URL."
    }
  }
  return errors
}

export function EditStepDialog({
  step,
  open,
  onOpenChange,
  onSave,
}: {
  step: AutomationStep | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (step: AutomationStep) => void
}) {
  const meta = step ? STEP_TYPES[step.type] : undefined

  return (
    <Dialog open={open && !!step} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {meta?.name ?? "Step"}</DialogTitle>
          <DialogDescription>Configure the step settings</DialogDescription>
        </DialogHeader>
        {step && <EditStepForm key={step.id} step={step} onSave={onSave} />}
      </DialogContent>
    </Dialog>
  )
}

function EditStepForm({
  step,
  onSave,
}: {
  step: AutomationStep
  onSave: (step: AutomationStep) => void
}) {
  const [draft, setDraft] = useState<AutomationStep>(() => ({
    ...step,
    config: { ...step.config },
  }))
  const [showErrors, setShowErrors] = useState(false)
  const errors = showErrors ? validate(draft) : {}

  function save() {
    if (Object.keys(validate(draft)).length > 0) {
      setShowErrors(true)
      return
    }
    onSave({ ...draft, name: draft.name.trim() || STEP_TYPES[draft.type].name })
  }

  return (
    <form
      noValidate
      className="contents"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <div className="-mx-4 min-h-0 flex-1 overflow-y-auto px-4 py-1">
        <StepConfigFields step={draft} onChange={setDraft} errors={errors} />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  )
}
