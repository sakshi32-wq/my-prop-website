import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { AutomationBuilder } from "./automation/automation-builder"
import { statusFor, toDraft } from "./campaign-data"
import type { Campaign } from "./campaign-data"
import type { CampaignAction } from "./campaign-item"
import { CampaignList, CampaignListSkeleton } from "./campaign-list"
import { CampaignStats, CampaignStatsSkeleton } from "./campaign-stats"
import { CreateCampaignWizard } from "./create-campaign-wizard"
import { EditCampaignDialog } from "./edit-campaign-dialog"
import {
  optimisticCampaignDelete,
  optimisticCampaignUpdate,
} from "./optimistic"
import { ViewCampaignDialog } from "./view-campaign-dialog"
import {
  useDeleteCampaign,
  useListCampaigns,
  useUpdateCampaign,
} from "@/api/generated/campaigns/campaigns"
import { PageHeader } from "@/components/page-header"
import { QueryError } from "@/components/query-error"
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
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type OpenDialog = "view" | "edit" | "delete" | null

export function CampaignsPage() {
  const queryClient = useQueryClient()
  const campaignsQuery = useListCampaigns()
  const campaigns = campaignsQuery.data ?? []
  const [view, setView] = useState("list")
  const [wizardOpen, setWizardOpen] = useState(false)
  const [dialog, setDialog] = useState<OpenDialog>(null)
  // The id is kept after closing so dialogs can animate out with content.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = campaigns.find((c) => c.id === selectedId)

  const toggleStatus = useUpdateCampaign({
    mutation: {
      ...optimisticCampaignUpdate(queryClient),
      onSuccess: (campaign) =>
        toast.success(
          campaign.status === "paused"
            ? `"${campaign.name}" paused`
            : `"${campaign.name}" resumed`
        ),
    },
  })
  const deleteCampaign = useDeleteCampaign({
    mutation: {
      ...optimisticCampaignDelete(queryClient),
      onSuccess: (_data, _variables, context) =>
        toast.success(`"${context.removed?.name ?? "Campaign"}" deleted`),
    },
  })

  function open(kind: Exclude<OpenDialog, null>, campaign: Campaign) {
    setSelectedId(campaign.id)
    setDialog(kind)
  }

  function closeDialog(isOpen: boolean) {
    if (!isOpen) setDialog(null)
  }

  function handleAction(action: CampaignAction, campaign: Campaign) {
    if (action === "toggle") {
      const status =
        campaign.status === "paused" ? statusFor(toDraft(campaign)) : "paused"
      toggleStatus.mutate({ campaignId: campaign.id, data: { status } })
    } else open(action, campaign)
  }

  function handleDelete() {
    if (!selected) return
    deleteCampaign.mutate({ campaignId: selected.id })
    setDialog(null)
  }

  return (
    <Tabs value={view} onValueChange={setView} className="gap-6">
      <PageHeader
        title="Campaigns & Automation"
        description="Create and manage marketing campaigns"
        actions={
          <>
            <TabsList>
              <TabsTrigger value="list">Campaign List</TabsTrigger>
              <TabsTrigger value="automation">Automation Builder</TabsTrigger>
            </TabsList>
            <Button onClick={() => setWizardOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Create Campaign
            </Button>
          </>
        }
      />

      <TabsContent value="list" className="flex flex-col gap-6">
        {campaignsQuery.isPending ? (
          <>
            <CampaignStatsSkeleton />
            <CampaignListSkeleton />
          </>
        ) : campaignsQuery.isError ? (
          <QueryError
            title="Couldn't load campaigns"
            error={campaignsQuery.error}
            onRetry={() => void campaignsQuery.refetch()}
          />
        ) : (
          <>
            <CampaignStats campaigns={campaigns} />
            <CampaignList
              campaigns={campaigns}
              onAction={handleAction}
              onCreate={() => setWizardOpen(true)}
            />
          </>
        )}
      </TabsContent>

      {/* Kept mounted so the automation in progress survives tab switches. */}
      <TabsContent
        value="automation"
        forceMount
        className="data-[state=inactive]:hidden"
      >
        <AutomationBuilder />
      </TabsContent>

      <CreateCampaignWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onLaunched={() => setView("list")}
      />

      <ViewCampaignDialog
        campaign={selected}
        open={dialog === "view"}
        onOpenChange={closeDialog}
        onEdit={(campaign) => open("edit", campaign)}
      />

      <EditCampaignDialog
        campaign={selected}
        open={dialog === "edit"}
        onOpenChange={closeDialog}
      />

      <AlertDialog open={dialog === "delete"} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {selected?.name}
              </span>{" "}
              and its performance data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  )
}
