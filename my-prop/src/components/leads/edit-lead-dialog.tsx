import { useQueryClient } from "@tanstack/react-query"
import { SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { LeadForm } from "./lead-form"
import { optimisticLeadUpdate } from "./optimistic"
import type { Lead } from "./data"
import { useUpdateLead } from "@/api/generated/leads/leads"
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
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
}) {
  const queryClient = useQueryClient()
  const updateLead = useUpdateLead({
    mutation: {
      ...optimisticLeadUpdate(queryClient),
      onSuccess: (updated) =>
        toast.success("Lead updated", {
          description: `${updated.name}'s details were saved.`,
        }),
    },
  })

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
              updateLead.mutate({ leadId: lead.id, data: values })
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
