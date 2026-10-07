import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { PencilIcon } from "lucide-react"
import { toast } from "sonner"

import { AudienceFields } from "./audience-fields"
import { BasicsFields } from "./basics-fields"
import {
  toCampaignInput,
  toDraft,
  validateAudience,
  validateBasics,
  validateMessage,
  validateSchedule,
} from "./campaign-data"
import type {
  Campaign,
  CampaignDraft,
  CampaignStatus,
  CampaignUpdate,
  DraftErrors,
} from "./campaign-data"
import { MessageFields } from "./message-fields"
import { optimisticCampaignUpdate } from "./optimistic"
import { ScheduleFields } from "./schedule-fields"
import { useUpdateCampaign } from "@/api/generated/campaigns/campaigns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TABS = [
  { value: "basic", label: "Basic Info", validate: validateBasics },
  { value: "audience", label: "Audience", validate: validateAudience },
  { value: "message", label: "Message", validate: validateMessage },
  { value: "schedule", label: "Schedule", validate: validateSchedule },
] as const

type TabValue = (typeof TABS)[number]["value"]

export function EditCampaignDialog({
  campaign,
  open,
  onOpenChange,
}: {
  campaign: Campaign | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const updateCampaign = useUpdateCampaign({
    mutation: {
      ...optimisticCampaignUpdate(queryClient),
      onSuccess: () => toast.success("Campaign updated successfully"),
    },
  })

  return (
    <Dialog open={open && !!campaign} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PencilIcon className="size-4 text-muted-foreground" />
            Edit Campaign
          </DialogTitle>
          <DialogDescription>
            Update campaign settings, audience, and content
          </DialogDescription>
        </DialogHeader>
        {campaign && (
          // Keyed so the form is re-initialised for every campaign opened.
          <EditForm
            key={campaign.id}
            campaign={campaign}
            onSave={(data) => {
              updateCampaign.mutate({ campaignId: campaign.id, data })
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function EditForm({
  campaign,
  onSave,
}: {
  campaign: Campaign
  onSave: (data: CampaignUpdate) => void
}) {
  const [draft, setDraft] = useState<CampaignDraft>(() => toDraft(campaign))
  const [status, setStatus] = useState<CampaignStatus>(campaign.status)
  const [tab, setTab] = useState<TabValue>("basic")
  const [showErrors, setShowErrors] = useState(false)

  const errors: DraftErrors = showErrors
    ? Object.assign({}, ...TABS.map((t) => t.validate(draft)))
    : {}

  function update(patch: Partial<CampaignDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }))
    // Keep the status in sync with the send type unless the user paused it.
    if (patch.scheduleType && status !== "paused") {
      setStatus(patch.scheduleType === "scheduled" ? "scheduled" : "active")
    }
  }

  function save() {
    const invalid = TABS.find((t) => Object.keys(t.validate(draft)).length > 0)
    if (invalid) {
      setShowErrors(true)
      setTab(invalid.value)
      toast.error(`Please fix the errors in ${invalid.label}`)
      return
    }
    onSave(toCampaignInput(draft, status))
  }

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="min-h-0 flex-1 gap-4"
      >
        <TabsList className="w-full">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="-mx-4 min-h-0 flex-1 overflow-y-auto px-4 py-1">
          <TabsContent value="basic">
            <BasicsFields
              draft={draft}
              onChange={update}
              errors={errors}
              status={status}
              onStatusChange={setStatus}
            />
          </TabsContent>
          <TabsContent value="audience">
            <AudienceFields draft={draft} onChange={update} errors={errors} />
          </TabsContent>
          <TabsContent value="message">
            <MessageFields draft={draft} onChange={update} errors={errors} />
          </TabsContent>
          <TabsContent value="schedule">
            <ScheduleFields draft={draft} onChange={update} errors={errors} />
          </TabsContent>
        </div>
      </Tabs>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={save}>Save Changes</Button>
      </DialogFooter>
    </>
  )
}
