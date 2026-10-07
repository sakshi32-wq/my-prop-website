import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { formatInr } from "./data"
import type { AnalyticsData } from "./data"
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
  trend: number
  /** For cost metrics a decrease is the good direction. */
  lowerIsBetter?: boolean
  summary: string
}

export function KpiCards({ data }: { data: AnalyticsData }) {
  const { kpis } = data
  const items: Array<Kpi> = [
    {
      label: "Total Leads",
      value: kpis.totalLeads.toLocaleString("en-IN"),
      trend: kpis.trends.totalLeads,
      summary: "Lead volume is growing",
    },
    {
      label: "Conversion Rate",
      value: `${kpis.conversionRate.toFixed(2)}%`,
      trend: kpis.trends.conversionRate,
      summary: "More leads are closing",
    },
    {
      label: "Cost Per Lead",
      value: formatInr(kpis.costPerLead),
      trend: kpis.trends.costPerLead,
      lowerIsBetter: true,
      summary: "Acquisition is getting cheaper",
    },
    {
      label: "Website Visitors",
      value: kpis.visitors.toLocaleString("en-IN"),
      trend: kpis.trends.visitors,
      summary: "Traffic is up across sites",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const up = item.trend >= 0
        const TrendIcon = up ? TrendingUpIcon : TrendingDownIcon
        const good = item.lowerIsBetter ? !up : up
        return (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {item.value}
              </CardTitle>
              <CardAction>
                <Badge variant={good ? "outline" : "destructive"}>
                  <TrendIcon data-icon="inline-start" />
                  {up ? "+" : ""}
                  {item.trend.toFixed(1)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="flex items-center gap-2 font-medium">
                {item.summary}
                <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                vs previous {data.days} days
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
