import { campaignHandlers } from "./handlers/campaigns"
import { leadHandlers } from "./handlers/leads"
import { teamHandlers } from "./handlers/team"
import { getCampaignsMock } from "@/api/generated/campaigns/campaigns.msw"
import { getLeadsMock } from "@/api/generated/leads/leads.msw"
import { getTeamMock } from "@/api/generated/team/team.msw"

// MSW uses the first matching handler, so the stateful handlers win and
// Orval's Faker handlers only answer endpoints that don't have one yet.
export const handlers = [
  ...leadHandlers,
  ...campaignHandlers,
  ...teamHandlers,
  ...getLeadsMock(),
  ...getCampaignsMock(),
  ...getTeamMock(),
]
