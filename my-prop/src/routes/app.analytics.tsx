import { createFileRoute } from "@tanstack/react-router"

import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export const Route = createFileRoute("/app/analytics")({
  component: AnalyticsDashboard,
})
