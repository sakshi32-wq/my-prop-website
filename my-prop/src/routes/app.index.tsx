import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"

import { ActiveWebsitesCard } from "@/components/dashboard/active-websites-card"
import { ConversionFunnelChart } from "@/components/dashboard/conversion-funnel-chart"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { LeadSourcesChart } from "@/components/dashboard/lead-sources-chart"
import { LeadsOverTimeChart } from "@/components/dashboard/leads-over-time-chart"
import { RecentLeadsCard } from "@/components/dashboard/recent-leads-card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { CreateWebsiteWizard } from "@/components/websites/create-website-wizard"

export const Route = createFileRoute("/app/")({ component: DashboardPage })

function DashboardPage() {
  const [wizardOpen, setWizardOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your properties."
        actions={
          <Button onClick={() => setWizardOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            Create New Website
          </Button>
        }
      />

      <KpiCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <LeadsOverTimeChart className="lg:col-span-2" />
        <LeadSourcesChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ConversionFunnelChart />
        <RecentLeadsCard className="lg:col-span-2" />
      </div>

      <ActiveWebsitesCard />

      <CreateWebsiteWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  )
}
