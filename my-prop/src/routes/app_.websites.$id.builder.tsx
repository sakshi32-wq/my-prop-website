import { createFileRoute } from "@tanstack/react-router"

import { WebsiteBuilderPage } from "@/components/builder/website-builder-page"

export const Route = createFileRoute("/app_/websites/$id/builder")({
  head: () => ({ meta: [{ title: "Website Builder — myprop.live" }] }),
  component: Page,
})

function Page() {
  const { id } = Route.useParams()
  // Remount per website so history, selection and drafts never leak across.
  return <WebsiteBuilderPage key={id} websiteId={id} />
}
