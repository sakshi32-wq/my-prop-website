import { subDays, subHours, subMinutes } from "date-fns"
import {
  ArrowRightLeftIcon,
  CalendarCheckIcon,
  ClockIcon,
  GlobeIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  Share2Icon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type {
  CallLogInput,
  Lead,
  LeadActivity,
  LeadActivityType,
  LeadSource,
} from "@/api/generated/model"
import { LEAD_SOURCES, LEAD_STAGES } from "@/lib/mock-data"

export type {
  CallLogInput,
  Lead,
  LeadActivity,
  LeadInput,
  LeadSource,
  LeadStage,
  LeadUpdate,
  SiteVisitInput,
} from "@/api/generated/model"

export const SOURCE_ICONS: Record<LeadSource, LucideIcon> = {
  website: GlobeIcon,
  whatsapp: MessageSquareIcon,
  social: Share2Icon,
  referral: UserPlusIcon,
  "walk-in": UserIcon,
}

export const ACTIVITY_ICONS: Record<LeadActivityType, LucideIcon> = {
  captured: ClockIcon,
  "stage-change": ArrowRightLeftIcon,
  call: PhoneIcon,
  whatsapp: MessageSquareIcon,
  email: MailIcon,
  "site-visit": CalendarCheckIcon,
}

export const CALL_OUTCOMES = [
  { value: "connected", label: "Connected - Discussed" },
  { value: "interested", label: "Interested - Will Visit" },
  { value: "callback", label: "Call Back Later" },
  { value: "not-interested", label: "Not Interested" },
  { value: "wrong-number", label: "Wrong Number" },
  { value: "no-answer", label: "No Answer" },
  { value: "voicemail", label: "Voicemail Left" },
] as const satisfies ReadonlyArray<{
  value: CallLogInput["outcome"]
  label: string
}>

export const CALL_NEXT_ACTIONS = [
  { value: "schedule-visit", label: "Schedule Site Visit" },
  { value: "send-brochure", label: "Send Property Brochure" },
  { value: "follow-up", label: "Follow Up in 2-3 Days" },
  { value: "send-payment-plan", label: "Send Payment Plan" },
  { value: "escalate", label: "Escalate to Manager" },
  { value: "none", label: "No Action Required" },
]

export const CALL_DURATIONS = [
  { value: "less-1min", label: "Less than 1 minute" },
  { value: "1-3min", label: "1-3 minutes" },
  { value: "3-5min", label: "3-5 minutes" },
  { value: "5-10min", label: "5-10 minutes" },
  { value: "10plus", label: "More than 10 minutes" },
]

export const SALES_REPS = [
  { value: "Amit Sharma", label: "Amit Sharma (Senior Sales)" },
  { value: "Priya Singh", label: "Priya Singh (Sales Manager)" },
  { value: "Rajesh Kumar", label: "Rajesh Kumar (Sales Executive)" },
  { value: "Neha Patel", label: "Neha Patel (Sales Associate)" },
]

export const VISIT_REMINDERS = [
  { value: "15min", label: "15 minutes before" },
  { value: "30min", label: "30 minutes before" },
  { value: "1hour", label: "1 hour before" },
  { value: "2hours", label: "2 hours before" },
  { value: "1day", label: "1 day before" },
]

export function optionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | undefined
) {
  return options.find((option) => option.value === value)?.label
}

export function sourceLabel(source: string) {
  return LEAD_SOURCES.find((s) => s.value === source)?.label ?? source
}

export function stageLabel(stage: string) {
  return LEAD_STAGES.find((s) => s.value === stage)?.label ?? stage
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function firstName(name: string) {
  return name.trim().split(" ")[0] || "there"
}

export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "")
}

const now = new Date()

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_LEADS: Array<Lead> = [
  {
    id: "37ae9904-940c-4f95-8256-6f2b4520db4e",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul@example.com",
    budget: "₹80L - 1Cr",
    configuration: "2 BHK",
    source: "website",
    project: "Skyline Heights",
    stage: "new",
    tags: ["Hot Lead"],
    notes: "",
    addedAt: subHours(now, 2).toISOString(),
  },
  {
    id: "18628295-c8bc-478a-bbf8-1af345fbc072",
    name: "Priya Patel",
    phone: "+91 98765 43211",
    email: "priya@example.com",
    budget: "₹1Cr - 1.5Cr",
    configuration: "3 BHK",
    source: "whatsapp",
    project: "Marina Bay",
    stage: "new",
    tags: [],
    notes: "",
    addedAt: subHours(now, 5).toISOString(),
  },
  {
    id: "7545c4cb-c771-40d2-aad3-850e90a1057f",
    name: "Amit Kumar",
    phone: "+91 98765 43212",
    email: "amit@example.com",
    budget: "₹60L - 80L",
    configuration: "2 BHK",
    source: "social",
    project: "Green Valley",
    stage: "contacted",
    tags: ["First Time Buyer"],
    notes: "",
    addedAt: subDays(now, 1).toISOString(),
  },
  {
    id: "0e21455c-f855-4135-bbc4-5713df5f5386",
    name: "Neha Singh",
    phone: "+91 98765 43213",
    email: "neha@example.com",
    budget: "₹2Cr+",
    configuration: "Penthouse",
    source: "referral",
    project: "Skyline Heights",
    stage: "interested",
    tags: ["Hot Lead"],
    notes: "",
    addedAt: subDays(now, 2).toISOString(),
  },
  {
    id: "f632d027-39a7-4810-be34-ca0f4e63f8db",
    name: "Vikram Mehta",
    phone: "+91 98765 43214",
    email: "vikram@example.com",
    budget: "₹80L - 1Cr",
    configuration: "3 BHK",
    source: "website",
    project: "Marina Bay",
    stage: "interested",
    tags: ["Investor"],
    notes: "",
    addedAt: subDays(now, 2).toISOString(),
  },
  {
    id: "8f555360-8459-4e16-bcc7-2036cd29645e",
    name: "Anjali Desai",
    phone: "+91 98765 43215",
    email: "anjali@example.com",
    budget: "₹1Cr - 1.5Cr",
    configuration: "3 BHK",
    source: "whatsapp",
    project: "Green Valley",
    stage: "scheduled",
    tags: ["Site Visit: Tomorrow"],
    notes: "",
    addedAt: subDays(now, 3).toISOString(),
  },
  {
    id: "d303a4d6-34b0-4d8f-a564-87c6d1e72962",
    name: "Rajesh Gupta",
    phone: "+91 98765 43216",
    email: "rajesh@example.com",
    budget: "₹1.5Cr - 2Cr",
    configuration: "3 BHK",
    source: "website",
    project: "Skyline Heights",
    stage: "negotiation",
    tags: ["Final Stage"],
    notes: "",
    addedAt: subDays(now, 5).toISOString(),
  },
  {
    id: "9a872906-7b3d-44af-a0d9-866be1351bf0",
    name: "Sunita Verma",
    phone: "+91 98765 43217",
    email: "sunita@example.com",
    budget: "₹80L - 1Cr",
    configuration: "2 BHK",
    source: "referral",
    project: "Marina Bay",
    stage: "closed",
    tags: ["Closed - Won"],
    notes: "",
    addedAt: subDays(now, 7).toISOString(),
  },
]

/** Seed timeline for each demo lead (src/mocks/db.ts). */
export const DEMO_LEAD_ACTIVITIES: Array<LeadActivity> = DEMO_LEADS.flatMap(
  (lead, index) => {
    const id = (n: number) =>
      `${lead.id.slice(0, -4)}${(index * 3 + n).toString(16).padStart(4, "0")}`
    const activities: Array<LeadActivity> = [
      {
        id: id(1),
        leadId: lead.id,
        type: "captured",
        title: `Lead captured via ${sourceLabel(lead.source)}`,
        description: lead.project,
        createdAt: lead.addedAt,
      },
    ]
    // Leads older than a couple of hours already have some follow-up.
    if (Date.parse(lead.addedAt) < subHours(now, 2).getTime())
      activities.push(
        {
          id: id(2),
          leadId: lead.id,
          type: "whatsapp",
          title: "WhatsApp message sent",
          description: "",
          createdAt: subHours(now, 1).toISOString(),
        },
        {
          id: id(3),
          leadId: lead.id,
          type: "email",
          title: "Email follow-up sent",
          description: "",
          createdAt: subMinutes(now, 30).toISOString(),
        }
      )
    return activities
  }
)
