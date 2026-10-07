import { useMemo, useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { AddLeadDialog } from "./add-lead-dialog"
import { AddTagsDialog } from "./add-tags-dialog"
import { CallLeadDialog } from "./call-lead-dialog"
import { INITIAL_LEADS, createLeadId, stageLabel } from "./data"
import { DeleteLeadDialog } from "./delete-lead-dialog"
import { EditLeadDialog } from "./edit-lead-dialog"
import { EMPTY_FILTERS, applyFilters, countActiveFilters } from "./filters"
import { KanbanBoard } from "./kanban-board"
import { LeadDetailSheet } from "./lead-detail-sheet"
import { LeadFiltersSheet } from "./lead-filters-sheet"
import { LeadsToolbar } from "./leads-toolbar"
import { ScheduleVisitDialog } from "./schedule-visit-dialog"
import { SendWhatsAppDialog, aiSuggestedReply } from "./send-whatsapp-dialog"
import type { Lead } from "./data"
import type { LeadFilters } from "./filters"
import type { LeadAction } from "./lead-card"
import type { DetailAction } from "./lead-detail-sheet"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { QUICK_TAGS } from "@/lib/mock-data"
import type { LeadStage } from "@/lib/mock-data"

type LeadDialog = "edit" | "call" | "whatsapp" | "schedule" | "tags" | "delete"

const EARLY_STAGES: Array<LeadStage> = ["new", "contacted", "interested"]

export function LeadsPage() {
  const [leads, setLeads] = useState<Array<Lead>>(INITIAL_LEADS)
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

  const findLead = (id: string | null) =>
    id ? (leads.find((l) => l.id === id) ?? null) : null
  const detailLead = findLead(detailId)
  const dialogLead = findLead(dialogLeadId)

  const filteredLeads = useMemo(
    () => applyFilters(leads, filters, search),
    [leads, filters, search]
  )
  const activeFilterCount = countActiveFilters(filters)
  const tagOptions = useMemo(
    () => [
      ...new Set<string>([...QUICK_TAGS, ...leads.flatMap((l) => l.tags)]),
    ],
    [leads]
  )

  const updateLead = (id: string, patch: Partial<Lead>) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))

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

  const moveLead = (lead: Lead, stage: LeadStage) => {
    if (lead.stage === stage) return
    updateLead(lead.id, { stage })
    toast.success(`Moved ${lead.name} to ${stageLabel(stage)}`)
  }

  const handleCardAction = (action: LeadAction, lead: Lead) => {
    switch (action) {
      case "open":
        setDetailId(lead.id)
        setDetailOpen(true)
        break
      case "duplicate": {
        const copy: Lead = {
          ...lead,
          id: createLeadId(),
          name: `${lead.name} (Copy)`,
          tags: [...lead.tags],
          addedAt: new Date(),
        }
        setLeads((prev) => {
          const index = prev.findIndex((l) => l.id === lead.id)
          return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]
        })
        toast.success("Lead duplicated", { description: copy.name })
        break
      }
      case "won":
        updateLead(lead.id, { stage: "closed" })
        toast.success(`${lead.name} marked as won`, {
          description: "The lead was moved to Closed.",
        })
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

  const deleteLead = (lead: Lead) => {
    setLeads((prev) => prev.filter((l) => l.id !== lead.id))
    if (detailId === lead.id) setDetailOpen(false)
    toast.success("Lead deleted", { description: lead.name })
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
        shown={filteredLeads.length}
        total={leads.length}
      />

      <KanbanBoard
        leads={filteredLeads}
        onAction={handleCardAction}
        onMove={moveLead}
      />

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

      <AddLeadDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={(lead) => setLeads((prev) => [lead, ...prev])}
      />
      <EditLeadDialog
        {...dialogProps("edit")}
        onSave={(lead) => updateLead(lead.id, lead)}
      />
      <CallLeadDialog {...dialogProps("call")} />
      <SendWhatsAppDialog
        {...dialogProps("whatsapp")}
        initialMessage={whatsAppMessage}
      />
      <ScheduleVisitDialog
        {...dialogProps("schedule")}
        onScheduled={(lead) => {
          if (EARLY_STAGES.includes(lead.stage))
            updateLead(lead.id, { stage: "scheduled" })
        }}
      />
      <AddTagsDialog
        {...dialogProps("tags")}
        onSaveTags={(id, tags) => updateLead(id, { tags })}
      />
      <DeleteLeadDialog {...dialogProps("delete")} onConfirm={deleteLead} />
    </>
  )
}
