import { UserPlusIcon } from "lucide-react"
import { toast } from "sonner"

import { createLeadId } from "./data"
import { LeadForm } from "./lead-form"
import type { Lead } from "./data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type { Lead } from "./data"

export function AddLeadDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: (lead: Lead) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Capture lead information and add them to your CRM pipeline
          </DialogDescription>
        </DialogHeader>
        <LeadForm
          showAiTip
          submitLabel="Add Lead"
          submitIcon={<UserPlusIcon data-icon="inline-start" />}
          onSubmit={(values) => {
            const lead: Lead = {
              ...values,
              id: createLeadId(),
              addedAt: new Date(),
            }
            onAdd?.(lead)
            toast.success("Lead added", {
              description: `${lead.name} was added to your pipeline.`,
            })
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
