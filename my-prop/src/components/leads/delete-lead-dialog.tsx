import type { Lead } from "./data"
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
  onConfirm: (lead: Lead) => void
}) {
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
              if (lead) onConfirm(lead)
            }}
          >
            Delete Lead
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
