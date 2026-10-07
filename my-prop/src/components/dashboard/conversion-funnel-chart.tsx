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

const FUNNEL_DATA = [
  { stage: "Visitors", count: 1250 },
  { stage: "Leads", count: 425 },
  { stage: "Qualified", count: 185 },
  { stage: "Meetings", count: 98 },
  { stage: "Closed", count: 42 },
]

const chartConfig = {
  count: { label: "Count", color: "var(--chart-2)" },
} satisfies ChartConfig

const overallRate = (
  (FUNNEL_DATA[FUNNEL_DATA.length - 1].count / FUNNEL_DATA[0].count) *
  100
).toFixed(1)

export function ConversionFunnelChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>From first visit to closed deal</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
          <BarChart
            data={FUNNEL_DATA}
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
      </CardContent>
      <CardFooter className="text-muted-foreground">
        {overallRate}% of visitors become customers
      </CardFooter>
    </Card>
  )
}
