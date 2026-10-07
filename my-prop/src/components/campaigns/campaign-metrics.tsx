import { CircleDotIcon, ClockIcon, PauseIcon } from "lucide-react"

import { formatPct, pct } from "./campaign-data"
import type { Campaign, CampaignStatus } from "./campaign-data"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const STATUS_BADGE = {
  active: { label: "Active", variant: "default", icon: CircleDotIcon },
  paused: { label: "Paused", variant: "secondary", icon: PauseIcon },
  scheduled: { label: "Scheduled", variant: "outline", icon: ClockIcon },
} as const

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const meta = STATUS_BADGE[status]
  return (
    <Badge variant={meta.variant}>
      <meta.icon data-icon="inline-start" />
      {meta.label}
    </Badge>
  )
}

export function CampaignMetrics({ campaign }: { campaign: Campaign }) {
  const metrics = [
    { label: "Sent", value: campaign.sent, rate: undefined },
    {
      label: "Delivered",
      value: campaign.delivered,
      rate:
        campaign.sent > 0 ? formatPct(campaign.delivered, campaign.sent) : "—",
    },
    {
      label: "Read",
      value: campaign.read,
      rate:
        campaign.delivered > 0
          ? formatPct(campaign.read, campaign.delivered)
          : "—",
    },
    {
      label: "Replied",
      value: campaign.replied,
      rate:
        campaign.read > 0 ? formatPct(campaign.replied, campaign.read) : "—",
    },
    {
      label: "Leads",
      value: campaign.leads,
      rate:
        campaign.replied > 0
          ? `${formatPct(campaign.leads, campaign.replied)} CVR`
          : "—",
    },
  ]

  return (
    <dl className="grid w-full grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-5">
      {metrics.map((m) => (
        <div key={m.label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">{m.label}</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {m.value.toLocaleString()}
          </dd>
          {m.rate && (
            <dd className="text-xs text-muted-foreground tabular-nums">
              {m.rate}
            </dd>
          )}
        </div>
      ))}
    </dl>
  )
}

export function CampaignProgress({ campaign }: { campaign: Campaign }) {
  const value = pct(campaign.delivered, campaign.sent)
  return (
    <div className="flex w-full items-center gap-3">
      <span className="shrink-0 text-xs text-muted-foreground">
        Campaign Progress
      </span>
      <Progress value={value} aria-label="Delivered of sent" />
      <span className="shrink-0 text-xs font-medium tabular-nums">
        {campaign.sent > 0 ? `${value.toFixed(0)}%` : "Not started"}
      </span>
    </div>
  )
}
