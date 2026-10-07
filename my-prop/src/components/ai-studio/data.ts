import { subDays, subHours } from "date-fns"
import {
  Code2Icon,
  FileTextIcon,
  GlobeIcon,
  MessageSquareIcon,
  Share2Icon,
  Wand2Icon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type {
  AiContentInput,
  AiContentTool,
  AiToolType,
  SavedGeneration,
} from "@/api/generated/model"

export type ToolId = AiToolType

/** Tools that use the shared content form and produce text output. */
export type ContentToolId = AiContentTool

export type AiTool = {
  id: ToolId
  name: string
  description: string
  icon: LucideIcon
}

export const AI_TOOLS: Array<AiTool> = [
  {
    id: "webpage",
    name: "AI Web Page Designer",
    description: "Design web pages with AI - chat and preview in real-time",
    icon: Code2Icon,
  },
  {
    id: "website",
    name: "Generate Full Website",
    description: "Create complete property website with all sections",
    icon: GlobeIcon,
  },
  {
    id: "copy",
    name: "Generate Copy",
    description: "Write compelling property descriptions",
    icon: FileTextIcon,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Campaign",
    description: "Create WhatsApp message sequences",
    icon: MessageSquareIcon,
  },
  {
    id: "social",
    name: "Social Media Posts",
    description: "Generate posts for Instagram, Facebook",
    icon: Share2Icon,
  },
  {
    id: "faq",
    name: "Create FAQs",
    description: "Generate frequently asked questions",
    icon: Wand2Icon,
  },
]

export function getTool(id: ToolId) {
  return AI_TOOLS.find((tool) => tool.id === id) ?? AI_TOOLS[2]
}

export function isContentTool(id: ToolId): id is ContentToolId {
  return id === "copy" || id === "whatsapp" || id === "social" || id === "faq"
}

export const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
] as const

export const POST_COUNTS = ["3", "5", "10"] as const

export const CAMPAIGN_GOALS = [
  { value: "launch", label: "New Launch Announcement" },
  { value: "sitevisit", label: "Drive Site Visits" },
  { value: "offer", label: "Limited Time Offer" },
  { value: "followup", label: "Lead Follow-up" },
] as const

export type ContentFormData = AiContentInput

export const EMPTY_FORM: ContentFormData = {
  projectName: "",
  location: "",
  propertyType: "apartment",
  tone: "luxury",
  features: "",
  targetAudience: "",
  platform: "instagram",
  numPosts: "3",
  campaignGoal: "",
}

export type Generation = SavedGeneration

const now = new Date()

const SEED_GENERATIONS: Array<Omit<Generation, "content">> = [
  {
    id: "6f7a8b9c-0d1e-4f2a-9b3c-4d5e6f7a8b01",
    title: "Skyline Heights Copy",
    type: "copy",
    projectName: "Skyline Heights",
    location: "Andheri West, Mumbai",
    createdAt: subHours(now, 2).toISOString(),
    preview:
      "Welcome to Skyline Heights - Where Luxury Meets Comfort in the Heart of Andheri West, Mumbai",
    status: "completed",
  },
  {
    id: "6f7a8b9c-0d1e-4f2a-9b3c-4d5e6f7a8b02",
    title: "WhatsApp Campaign - Marina Bay",
    type: "whatsapp",
    projectName: "Marina Bay",
    location: "Worli, Mumbai",
    createdAt: subHours(now, 5).toISOString(),
    preview:
      "Hi {name}! 👋 Exciting news! We're launching Marina Bay in Worli, Mumbai...",
    status: "completed",
  },
  {
    id: "6f7a8b9c-0d1e-4f2a-9b3c-4d5e6f7a8b03",
    title: "FAQ Generation - Green Valley",
    type: "faq",
    projectName: "Green Valley",
    location: "Thane, Mumbai",
    createdAt: subDays(now, 1).toISOString(),
    preview:
      "What is Green Valley? Green Valley is a premium apartment development...",
    status: "completed",
  },
  {
    id: "6f7a8b9c-0d1e-4f2a-9b3c-4d5e6f7a8b04",
    title: "Social Media Posts - Ocean View",
    type: "social",
    projectName: "Ocean View Residency",
    location: "Bandra West, Mumbai",
    createdAt: subDays(now, 2).toISOString(),
    preview:
      "🏡 Introducing Ocean View Residency! ✨ Discover luxury living in Bandra West...",
    status: "completed",
  },
  {
    id: "6f7a8b9c-0d1e-4f2a-9b3c-4d5e6f7a8b05",
    title: "Property Copy - Royal Gardens",
    type: "copy",
    projectName: "Royal Gardens",
    location: "Powai, Mumbai",
    createdAt: subDays(now, 3).toISOString(),
    preview:
      "Experience premium living at Royal Gardens, Powai's newest landmark...",
    status: "completed",
  },
  {
    id: "6f7a8b9c-0d1e-4f2a-9b3c-4d5e6f7a8b06",
    title: "WhatsApp Campaign - Sunset Heights",
    type: "whatsapp",
    projectName: "Sunset Heights",
    location: "Goregaon East, Mumbai",
    createdAt: subDays(now, 5).toISOString(),
    preview:
      "Hi {name}! We have an exclusive limited-time offer on Sunset Heights!",
    status: "completed",
  },
  {
    id: "6f7a8b9c-0d1e-4f2a-9b3c-4d5e6f7a8b07",
    title: "FAQ - Emerald Towers",
    type: "faq",
    projectName: "Emerald Towers",
    location: "Kandivali West, Mumbai",
    createdAt: subDays(now, 7).toISOString(),
    preview:
      "What is Emerald Towers? Emerald Towers is a premium villa development...",
    status: "completed",
  },
]

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_GENERATIONS: Array<Generation> = SEED_GENERATIONS.map(
  (generation) => ({ ...generation, content: generation.preview })
)
