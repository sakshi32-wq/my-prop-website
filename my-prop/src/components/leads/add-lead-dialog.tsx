import { UserPlusIcon } from "lucide-react"
import { toast } from "sonner"

import { LeadForm } from "./lead-form"
import { useCreateLead } from "@/api/generated/leads/leads"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/** Used on the Leads page and the dashboard, so it owns its mutation. */
export function AddLeadDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const createLead = useCreateLead({
    mutation: {
      onSuccess: (lead) => {
        toast.success("Lead added", {
          description: `${lead.name} was added to your pipeline.`,
        })
        onOpenChange(false)
      },
    },
  })

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
          pending={createLead.isPending}
          onSubmit={(values) => createLead.mutate({ data: values })}
        />
      </DialogContent>
    </Dialog>
  )
}
