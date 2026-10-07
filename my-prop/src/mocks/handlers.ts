import { accountHandlers } from "./handlers/account"
import { aiHandlers } from "./handlers/ai"
import { analyticsHandlers } from "./handlers/analytics"
import { apiKeyHandlers } from "./handlers/api-keys"
import { authHandlers } from "./handlers/auth"
import { automationHandlers } from "./handlers/automations"
import { billingHandlers } from "./handlers/billing"
import { campaignHandlers } from "./handlers/campaigns"
import { domainHandlers } from "./handlers/domains"
import { integrationHandlers } from "./handlers/integrations"
import { leadHandlers } from "./handlers/leads"
import { notificationHandlers } from "./handlers/notifications"
import { teamHandlers } from "./handlers/team"
import { templateHandlers } from "./handlers/templates"
import { websiteHandlers } from "./handlers/websites"
import { getAccountMock } from "@/api/generated/account/account.msw"
import { getAiMock } from "@/api/generated/ai/ai.msw"
import { getAnalyticsMock } from "@/api/generated/analytics/analytics.msw"
import { getApiKeysMock } from "@/api/generated/api-keys/api-keys.msw"
import { getAuthMock } from "@/api/generated/auth/auth.msw"
import { getAutomationsMock } from "@/api/generated/automations/automations.msw"
import { getBillingMock } from "@/api/generated/billing/billing.msw"
import { getCampaignsMock } from "@/api/generated/campaigns/campaigns.msw"
import { getDomainsMock } from "@/api/generated/domains/domains.msw"
import { getIntegrationsMock } from "@/api/generated/integrations/integrations.msw"
import { getLeadsMock } from "@/api/generated/leads/leads.msw"
import { getNotificationsMock } from "@/api/generated/notifications/notifications.msw"
import { getTeamMock } from "@/api/generated/team/team.msw"
import { getTemplatesMock } from "@/api/generated/templates/templates.msw"
import { getWebsitesMock } from "@/api/generated/websites/websites.msw"

// MSW uses the first matching handler, so the stateful handlers win and
// Orval's Faker handlers only answer endpoints that don't have one yet.
export const handlers = [
  ...leadHandlers,
  ...campaignHandlers,
  ...automationHandlers,
  ...teamHandlers,
  ...domainHandlers,
  ...apiKeyHandlers,
  ...integrationHandlers,
  ...websiteHandlers,
  ...templateHandlers,
  ...accountHandlers,
  ...analyticsHandlers,
  ...notificationHandlers,
  ...aiHandlers,
  ...billingHandlers,
  ...authHandlers,
  ...getLeadsMock(),
  ...getCampaignsMock(),
  ...getAutomationsMock(),
  ...getTeamMock(),
  ...getDomainsMock(),
  ...getApiKeysMock(),
  ...getIntegrationsMock(),
  ...getWebsitesMock(),
  ...getTemplatesMock(),
  ...getAccountMock(),
  ...getAnalyticsMock(),
  ...getNotificationsMock(),
  ...getAiMock(),
  ...getBillingMock(),
  ...getAuthMock(),
]
