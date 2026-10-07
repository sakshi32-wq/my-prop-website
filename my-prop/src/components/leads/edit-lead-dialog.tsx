import { SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { LeadForm } from "./lead-form"
import type { Lead } from "./data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function EditLeadDialog({
  open,
  onOpenChange,
  lead,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
  onSave: (lead: Lead) => void
}) {
  return (
    <Dialog open={open && !!lead} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update lead information and details
          </DialogDescription>
        </DialogHeader>
        {lead && (
          <LeadForm
            key={lead.id}
            initialValues={lead}
            submitLabel="Save Changes"
            submitIcon={<SaveIcon data-icon="inline-start" />}
            onSubmit={(values) => {
              onSave({ ...lead, ...values })
              toast.success("Lead updated", {
                description: `${values.name}'s details were saved.`,
              })
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
