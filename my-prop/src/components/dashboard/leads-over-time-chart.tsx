import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { cn } from "@/lib/utils"

const LEADS_DATA = [
  { day: "Mon", leads: 45 },
  { day: "Tue", leads: 52 },
  { day: "Wed", leads: 48 },
  { day: "Thu", leads: 65 },
  { day: "Fri", leads: 58 },
  { day: "Sat", leads: 72 },
  { day: "Sun", leads: 55 },
]

const TOTAL = LEADS_DATA.reduce((sum, item) => sum + item.leads, 0)

const chartConfig = {
  leads: { label: "Leads", color: "var(--chart-2)" },
} satisfies ChartConfig

export function LeadsOverTimeChart({ className }: { className?: string }) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Leads Over Time</CardTitle>
        <CardDescription>
          New leads captured over the last 7 days
        </CardDescription>
        <CardAction>
          <Badge variant="outline">{TOTAL} this week</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <AreaChart data={LEADS_DATA} margin={{ left: -20, right: 12 }}>
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
      </CardContent>
    </Card>
  )
}
