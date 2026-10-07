import { subDays } from "date-fns"
import {
  CalendarIcon,
  ChartColumnIcon,
  CreditCardIcon,
  DatabaseIcon,
  IndianRupeeIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { Integration, IntegrationId } from "@/api/generated/model"

export type {
  Integration,
  IntegrationId,
  IntegrationSettings,
} from "@/api/generated/model"

export type IntegrationInfo = {
  id: IntegrationId
  name: string
  description: string
  icon: LucideIcon
}

/** Display info for every integration in the catalog. */
export const INTEGRATIONS = {
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
} satisfies Record<IntegrationId, IntegrationInfo>

const CONNECTED_AT = subDays(new Date(), 45).toISOString()

function demo(
  id: IntegrationId,
  connected: boolean,
  settings: Record<string, string> = {}
): Integration {
  return {
    id,
    connected,
    settings,
    connectedAt: connected ? CONNECTED_AT : null,
  }
}

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_INTEGRATIONS: Array<Integration> = [
  demo("whatsapp", true, {
    number: "+91 98765 43210",
    apiKey: "wa_live_8Jd2kQ9xLm4Vt7Rb",
  }),
  demo("gmail", false),
  demo("outlook", false),
  demo("twilio", true, {
    sid: "AC-demo-sid-not-real-5f3e",
    token: "9b1f7c3e5a2d8f4b6c0e1a9d7f3b5c2e",
  }),
  demo("googleCalendar", false),
  demo("googleAnalytics", true, { trackingId: "G-XXXXXXXXXX" }),
  demo("razorpay", true),
  demo("stripe", false),
  demo("salesforce", false),
  demo("zoho", false),
]
