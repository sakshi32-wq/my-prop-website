import {
  AccessibilityIcon,
  CircleCheckIcon,
  ClockIcon,
  FileTextIcon,
  LightbulbIcon,
  SearchIcon,
  ShieldIcon,
  SmartphoneIcon,
  TrendingUpIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BEST_PRACTICE_ICONS } from "./data"
import type { LighthouseReport } from "./data"
import { IssueList, SectionCard } from "./report-sections"

const TABS = [
  { value: "performance", label: "Performance" },
  { value: "accessibility", label: "Accessibility" },
  { value: "seo", label: "SEO" },
  { value: "best-practices", label: "Best Practices" },
]

export function ReportTabs({ report }: { report: LighthouseReport }) {
  return (
    <Tabs defaultValue="performance">
      <TabsList className="grid w-full grid-cols-2 group-data-horizontal/tabs:h-auto sm:grid-cols-4">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="h-7">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="performance" className="mt-2 flex flex-col gap-4">
        <SectionCard icon={ClockIcon} title="Performance Metrics">
          {report.metrics.map((metric) => (
            <div key={metric.name} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-medium">{metric.name}</span>
                  <span className="text-muted-foreground">
                    {metric.description}
                  </span>
                </div>
                <span className="shrink-0 text-lg font-semibold tabular-nums">
                  {metric.value}
                </span>
              </div>
              <Progress
                value={metric.score}
                aria-label={`${metric.name} score`}
              />
            </div>
          ))}
        </SectionCard>
        <SectionCard
          icon={TrendingUpIcon}
          title="Opportunities"
          description="These suggestions can help your page load faster."
        >
          <IssueList issues={report.opportunities} kind="opportunity" />
        </SectionCard>
      </TabsContent>

      <TabsContent value="accessibility" className="mt-2 flex flex-col gap-4">
        <SectionCard icon={AccessibilityIcon} title="Accessibility Issues">
          <IssueList issues={report.accessibilityIssues} kind="issue" />
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>Passed Audits</AlertTitle>
            <AlertDescription>
              <ul className="ml-4 flex list-disc flex-col gap-1">
                {report.accessibilityPassed.map((audit) => (
                  <li key={audit}>{audit}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </SectionCard>
      </TabsContent>

      <TabsContent value="seo" className="mt-2 flex flex-col gap-4">
        <SectionCard icon={SearchIcon} title="SEO Analysis">
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>Passed Audits</AlertTitle>
            <AlertDescription>
              <ul className="flex flex-col gap-2">
                {report.seoPassed.map((audit) => (
                  <li key={audit.title} className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {audit.title}
                    </span>
                    <span>{audit.description}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          <div className="grid gap-3 sm:grid-cols-2">
            <Item variant="outline">
              <ItemMedia variant="icon">
                <SmartphoneIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg">
                  {report.mobileFriendly ? "Yes" : "No"}
                </ItemTitle>
                <ItemDescription>Mobile Friendly</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <FileTextIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg">
                  {report.structuredDataValid ? "Valid" : "Invalid"}
                </ItemTitle>
                <ItemDescription>Structured Data</ItemDescription>
              </ItemContent>
            </Item>
          </div>
        </SectionCard>
      </TabsContent>

      <TabsContent value="best-practices" className="mt-2 flex flex-col gap-4">
        <SectionCard icon={ShieldIcon} title="Best Practices">
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>Passed Checks</AlertTitle>
            <AlertDescription>
              <ul className="flex flex-col gap-2">
                {report.bestPracticesPassed.map((check) => {
                  const Icon = BEST_PRACTICE_ICONS[check.key]
                  return (
                    <li key={check.key} className="flex items-center gap-2">
                      <Icon className="size-4 shrink-0" />
                      {check.label}
                    </li>
                  )
                })}
              </ul>
            </AlertDescription>
          </Alert>
          <Alert>
            <LightbulbIcon />
            <AlertTitle>Recommendation</AlertTitle>
            <AlertDescription>{report.recommendation}</AlertDescription>
          </Alert>
        </SectionCard>
      </TabsContent>
    </Tabs>
  )
}
