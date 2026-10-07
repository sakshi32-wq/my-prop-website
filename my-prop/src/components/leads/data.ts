import { subDays, subHours } from "date-fns"
import {
  GlobeIcon,
  MessageSquareIcon,
  Share2Icon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { LEAD_SOURCES, LEAD_STAGES } from "@/lib/mock-data"
import type { LeadSource, LeadStage } from "@/lib/mock-data"

export const SOURCE_ICONS: Record<LeadSource, LucideIcon> = {
  website: GlobeIcon,
  whatsapp: MessageSquareIcon,
  social: Share2Icon,
  referral: UserPlusIcon,
  "walk-in": UserIcon,
}

export type Lead = {
  id: string
  name: string
  phone: string
  email: string
  source: LeadSource
  budget: string
  configuration: string
  project: string
  stage: LeadStage
  tags: Array<string>
  notes: string
  addedAt: Date
}

export type LeadInput = Omit<Lead, "id" | "addedAt">

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

export function createLeadId() {
  return `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

const now = new Date()

export const INITIAL_LEADS: Array<Lead> = [
  {
    id: "1",
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
    addedAt: subHours(now, 2),
  },
  {
    id: "2",
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
    addedAt: subHours(now, 5),
  },
  {
    id: "3",
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
    addedAt: subDays(now, 1),
  },
  {
    id: "4",
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
    addedAt: subDays(now, 2),
  },
  {
    id: "5",
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
    addedAt: subDays(now, 2),
  },
  {
    id: "6",
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
    addedAt: subDays(now, 3),
  },
  {
    id: "7",
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
    addedAt: subDays(now, 5),
  },
  {
    id: "8",
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
    addedAt: subDays(now, 7),
  },
]
