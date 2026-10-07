import { useState } from "react"
import { PlusIcon } from "lucide-react"

import { useListWebsites } from "@/api/generated/websites/websites"
import { PageHeader } from "@/components/page-header"
import { QueryError } from "@/components/query-error"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateWebsiteWizard } from "./create-website-wizard"
import { LighthouseReportDialog } from "./lighthouse-report-dialog"
import { WebsiteCard } from "./website-card"
import type { Website } from "./data"

export function WebsitesPage() {
  const websitesQuery = useListWebsites()
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

      {websitesQuery.isError && (
        <QueryError
          title="Couldn't load websites"
          error={websitesQuery.error}
          onRetry={() => void websitesQuery.refetch()}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {websitesQuery.isPending &&
          Array.from({ length: 3 }, (_, i) => (
            <Skeleton
              key={i}
              className="h-128 rounded-xl"
              aria-label={i === 0 ? "Loading websites" : undefined}
            />
          ))}
        {websitesQuery.data?.map((site) => (
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
