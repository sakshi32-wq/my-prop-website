import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CreateWebsiteWizard } from "@/components/websites/create-website-wizard"
import { LighthouseReportDialog } from "@/components/websites/lighthouse-report-dialog"
import { WebsiteCard } from "@/components/websites/website-card"
import { WEBSITES } from "@/lib/mock-data"
import type { Website } from "@/lib/mock-data"

export const Route = createFileRoute("/app/websites")({
  component: WebsitesPage,
})

function WebsitesPage() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [lighthouseOpen, setLighthouseOpen] = useState(false)
  const [selected, setSelected] = useState<Website | null>(null)

  function openLighthouse(site: Website) {
    setSelected(site)
    setLighthouseOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Websites"
        description="Manage your property websites and microsites"
        actions={
          <Button onClick={() => setWizardOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            Create New Website
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {WEBSITES.map((site) => (
          <WebsiteCard
            key={site.id}
            site={site}
            onOpenLighthouse={openLighthouse}
          />
        ))}

        <Empty className="min-h-80 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PlusIcon />
            </EmptyMedia>
            <EmptyTitle>Create New Website</EmptyTitle>
            <EmptyDescription>
              Start building your property website with AI
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={() => setWizardOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Create Website
            </Button>
          </EmptyContent>
        </Empty>
      </div>

      <CreateWebsiteWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      <LighthouseReportDialog
        open={lighthouseOpen}
        onOpenChange={setLighthouseOpen}
        website={selected}
      />
    </>
  )
}
