import { leadHandlers } from "./handlers/leads"
import { getLeadsMock } from "@/api/generated/leads/leads.msw"

// MSW uses the first matching handler, so the stateful handlers win and
// Orval's Faker handlers only answer endpoints that don't have one yet.
export const handlers = [...leadHandlers, ...getLeadsMock()]
