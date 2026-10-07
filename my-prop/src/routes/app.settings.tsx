import { createFileRoute } from "@tanstack/react-router"
import {
  CreditCardIcon,
  GlobeIcon,
  PlugIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { BillingTab } from "@/components/settings/billing-tab"
import { DomainsTab } from "@/components/settings/domains-tab"
import { IntegrationsTab } from "@/components/settings/integrations-tab"
import { ProfileTab } from "@/components/settings/profile-tab"
import { TeamTab } from "@/components/settings/team-tab"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TABS = [
  { value: "profile", label: "Profile", icon: UserIcon, content: ProfileTab },
  { value: "domains", label: "Domains", icon: GlobeIcon, content: DomainsTab },
  { value: "team", label: "Team", icon: UsersIcon, content: TeamTab },
  {
    value: "integrations",
    label: "Integrations",
    icon: PlugIcon,
    content: IntegrationsTab,
  },
  {
    value: "billing",
    label: "Billing",
    icon: CreditCardIcon,
    content: BillingTab,
  },
] as const

type SettingsTab = (typeof TABS)[number]["value"]

function isSettingsTab(value: unknown): value is SettingsTab {
  return TABS.some((tab) => tab.value === value)
}

export const Route = createFileRoute("/app/settings")({
  validateSearch: (search: Record<string, unknown>): { tab?: SettingsTab } =>
    isSettingsTab(search.tab) && search.tab !== "profile"
      ? { tab: search.tab }
      : {},
  component: Page,
})

function Page() {
  const { tab = "profile" } = Route.useSearch()
  const navigate = Route.useNavigate()

  function handleTabChange(value: string) {
    if (!isSettingsTab(value)) return
    void navigate({
      search: value === "profile" ? {} : { tab: value },
      replace: true,
      resetScroll: false,
    })
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />
      <Tabs value={tab} onValueChange={handleTabChange} className="gap-4">
        <ScrollArea className="w-full">
          <TabsList className="mb-2">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="px-2.5">
                <Icon data-icon="inline-start" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {/* Keep every tab mounted so local edits survive switching tabs. */}
        {TABS.map(({ value, content: Content }) => (
          <TabsContent
            key={value}
            value={value}
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <Content />
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
