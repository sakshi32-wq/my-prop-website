import {
  CircleCheckIcon,
  MessageSquareIcon,
  SendIcon,
  TrendingUpIcon,
} from "lucide-react"

import { formatPct } from "./campaign-data"
import type { Campaign } from "./campaign-data"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CampaignStats({ campaigns }: { campaigns: Campaign[] }) {
  const totals = campaigns.reduce(
    (acc, c) => ({
      sent: acc.sent + c.sent,
      delivered: acc.delivered + c.delivered,
      replied: acc.replied + c.replied,
      leads: acc.leads + c.leads,
    }),
    { sent: 0, delivered: 0, replied: 0, leads: 0 }
  )

  const stats = [
    {
      label: "Total Sent",
      value: totals.sent.toLocaleString(),
      hint: `Across ${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"}`,
      icon: SendIcon,
    },
    {
      label: "Delivery Rate",
      value: formatPct(totals.delivered, totals.sent),
      hint: `${totals.delivered.toLocaleString()} delivered`,
      icon: CircleCheckIcon,
    },
    {
      label: "Reply Rate",
      value: formatPct(totals.replied, totals.delivered),
      hint: `${totals.replied.toLocaleString()} replies`,
      icon: MessageSquareIcon,
    },
    {
      label: "Leads Generated",
      value: totals.leads.toLocaleString(),
      hint: `${formatPct(totals.leads, totals.replied)} of replies`,
      icon: TrendingUpIcon,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {stat.value}
            </CardTitle>
            <CardAction>
              <stat.icon className="size-5 text-muted-foreground" />
            </CardAction>
            <CardDescription className="text-xs">{stat.hint}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
