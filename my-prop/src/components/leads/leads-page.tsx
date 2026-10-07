import { useMemo, useState } from "react"
import { keepPreviousData, useQueryClient } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { AddLeadDialog } from "./add-lead-dialog"
import { AddTagsDialog } from "./add-tags-dialog"
import { CallLeadDialog } from "./call-lead-dialog"
import { stageLabel } from "./data"
import { DeleteLeadDialog } from "./delete-lead-dialog"
import { EditLeadDialog } from "./edit-lead-dialog"
import { EMPTY_FILTERS, countActiveFilters, toListLeadsParams } from "./filters"
import { KanbanBoard, KanbanSkeleton } from "./kanban-board"
import { LeadDetailSheet } from "./lead-detail-sheet"
import { LeadFiltersSheet } from "./lead-filters-sheet"
import { LeadsToolbar } from "./leads-toolbar"
import { optimisticLeadUpdate } from "./optimistic"
import { ScheduleVisitDialog } from "./schedule-visit-dialog"
import { SendWhatsAppDialog, aiSuggestedReply } from "./send-whatsapp-dialog"
import type { Lead, LeadStage } from "./data"
import type { LeadFilters } from "./filters"
import type { LeadAction } from "./lead-card"
import type { DetailAction } from "./lead-detail-sheet"
import {
  useCreateLead,
  useListLeads,
  useUpdateLead,
} from "@/api/generated/leads/leads"
import { PageHeader } from "@/components/page-header"
import { QueryError } from "@/components/query-error"
import { Button } from "@/components/ui/button"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { QUICK_TAGS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type LeadDialog = "edit" | "call" | "whatsapp" | "schedule" | "tags" | "delete"

export function LeadsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<LeadFilters>(EMPTY_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const [detailId, setDetailId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Keep the lead id after a dialog closes so its exit animation still has data.
  const [dialog, setDialog] = useState<LeadDialog | null>(null)
  const [dialogLeadId, setDialogLeadId] = useState<string | null>(null)
  const [whatsAppMessage, setWhatsAppMessage] = useState("")

  // Filtering happens on the server. Without filters both queries share a key.
  const params = toListLeadsParams(filters, useDebouncedValue(search))
  const leadsQuery = useListLeads(params, {
    query: { placeholderData: keepPreviousData },
  })
  const allLeadsQuery = useListLeads()
  const leads = leadsQuery.data ?? []
  const allLeads = allLeadsQuery.data ?? []

  const findLead = (id: string | null) =>
    id
      ? (allLeads.find((l) => l.id === id) ??
        leads.find((l) => l.id === id) ??
        null)
      : null
  const detailLead = findLead(detailId)
  const dialogLead = findLead(dialogLeadId)

  const activeFilterCount = countActiveFilters(filters)
  const tagOptions = useMemo(
    () => [
      ...new Set<string>([...QUICK_TAGS, ...allLeads.flatMap((l) => l.tags)]),
    ],
    [allLeads]
  )

  // Separate mutations per action, so each keeps its own success toast.
  const moveLead = useUpdateLead({
    mutation: {
      ...optimisticLeadUpdate(queryClient),
      onSuccess: (lead) =>
        toast.success(`Moved ${lead.name} to ${stageLabel(lead.stage)}`),
    },
  })
  const markWon = useUpdateLead({
    mutation: {
      ...optimisticLeadUpdate(queryClient),
      onSuccess: (lead) =>
        toast.success(`${lead.name} marked as won`, {
          description: "The lead was moved to Closed.",
        }),
    },
  })
  const duplicateLead = useCreateLead({
    mutation: {
      onSuccess: (lead) =>
        toast.success("Lead duplicated", { description: lead.name }),
    },
  })

  const openDialog = (type: LeadDialog, lead: Lead, message = "") => {
    setDialogLeadId(lead.id)
    setWhatsAppMessage(message)
    setDialog(type)
  }
  const dialogProps = (type: LeadDialog) => ({
    open: dialog === type,
    onOpenChange: (open: boolean) => {
      if (!open) setDialog(null)
    },
    lead: dialogLead,
  })

  const handleMove = (lead: Lead, stage: LeadStage) => {
    if (lead.stage === stage) return
    moveLead.mutate({ leadId: lead.id, data: { stage } })
  }

  const handleCardAction = (action: LeadAction, lead: Lead) => {
    switch (action) {
      case "open":
        setDetailId(lead.id)
        setDetailOpen(true)
        break
      case "duplicate": {
        const { id: _id, addedAt: _addedAt, ...fields } = lead
        duplicateLead.mutate({
          data: { ...fields, name: `${lead.name} (Copy)` },
        })
        break
      }
      case "won":
        markWon.mutate({ leadId: lead.id, data: { stage: "closed" } })
        break
      case "whatsapp":
        openDialog("whatsapp", lead)
        break
      default:
        openDialog(action, lead)
    }
  }

  const handleDetailAction = (action: DetailAction, lead: Lead) => {
    if (action === "whatsapp")
      openDialog("whatsapp", lead, aiSuggestedReply(lead))
    else openDialog(action, lead)
  }

  return (
    <>
      <PageHeader
        title="Lead Management"
        description="Track and manage your property leads"
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            Add Lead
          </Button>
        }
      />

      <LeadsToolbar
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
        activeCount={activeFilterCount}
        onOpenFilters={() => setFiltersOpen(true)}
        shown={leads.length}
        total={allLeads.length}
      />

      {leadsQuery.isPending ? (
        <KanbanSkeleton />
      ) : leadsQuery.isError && !leadsQuery.data ? (
        <QueryError
          title="Couldn't load leads"
          error={leadsQuery.error}
          onRetry={() => void leadsQuery.refetch()}
        />
      ) : (
        <div
          aria-busy={leadsQuery.isPlaceholderData}
          className={cn(
            "transition-opacity",
            leadsQuery.isPlaceholderData && "opacity-60"
          )}
        >
          <KanbanBoard
            leads={leads}
            onAction={handleCardAction}
            onMove={handleMove}
          />
        </div>
      )}

      <LeadDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        lead={detailLead}
        onAction={handleDetailAction}
      />

      <LeadFiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onFiltersChange={setFilters}
        tagOptions={tagOptions}
      />

      <AddLeadDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditLeadDialog {...dialogProps("edit")} />
      <CallLeadDialog {...dialogProps("call")} />
      <SendWhatsAppDialog
        {...dialogProps("whatsapp")}
        initialMessage={whatsAppMessage}
      />
      <ScheduleVisitDialog {...dialogProps("schedule")} />
      <AddTagsDialog {...dialogProps("tags")} />
      <DeleteLeadDialog
        {...dialogProps("delete")}
        onConfirm={(lead) => {
          if (detailId === lead.id) setDetailOpen(false)
        }}
      />
    </>
  )
}
