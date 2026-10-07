import {
  Code2Icon,
  FileTextIcon,
  GlobeIcon,
  MessageSquareIcon,
  Share2Icon,
  Wand2Icon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type ToolId =
  "webpage" | "website" | "copy" | "whatsapp" | "social" | "faq"

/** Tools that use the shared content form and produce text output. */
export type ContentToolId = "copy" | "whatsapp" | "social" | "faq"

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

export type ContentFormData = {
  projectName: string
  location: string
  propertyType: string
  tone: string
  features: string
  targetAudience: string
  platform: string
  numPosts: string
  campaignGoal: string
}

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

export type Generation = {
  id: string
  title: string
  type: ToolId
  projectName: string
  location: string
  timestamp: string
  date: string
  preview: string
  /** Full text of the generation. Falls back to `preview` when missing. */
  content?: string
  status: "completed" | "draft"
}

export const INITIAL_GENERATIONS: Array<Generation> = [
  {
    id: "1",
    title: "Skyline Heights Copy",
    type: "copy",
    projectName: "Skyline Heights",
    location: "Andheri West, Mumbai",
    timestamp: "2 hours ago",
    date: "Feb 20, 2026 - 2:30 PM",
    preview:
      "Welcome to Skyline Heights - Where Luxury Meets Comfort in the Heart of Andheri West, Mumbai",
    status: "completed",
  },
  {
    id: "2",
    title: "WhatsApp Campaign - Marina Bay",
    type: "whatsapp",
    projectName: "Marina Bay",
    location: "Worli, Mumbai",
    timestamp: "5 hours ago",
    date: "Feb 20, 2026 - 11:00 AM",
    preview:
      "Hi {name}! 👋 Exciting news! We're launching Marina Bay in Worli, Mumbai...",
    status: "completed",
  },
  {
    id: "3",
    title: "FAQ Generation - Green Valley",
    type: "faq",
    projectName: "Green Valley",
    location: "Thane, Mumbai",
    timestamp: "1 day ago",
    date: "Feb 19, 2026 - 4:15 PM",
    preview:
      "What is Green Valley? Green Valley is a premium apartment development...",
    status: "completed",
  },
  {
    id: "4",
    title: "Social Media Posts - Ocean View",
    type: "social",
    projectName: "Ocean View Residency",
    location: "Bandra West, Mumbai",
    timestamp: "2 days ago",
    date: "Feb 18, 2026 - 10:00 AM",
    preview:
      "🏡 Introducing Ocean View Residency! ✨ Discover luxury living in Bandra West...",
    status: "completed",
  },
  {
    id: "5",
    title: "Property Copy - Royal Gardens",
    type: "copy",
    projectName: "Royal Gardens",
    location: "Powai, Mumbai",
    timestamp: "3 days ago",
    date: "Feb 17, 2026 - 3:45 PM",
    preview:
      "Experience premium living at Royal Gardens, Powai's newest landmark...",
    status: "completed",
  },
  {
    id: "6",
    title: "WhatsApp Campaign - Sunset Heights",
    type: "whatsapp",
    projectName: "Sunset Heights",
    location: "Goregaon East, Mumbai",
    timestamp: "5 days ago",
    date: "Feb 15, 2026 - 1:20 PM",
    preview:
      "Hi {name}! We have an exclusive limited-time offer on Sunset Heights!",
    status: "completed",
  },
  {
    id: "7",
    title: "FAQ - Emerald Towers",
    type: "faq",
    projectName: "Emerald Towers",
    location: "Kandivali West, Mumbai",
    timestamp: "1 week ago",
    date: "Feb 13, 2026 - 9:30 AM",
    preview:
      "What is Emerald Towers? Emerald Towers is a premium villa development...",
    status: "completed",
  },
]
