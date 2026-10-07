import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { AutomationBuilder } from "./automation/automation-builder"
import {
  createMockCampaigns,
  describeSchedule,
  statusFor,
} from "./campaign-data"
import type { Campaign } from "./campaign-data"
import type { CampaignAction } from "./campaign-item"
import { CampaignList } from "./campaign-list"
import { CampaignStats } from "./campaign-stats"
import { CreateCampaignWizard } from "./create-campaign-wizard"
import { EditCampaignDialog } from "./edit-campaign-dialog"
import { ViewCampaignDialog } from "./view-campaign-dialog"
import { PageHeader } from "@/components/page-header"
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
  const [campaigns, setCampaigns] = useState<Campaign[]>(createMockCampaigns)
  const [view, setView] = useState("list")
  const [wizardOpen, setWizardOpen] = useState(false)
  const [dialog, setDialog] = useState<OpenDialog>(null)
  // The id is kept after closing so dialogs can animate out with content.
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = campaigns.find((c) => c.id === selectedId)

  function open(kind: Exclude<OpenDialog, null>, campaign: Campaign) {
    setSelectedId(campaign.id)
    setDialog(kind)
  }

  function closeDialog(isOpen: boolean) {
    if (!isOpen) setDialog(null)
  }

  function toggleStatus(campaign: Campaign) {
    const status = campaign.status === "paused" ? statusFor(campaign) : "paused"
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status } : c))
    )
    toast.success(
      status === "paused"
        ? `"${campaign.name}" paused`
        : `"${campaign.name}" resumed`
    )
  }

  function handleAction(action: CampaignAction, campaign: Campaign) {
    if (action === "toggle") toggleStatus(campaign)
    else open(action, campaign)
  }

  function handleLaunch(campaign: Campaign) {
    setCampaigns((prev) => [campaign, ...prev])
    setView("list")
    toast.success(
      campaign.status === "scheduled"
        ? `"${campaign.name}" scheduled`
        : `"${campaign.name}" launched`,
      { description: describeSchedule(campaign) }
    )
  }

  function handleSave(updated: Campaign) {
    setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    toast.success("Campaign updated successfully")
  }

  function handleDelete() {
    if (!selected) return
    setCampaigns((prev) => prev.filter((c) => c.id !== selected.id))
    setDialog(null)
    toast.success(`"${selected.name}" deleted`)
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
        <CampaignStats campaigns={campaigns} />
        <CampaignList
          campaigns={campaigns}
          onAction={handleAction}
          onCreate={() => setWizardOpen(true)}
        />
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
        onLaunch={handleLaunch}
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
        onSave={handleSave}
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
