import { createFileRoute } from "@tanstack/react-router"

import { CampaignsPage } from "@/components/campaigns/campaigns-page"

export const Route = createFileRoute("/app/campaigns")({
  component: CampaignsPage,
})
