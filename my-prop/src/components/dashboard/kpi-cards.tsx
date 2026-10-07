import {
  PercentIcon,
  SendIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { formatChange } from "./data"
import type { DashboardOverview } from "./data"
import { useGetDashboardOverview } from "@/api/generated/analytics/analytics"
import { QueryError } from "@/components/query-error"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Kpi = {
  label: string
  value: string
  icon: LucideIcon
  trend?: { direction: "up" | "down"; value: string }
  badge?: string
  summary: string
  detail: string
}

function trendFor(changePct: number): Kpi["trend"] {
  return {
    direction: changePct < 0 ? "down" : "up",
    value: formatChange(changePct),
  }
}

function describeChange(changePct: number, period: string) {
  return `${changePct < 0 ? "Down" : "Up"} ${Math.abs(changePct).toFixed(1)}% ${period}`
}

function toKpis(overview: DashboardOverview): Array<Kpi> {
  const { totalLeads, todaysLeads, activeCampaigns, conversionRate } = overview
  return [
    {
      label: "Total Leads",
      value: totalLeads.value.toLocaleString(),
      icon: UsersIcon,
      trend: trendFor(totalLeads.changePct),
      summary: describeChange(totalLeads.changePct, "this month"),
      detail: "Compared to last month",
    },
    {
      label: "Today's Leads",
      value: todaysLeads.value.toLocaleString(),
      icon: UsersIcon,
      trend: trendFor(todaysLeads.changePct),
      summary: describeChange(todaysLeads.changePct, "from yesterday"),
      detail: "Across all websites",
    },
    {
      label: "Active Campaigns",
      value: activeCampaigns.value.toLocaleString(),
      icon: SendIcon,
      badge: `${activeCampaigns.launchingToday} today`,
      summary: `${activeCampaigns.launchingToday} launching today`,
      detail: "WhatsApp, email and SMS",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate.value.toFixed(1)}%`,
      icon: PercentIcon,
      trend: trendFor(conversionRate.changePct),
      summary: describeChange(conversionRate.changePct, "this month"),
      detail: "Compared to last month",
    },
  ]
}

export function KpiCards() {
  const overviewQuery = useGetDashboardOverview()

  if (overviewQuery.isError)
    return (
      <QueryError
        title="Couldn't load your dashboard numbers"
        error={overviewQuery.error}
        onRetry={() => void overviewQuery.refetch()}
      />
    )

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {overviewQuery.isPending &&
        Array.from({ length: 4 }, (_, i) => (
          <Skeleton
            key={i}
            className="h-40 rounded-xl"
            aria-label={i === 0 ? "Loading dashboard numbers" : undefined}
          />
        ))}
      {overviewQuery.data &&
        toKpis(overviewQuery.data).map((kpi) => {
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
                        kpi.trend.direction === "down"
                          ? "destructive"
                          : "outline"
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
