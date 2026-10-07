import { ApiKeysCard } from "./api-keys-card"
import {
  ConfigurableIntegrationCard,
  IntegrationListCard,
} from "./integration-cards"
import { INTEGRATIONS } from "./integrations-data"
import { useListIntegrations } from "@/api/generated/integrations/integrations"
import { QueryError } from "@/components/query-error"
import { Skeleton } from "@/components/ui/skeleton"

export function IntegrationsTab() {
  const integrationsQuery = useListIntegrations()

  if (integrationsQuery.isPending || integrationsQuery.isError) {
    return (
      <div className="flex flex-col gap-6">
        {integrationsQuery.isPending ? (
          <div
            className="flex flex-col gap-6"
            aria-busy="true"
            aria-label="Loading integrations"
          >
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <QueryError
            title="Couldn't load integrations"
            error={integrationsQuery.error}
            onRetry={() => void integrationsQuery.refetch()}
          />
        )}
        <ApiKeysCard />
      </div>
    )
  }

  const connection = {
    states: Object.fromEntries(
      integrationsQuery.data.map((integration) => [integration.id, integration])
    ),
  }

  return (
    <div className="flex flex-col gap-6">
      <ConfigurableIntegrationCard
        {...connection}
        title="WhatsApp Integration"
        description="Respond to leads instantly on WhatsApp."
        integration={INTEGRATIONS.whatsapp}
        fields={[
          {
            id: "number",
            label: "WhatsApp Business Number",
          },
          {
            id: "apiKey",
            label: "API Key",
            secret: true,
          },
        ]}
      />
      <IntegrationListCard
        {...connection}
        title="Email Integration"
        description="Send lead follow-ups from your own inbox."
        integrations={[INTEGRATIONS.gmail, INTEGRATIONS.outlook]}
      />
      <ConfigurableIntegrationCard
        {...connection}
        title="SMS Integration"
        description="Reach leads by text message."
        integration={INTEGRATIONS.twilio}
        fields={[
          {
            id: "sid",
            label: "Account SID",
            secret: true,
          },
          {
            id: "token",
            label: "Auth Token",
            secret: true,
          },
        ]}
      />
      <IntegrationListCard
        {...connection}
        title="Calendar Integration"
        description="Keep site visits in sync with your calendar."
        integrations={[INTEGRATIONS.googleCalendar]}
      />
      <ConfigurableIntegrationCard
        {...connection}
        title="Analytics Integration"
        description="Measure traffic and conversions on your websites."
        integration={INTEGRATIONS.googleAnalytics}
        fields={[
          {
            id: "trackingId",
            label: "Tracking ID",
            placeholder: "G-XXXXXXXXXX",
          },
        ]}
      />
      <IntegrationListCard
        {...connection}
        title="Payment Gateways"
        description="Collect booking and token amounts online."
        integrations={[INTEGRATIONS.razorpay, INTEGRATIONS.stripe]}
      />
      <IntegrationListCard
        {...connection}
        title="CRM Integration"
        description="Push new leads into the CRM your team already uses."
        integrations={[INTEGRATIONS.salesforce, INTEGRATIONS.zoho]}
      />
      <ApiKeysCard />
    </div>
  )
}
