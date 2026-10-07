import { TrendingUpIcon } from "lucide-react"

import type { AnalyticsData } from "./data"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function FunnelCard({ data }: { data: AnalyticsData }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>
          Bars show each stage as a share of all visitors
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {data.funnel.map((step) => (
          <div key={step.stage} className="flex flex-col gap-2">
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{step.stage}</span>
                <span className="text-xs text-muted-foreground">
                  {step.fromPrevious === null
                    ? "Top of funnel"
                    : `${step.fromPrevious.toFixed(1)}% from previous step`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold tabular-nums">
                  {step.count.toLocaleString("en-IN")}
                </span>{" "}
                <span className="text-sm text-muted-foreground tabular-nums">
                  ({step.ofVisitors.toFixed(1)}%)
                </span>
              </div>
            </div>
            <Progress
              value={step.ofVisitors}
              className="h-3"
              aria-label={`${step.stage}: ${step.ofVisitors.toFixed(1)}% of visitors`}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">
            Overall Conversion Rate
          </span>
          <span className="text-2xl font-semibold tabular-nums">
            {data.overallConversion.toFixed(2)}%
          </span>
        </div>
        <TrendingUpIcon className="size-8 text-muted-foreground" />
      </CardFooter>
    </Card>
  )
}
