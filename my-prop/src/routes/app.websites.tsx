import { createFileRoute } from "@tanstack/react-router"

import { WebsitesPage } from "@/components/websites/websites-page"

export const Route = createFileRoute("/app/websites")({
  component: WebsitesPage,
})
