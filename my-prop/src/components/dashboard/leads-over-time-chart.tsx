import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, parseISO } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetDashboardOverview } from "@/api/generated/analytics/analytics"
import { QueryError } from "@/components/query-error"
import { cn } from "@/lib/utils"

const chartConfig = {
  leads: { label: "Leads", color: "var(--chart-2)" },
} satisfies ChartConfig

export function LeadsOverTimeChart({ className }: { className?: string }) {
  const overviewQuery = useGetDashboardOverview()
  const days = (overviewQuery.data?.leadsLast7Days ?? []).map((point) => ({
    day: format(parseISO(point.date), "EEE"),
    leads: point.leads,
  }))
  const total = days.reduce((sum, item) => sum + item.leads, 0)

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Leads Over Time</CardTitle>
        <CardDescription>
          New leads captured over the last 7 days
        </CardDescription>
        <CardAction>
          {overviewQuery.isSuccess && (
            <Badge variant="outline">{total} this week</Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        {overviewQuery.isPending ? (
          <Skeleton className="h-72 w-full" />
        ) : overviewQuery.isError ? (
          <QueryError
            title="Couldn't load leads over time"
            error={overviewQuery.error}
            onRetry={() => void overviewQuery.refetch()}
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-72 w-full"
          >
            <AreaChart data={days} margin={{ left: -20, right: 12 }}>
              <defs>
                <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-leads)"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-leads)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="leads"
                type="monotone"
                fill="url(#fillLeads)"
                stroke="var(--color-leads)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
