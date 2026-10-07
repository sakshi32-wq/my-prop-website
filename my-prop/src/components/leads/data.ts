import { subDays, subHours } from "date-fns"
import {
  GlobeIcon,
  MessageSquareIcon,
  Share2Icon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { Lead, LeadSource } from "@/api/generated/model"
import { LEAD_SOURCES, LEAD_STAGES } from "@/lib/mock-data"

export type {
  Lead,
  LeadInput,
  LeadSource,
  LeadStage,
  LeadUpdate,
} from "@/api/generated/model"

export const SOURCE_ICONS: Record<LeadSource, LucideIcon> = {
  website: GlobeIcon,
  whatsapp: MessageSquareIcon,
  social: Share2Icon,
  referral: UserPlusIcon,
  "walk-in": UserIcon,
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
