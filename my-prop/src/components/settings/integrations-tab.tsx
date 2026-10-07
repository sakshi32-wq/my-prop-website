import { useState } from "react"
import {
  ChartColumnIcon,
  CalendarIcon,
  CreditCardIcon,
  DatabaseIcon,
  IndianRupeeIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
} from "lucide-react"
import { toast } from "sonner"

import { ApiKeysCard } from "./api-keys-card"
import {
  ConfigurableIntegrationCard,
  IntegrationListCard,
} from "./integration-cards"
import type { IntegrationInfo } from "./integration-item"

const INTEGRATIONS = {
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp Business API",
    description: "Auto-reply and follow up with leads on WhatsApp",
    icon: MessageSquareIcon,
  },
  gmail: {
    id: "gmail",
    name: "Gmail",
    description: "Send emails from your Gmail account",
    icon: MailIcon,
  },
  outlook: {
    id: "outlook",
    name: "Outlook",
    description: "Send emails from your Outlook account",
    icon: MailIcon,
  },
  twilio: {
    id: "twilio",
    name: "Twilio SMS",
    description: "Send SMS alerts and reminders",
    icon: PhoneIcon,
  },
  googleCalendar: {
    id: "googleCalendar",
    name: "Google Calendar",
    description: "Sync site visit appointments",
    icon: CalendarIcon,
  },
  googleAnalytics: {
    id: "googleAnalytics",
    name: "Google Analytics",
    description: "Track visitors across your websites",
    icon: ChartColumnIcon,
  },
  razorpay: {
    id: "razorpay",
    name: "Razorpay",
    description: "Collect booking amounts in INR",
    icon: IndianRupeeIcon,
  },
  stripe: {
    id: "stripe",
    name: "Stripe",
    description: "Accept international payments",
    icon: CreditCardIcon,
  },
  salesforce: {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync leads to Salesforce",
    icon: DatabaseIcon,
  },
  zoho: {
    id: "zoho",
    name: "Zoho CRM",
    description: "Sync leads to Zoho CRM",
    icon: DatabaseIcon,
  },
} satisfies Record<string, IntegrationInfo>

const INITIAL_CONNECTED: Record<string, boolean> = {
  whatsapp: true,
  twilio: true,
  googleAnalytics: true,
  razorpay: true,
}

export function IntegrationsTab() {
  const [connected, setConnected] = useState(INITIAL_CONNECTED)

  function handleConnectedChange(integration: IntegrationInfo, value: boolean) {
    const set = (next: boolean) =>
      setConnected((prev) => ({ ...prev, [integration.id]: next }))
    set(value)
    if (value) {
      toast.success(`${integration.name} connected`)
    } else {
      toast(`${integration.name} disconnected`, {
        action: { label: "Undo", onClick: () => set(true) },
      })
    }
  }

  const connection = { connected, onConnectedChange: handleConnectedChange }

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
            defaultValue: "+91 98765 43210",
          },
          {
            id: "apiKey",
            label: "API Key",
            defaultValue: "wa_live_8Jd2kQ9xLm4Vt7Rb",
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
            defaultValue: "AC-demo-sid-not-real-5f3e",
            secret: true,
          },
          {
            id: "token",
            label: "Auth Token",
            defaultValue: "9b1f7c3e5a2d8f4b6c0e1a9d7f3b5c2e",
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
            defaultValue: "G-XXXXXXXXXX",
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
