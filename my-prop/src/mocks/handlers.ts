import { apiKeyHandlers } from "./handlers/api-keys"
import { campaignHandlers } from "./handlers/campaigns"
import { domainHandlers } from "./handlers/domains"
import { integrationHandlers } from "./handlers/integrations"
import { leadHandlers } from "./handlers/leads"
import { teamHandlers } from "./handlers/team"
import { websiteHandlers } from "./handlers/websites"
import { getApiKeysMock } from "@/api/generated/api-keys/api-keys.msw"
import { getCampaignsMock } from "@/api/generated/campaigns/campaigns.msw"
import { getDomainsMock } from "@/api/generated/domains/domains.msw"
import { getIntegrationsMock } from "@/api/generated/integrations/integrations.msw"
import { getLeadsMock } from "@/api/generated/leads/leads.msw"
import { getTeamMock } from "@/api/generated/team/team.msw"
import { getWebsitesMock } from "@/api/generated/websites/websites.msw"

// MSW uses the first matching handler, so the stateful handlers win and
// Orval's Faker handlers only answer endpoints that don't have one yet.
export const handlers = [
  ...leadHandlers,
  ...campaignHandlers,
  ...teamHandlers,
  ...domainHandlers,
  ...apiKeyHandlers,
  ...integrationHandlers,
  ...websiteHandlers,
  ...getLeadsMock(),
  ...getCampaignsMock(),
  ...getTeamMock(),
  ...getDomainsMock(),
  ...getApiKeysMock(),
  ...getIntegrationsMock(),
  ...getWebsitesMock(),
]
