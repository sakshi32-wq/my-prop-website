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

import {
  ACCESSIBILITY_ISSUES,
  ACCESSIBILITY_PASSED,
  BEST_PRACTICES_PASSED,
  PERFORMANCE_METRICS,
  PERFORMANCE_OPPORTUNITIES,
  SEO_PASSED,
} from "./data"
import { IssueList, SectionCard } from "./report-sections"

const TABS = [
  { value: "performance", label: "Performance" },
  { value: "accessibility", label: "Accessibility" },
  { value: "seo", label: "SEO" },
  { value: "best-practices", label: "Best Practices" },
]

export function ReportTabs() {
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
          {PERFORMANCE_METRICS.map((metric) => (
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
          <IssueList issues={PERFORMANCE_OPPORTUNITIES} kind="opportunity" />
        </SectionCard>
      </TabsContent>

      <TabsContent value="accessibility" className="mt-2 flex flex-col gap-4">
        <SectionCard icon={AccessibilityIcon} title="Accessibility Issues">
          <IssueList issues={ACCESSIBILITY_ISSUES} kind="issue" />
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>Passed Audits</AlertTitle>
            <AlertDescription>
              <ul className="ml-4 flex list-disc flex-col gap-1">
                {ACCESSIBILITY_PASSED.map((audit) => (
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
                {SEO_PASSED.map((audit) => (
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
                <ItemTitle className="text-lg">Yes</ItemTitle>
                <ItemDescription>Mobile Friendly</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <FileTextIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-lg">Valid</ItemTitle>
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
                {BEST_PRACTICES_PASSED.map((check) => (
                  <li key={check.label} className="flex items-center gap-2">
                    <check.icon className="size-4 shrink-0" />
                    {check.label}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
          <Alert>
            <LightbulbIcon />
            <AlertTitle>Recommendation</AlertTitle>
            <AlertDescription>
              Consider implementing a Content Security Policy to prevent
              cross-site scripting attacks.
            </AlertDescription>
          </Alert>
        </SectionCard>
      </TabsContent>
    </Tabs>
  )
}
