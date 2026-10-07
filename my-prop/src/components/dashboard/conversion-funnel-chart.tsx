import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const chartConfig = {
  count: { label: "Count", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ConversionFunnelChart() {
  const overviewQuery = useGetDashboardOverview()
  const funnel = overviewQuery.data?.funnel ?? []
  const first = funnel.at(0)?.count ?? 0
  const overallRate = first
    ? (((funnel.at(-1)?.count ?? 0) / first) * 100).toFixed(1)
    : "0.0"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>From first visit to closed deal</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {overviewQuery.isPending ? (
          <Skeleton className="h-64 w-full" />
        ) : overviewQuery.isError ? (
          <QueryError
            title="Couldn't load the funnel"
            error={overviewQuery.error}
            onRetry={() => void overviewQuery.refetch()}
          />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-64 w-full"
          >
            <BarChart
              data={funnel}
              layout="vertical"
              margin={{ left: 0, right: 40 }}
            >
              <XAxis type="number" dataKey="count" hide />
              <YAxis
                dataKey="stage"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={72}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={6}>
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      {overviewQuery.isSuccess && (
        <CardFooter className="text-muted-foreground">
          {overallRate}% of visitors become customers
        </CardFooter>
      )}
    </Card>
  )
}
