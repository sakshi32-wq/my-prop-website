import { ClockIcon, PencilIcon } from "lucide-react"

import { ChoiceIcon } from "./choice-icon"
import {
  AUDIENCE_SEGMENTS,
  OBJECTIVES,
  channelIcon,
  estimateReach,
  labelOf,
  scheduleLabel,
} from "./campaign-data"
import type { Campaign } from "./campaign-data"
import {
  CampaignMetrics,
  CampaignProgress,
  StatusBadge,
} from "./campaign-metrics"
import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"

export function ViewCampaignDialog({
  campaign,
  open,
  onOpenChange,
  onEdit,
}: {
  campaign: Campaign | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (campaign: Campaign) => void
}) {
  return (
    <Dialog open={open && !!campaign} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Campaign Details</DialogTitle>
          <DialogDescription>
            View detailed information about the selected campaign.
          </DialogDescription>
        </DialogHeader>
        {campaign && (
          <>
            <div className="-mx-4 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4">
              <div className="flex items-start gap-3">
                <ChoiceIcon
                  icon={channelIcon(campaign.type)}
                  className="size-10"
                />
                <div className="flex min-w-0 flex-col gap-1.5">
                  <h3 className="text-base font-medium break-words">
                    {campaign.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    <StatusBadge status={campaign.status} />
                    <span className="flex items-center gap-1">
                      <ClockIcon className="size-3.5" />
                      {scheduleLabel(campaign)}
                    </span>
                  </div>
                </div>
              </div>

              <CampaignMetrics campaign={campaign} />
              <CampaignProgress campaign={campaign} />
              <Separator />
              <CampaignDetails campaign={campaign} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => onEdit(campaign)}>
                <PencilIcon data-icon="inline-start" />
                Edit Campaign
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function CampaignDetails({ campaign }: { campaign: Campaign }) {
  const segments = AUDIENCE_SEGMENTS.filter((s) =>
    campaign.audience.includes(s.id)
  )

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Channel</dt>
          <dd className="font-medium">{campaign.type}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Objective</dt>
          <dd className="font-medium">
            {labelOf(OBJECTIVES, campaign.objective) ?? "Not set"}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Estimated Reach</dt>
          <dd className="font-medium tabular-nums">
            {estimateReach(campaign.audience).toLocaleString()} leads
          </dd>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-3">
          <dt className="text-xs text-muted-foreground">Audience</dt>
          <dd className="flex flex-wrap gap-1">
            {segments.length > 0
              ? segments.map((s) => (
                  <Badge key={s.id} variant="outline">
                    {s.name}
                  </Badge>
                ))
              : "No segments selected"}
          </dd>
        </div>
      </dl>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Message</span>
        {campaign.type === "Email" && campaign.subject && (
          <span className="font-medium">Subject: {campaign.subject}</span>
        )}
        <p className="rounded-lg bg-muted p-3 break-words whitespace-pre-wrap">
          {campaign.message || "No message content"}
        </p>
      </div>
    </div>
  )
}
