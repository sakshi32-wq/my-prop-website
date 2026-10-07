import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { formatInr } from "./data"
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"

const chartConfig = {
  sent: { label: "Messages Sent", color: "var(--chart-1)" },
  converted: { label: "Conversions", color: "var(--chart-3)" },
} satisfies ChartConfig

export function CampaignCard({ data }: { data: AnalyticsData }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>
          Messages sent (left axis) vs. conversions (right axis)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <BarChart data={data.campaigns} margin={{ left: -8, right: -8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.split(" ")[0]}
            />
            <YAxis
              yAxisId="sent"
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <YAxis
              yAxisId="converted"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              yAxisId="sent"
              dataKey="sent"
              fill="var(--color-sent)"
              radius={4}
            />
            <Bar
              yAxisId="converted"
              dataKey="converted"
              fill="var(--color-converted)"
              radius={4}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
        <ItemGroup className="gap-2">
          {data.campaigns.map((campaign) => (
            <Item key={campaign.name} variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>{campaign.name}</ItemTitle>
                <ItemDescription>
                  {campaign.converted.toLocaleString("en-IN")} conversions from{" "}
                  {campaign.sent.toLocaleString("en-IN")} sent
                </ItemDescription>
              </ItemContent>
              <ItemActions className="flex-col items-end gap-0">
                <span className="text-base font-semibold tabular-nums">
                  {formatInr(campaign.cpl)}
                </span>
                <span className="text-xs text-muted-foreground">CPL</span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
