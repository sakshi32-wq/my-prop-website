import {
  PercentIcon,
  SendIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Kpi = {
  label: string
  value: string
  icon: LucideIcon
  trend?: { direction: "up" | "down"; value: string }
  badge?: string
  summary: string
  detail: string
}

const KPIS: Array<Kpi> = [
  {
    label: "Total Leads",
    value: "2,847",
    icon: UsersIcon,
    trend: { direction: "up", value: "+12.5%" },
    summary: "Up 12.5% this month",
    detail: "Compared to last month",
  },
  {
    label: "Today's Leads",
    value: "48",
    icon: UsersIcon,
    trend: { direction: "up", value: "+8.2%" },
    summary: "Up 8.2% from yesterday",
    detail: "Across all websites",
  },
  {
    label: "Active Campaigns",
    value: "12",
    icon: SendIcon,
    badge: "3 today",
    summary: "3 launching today",
    detail: "WhatsApp, email and SMS",
  },
  {
    label: "Conversion Rate",
    value: "24.8%",
    icon: PercentIcon,
    trend: { direction: "down", value: "-2.1%" },
    summary: "Down 2.1% this month",
    detail: "Compared to last month",
  },
]

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((kpi) => {
        const TrendIcon =
          kpi.trend?.direction === "down" ? TrendingDownIcon : TrendingUpIcon
        return (
          <Card key={kpi.label} className="@container/card">
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <kpi.icon className="size-4" />
                {kpi.label}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {kpi.value}
              </CardTitle>
              <CardAction>
                {kpi.trend ? (
                  <Badge
                    variant={
                      kpi.trend.direction === "down" ? "destructive" : "outline"
                    }
                  >
                    <TrendIcon data-icon="inline-start" />
                    {kpi.trend.value}
                  </Badge>
                ) : (
                  <Badge variant="outline">{kpi.badge}</Badge>
                )}
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <div className="flex items-center gap-2 font-medium">
                {kpi.summary}
                {kpi.trend && <TrendIcon className="size-4" />}
              </div>
              <div className="text-muted-foreground">{kpi.detail}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
