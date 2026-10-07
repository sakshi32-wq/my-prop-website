import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { optimisticLeadDelete } from "./optimistic"
import type { Lead } from "./data"
import { useDeleteLead } from "@/api/generated/leads/leads"
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

export function DeleteLeadDialog({
  open,
  onOpenChange,
  lead,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
  /** Called when the user confirms, before the request finishes. */
  onConfirm?: (lead: Lead) => void
}) {
  const queryClient = useQueryClient()
  const deleteLead = useDeleteLead({
    mutation: {
      ...optimisticLeadDelete(queryClient),
      onSuccess: (_data, _variables, context) =>
        toast.success("Lead deleted", { description: context.lead?.name }),
    },
  })

  return (
    <AlertDialog open={open && !!lead} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
          <AlertDialogDescription>
            {lead?.name ?? "This lead"} and all of their activity will be
            removed from your pipeline. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (!lead) return
              deleteLead.mutate({ leadId: lead.id })
              onConfirm?.(lead)
            }}
          >
            Delete Lead
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
