import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { AnalyticsData } from "./data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  leads: { label: "Total Leads", color: "var(--chart-1)" },
  qualified: { label: "Qualified", color: "var(--chart-2)" },
  converted: { label: "Converted", color: "var(--chart-3)" },
} satisfies ChartConfig

const SERIES = ["leads", "qualified", "converted"] as const

export function LeadsChart({ data }: { data: AnalyticsData }) {
  return (
    <Card className="min-w-0 lg:col-span-2">
      <CardHeader>
        <CardTitle>Leads & Conversions Over Time</CardTitle>
        <CardDescription>
          Total, qualified and converted leads over the last {data.days} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full sm:h-80"
        >
          <AreaChart data={data.trend} margin={{ left: -16, right: 8 }}>
            <defs>
              {SERIES.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {SERIES.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone"
                fill={`url(#fill-${key})`}
                stroke={`var(--color-${key})`}
                strokeWidth={2}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
