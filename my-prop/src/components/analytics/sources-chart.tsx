import { Label, Pie, PieChart } from "recharts"

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
  leads: { label: "Leads" },
  website: { label: "Website", color: "var(--chart-1)" },
  whatsapp: { label: "WhatsApp", color: "var(--chart-2)" },
  social: { label: "Social Media", color: "var(--chart-3)" },
  referral: { label: "Referral", color: "var(--chart-4)" },
} satisfies ChartConfig

export function SourcesChart({ data }: { data: AnalyticsData }) {
  const total = data.sources.reduce((sum, source) => sum + source.leads, 0)

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Lead Sources</CardTitle>
        <CardDescription>Where your leads come from</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-72 w-full max-w-xs"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="key" hideLabel />}
            />
            <Pie
              data={data.sources}
              dataKey="leads"
              nameKey="key"
              innerRadius="55%"
              outerRadius="80%"
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                    return null
                  }
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-semibold"
                      >
                        {total.toLocaleString("en-IN")}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 22}
                        className="fill-muted-foreground"
                      >
                        Leads
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
            <ChartLegend
              content={
                <ChartLegendContent nameKey="key" className="flex-wrap" />
              }
            />
          </PieChart>
        </ChartContainer>
        <dl className="flex flex-col gap-2 text-sm">
          {data.sources.map((source) => (
            <div key={source.key} className="flex items-center justify-between">
              <dt className="text-muted-foreground">{source.name}</dt>
              <dd className="font-medium tabular-nums">
                {source.share.toFixed(0)}%{" "}
                <span className="font-normal text-muted-foreground">
                  ({source.leads.toLocaleString("en-IN")})
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
