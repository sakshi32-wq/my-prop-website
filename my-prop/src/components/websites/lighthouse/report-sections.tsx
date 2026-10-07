import { CircleXIcon, TriangleAlertIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"

import { SCORE_ITEMS } from "./data"
import type { Impact, Issue, LighthouseReport } from "./data"

export function scoreRating(score: number) {
  if (score >= 90) return { label: "Good", variant: "secondary" as const }
  if (score >= 50) return { label: "Average", variant: "outline" as const }
  return { label: "Poor", variant: "destructive" as const }
}

const IMPACT_BADGE: Record<
  Impact,
  { label: string; variant: "destructive" | "secondary" | "outline" }
> = {
  high: { label: "High", variant: "destructive" },
  medium: { label: "Medium", variant: "secondary" },
  low: { label: "Low", variant: "outline" },
}

export function ScoreGrid({ scores }: { scores: LighthouseReport["scores"] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {SCORE_ITEMS.map((item) => {
        const score = scores[item.key]
        const rating = scoreRating(score)
        return (
          <Card key={item.label} size="sm">
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5">
                <item.icon className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </CardDescription>
              <CardTitle className="flex flex-wrap items-center gap-2 text-3xl font-semibold tabular-nums">
                {score}
                <Badge variant={rating.variant}>{rating.label}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={score} aria-label={`${item.label} score`} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="size-4" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

export function IssueList({
  issues,
  kind,
}: {
  issues: Array<Issue>
  kind: "opportunity" | "issue"
}) {
  const Icon = kind === "opportunity" ? TriangleAlertIcon : CircleXIcon
  return (
    <ItemGroup className="gap-2">
      {issues.map((issue) => {
        const impact = IMPACT_BADGE[issue.impact]
        return (
          <Item key={issue.title} variant="outline" role="listitem">
            <ItemMedia variant="icon">
              <Icon />
            </ItemMedia>
            <ItemContent className="min-w-0">
              <ItemTitle className="line-clamp-none flex-wrap">
                {issue.title}
                <Badge variant={impact.variant}>{impact.label}</Badge>
              </ItemTitle>
              <ItemDescription className="line-clamp-none">
                {issue.description}
              </ItemDescription>
              {issue.element && (
                <p className="text-xs font-medium">{issue.element}</p>
              )}
            </ItemContent>
          </Item>
        )
      })}
    </ItemGroup>
  )
}
