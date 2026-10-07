import { Pie, PieChart } from "recharts"

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

const chartConfig = {
  share: { label: "Share (%)" },
  website: { label: "Website", color: "var(--chart-1)" },
  whatsapp: { label: "WhatsApp", color: "var(--chart-2)" },
  social: { label: "Social Media", color: "var(--chart-3)" },
  referral: { label: "Referral", color: "var(--chart-4)" },
} satisfies ChartConfig

const SOURCE_DATA = [
  { source: "website", share: 45, fill: "var(--color-website)" },
  { source: "whatsapp", share: 30, fill: "var(--color-whatsapp)" },
  { source: "social", share: 15, fill: "var(--color-social)" },
  { source: "referral", share: 10, fill: "var(--color-referral)" },
] as const

export function LeadSourcesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Sources</CardTitle>
        <CardDescription>Where this month's leads came from</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="source" hideLabel />}
            />
            <Pie
              data={[...SOURCE_DATA]}
              dataKey="share"
              nameKey="source"
              innerRadius="55%"
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
          {SOURCE_DATA.map((item) => {
            const config = chartConfig[item.source]
            return (
              <li key={item.source} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: config.color }}
                />
                <span className="truncate text-muted-foreground">
                  {config.label}
                </span>
                <span className="ml-auto font-medium tabular-nums">
                  {item.share}%
                </span>
              </li>
            )
          })}
        </ul>
      </CardFooter>
    </Card>
  )
}
