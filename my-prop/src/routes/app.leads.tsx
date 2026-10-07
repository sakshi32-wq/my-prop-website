import { createFileRoute } from "@tanstack/react-router"

import { LeadsPage } from "@/components/leads/leads-page"

export const Route = createFileRoute("/app/leads")({ component: LeadsPage })
