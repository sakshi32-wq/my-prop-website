import { addDays, format, isPast, isToday, isTomorrow } from "date-fns"
import { MailIcon, MessageSquareIcon, SmartphoneIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Channel = "WhatsApp" | "Email" | "SMS"
export type CampaignStatus = "active" | "paused" | "scheduled"
export type ScheduleType = "immediate" | "scheduled" | "recurring" | "triggered"
export type Frequency = "daily" | "weekly" | "monthly"

/** Everything the user can edit about a campaign. */
export type CampaignDraft = {
  name: string
  objective: string
  type: Channel
  audience: string[]
  subject: string
  message: string
  aiTone: string
  scheduleType: ScheduleType
  scheduleDate?: Date
  scheduleTime: string
  frequency: Frequency
  triggerEvent: string
}

export type Campaign = CampaignDraft & {
  id: number
  status: CampaignStatus
  sent: number
  delivered: number
  read: number
  replied: number
  leads: number
}

export const CHANNELS: {
  value: Channel
  label: string
  description: string
  icon: LucideIcon
}[] = [
  {
    value: "WhatsApp",
    label: "WhatsApp",
    description: "High engagement rate",
    icon: MessageSquareIcon,
  },
  {
    value: "Email",
    label: "Email",
    description: "Professional reach",
    icon: MailIcon,
  },
  {
    value: "SMS",
    label: "SMS",
    description: "Instant delivery",
    icon: SmartphoneIcon,
  },
]

export function channelIcon(type: Channel): LucideIcon {
  return CHANNELS.find((c) => c.value === type)?.icon ?? MessageSquareIcon
}

export const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "scheduled", label: "Scheduled" },
]

export const OBJECTIVES = [
  { value: "awareness", label: "Brand Awareness" },
  { value: "leads", label: "Generate Leads" },
  { value: "sitevisit", label: "Drive Site Visits" },
  { value: "conversion", label: "Boost Conversions" },
  { value: "nurture", label: "Lead Nurturing" },
]

export const AUDIENCE_SEGMENTS = [
  { id: "all", name: "All Leads", count: 1247 },
  { id: "hot", name: "Hot Leads", count: 234 },
  { id: "warm", name: "Warm Leads", count: 456 },
  { id: "cold", name: "Cold Leads", count: 557 },
  { id: "skyline", name: "Skyline Heights Interested", count: 189 },
  { id: "green-valley", name: "Green Valley Interested", count: 156 },
]

const ALL_LEADS_COUNT = AUDIENCE_SEGMENTS[0].count

/** "All Leads" already contains every other segment, so never double count. */
export function estimateReach(audience: string[]) {
  if (audience.includes("all")) return ALL_LEADS_COUNT
  const sum = AUDIENCE_SEGMENTS.filter((s) => audience.includes(s.id)).reduce(
    (total, s) => total + s.count,
    0
  )
  return Math.min(sum, ALL_LEADS_COUNT)
}

export const MESSAGE_TEMPLATES = [
  {
    id: "launch",
    name: "New Launch Announcement",
    subject: "Introducing our newest project",
    content:
      "🏡 Exciting News, {name}!\n\nWe're launching our newest project, {project}, in {location}.\n\n• Early-bird launch pricing\n• Spacious 2, 3 & 4 BHK homes\n• World-class amenities\n\nReply YES to get the brochure and price list.",
  },
  {
    id: "visit",
    name: "Site Visit Invitation",
    subject: "Your exclusive site visit this weekend",
    content:
      "📍 Hi {name},\n\nSchedule your exclusive site visit to {project} this weekend. Our team will walk you through the show flat, amenities and payment plans.\n\nReply with a preferred time slot and we'll confirm it for you.",
  },
  {
    id: "offer",
    name: "Limited Offer",
    subject: "Limited time offer on select units",
    content:
      "⚡ Limited time offer, {name}!\n\nGet special pricing on select units at {project}. This offer is valid only until the end of the month.\n\nReply OFFER to know more or call us to block your unit.",
  },
  {
    id: "followup",
    name: "Follow-up Message",
    subject: "Following up on your enquiry",
    content:
      "👋 Hi {name}, following up on your recent inquiry about {project}.\n\nDo you have any questions about the floor plans, pricing or location? I'd be happy to help.\n\nReply anytime, we're here for you.",
  },
]

export const AI_TONE_OPTIONS = [
  { value: "friendly", label: "Friendly & Approachable" },
  { value: "professional", label: "Professional & Formal" },
  { value: "urgent", label: "Urgent & Action-Oriented" },
  { value: "luxury", label: "Luxury & Premium" },
]

const TONE_OPENERS: Record<string, string> = {
  friendly: "Hi {name}! 👋",
  professional: "Dear {name},",
  urgent: "{name}, don't miss out! ⏰",
  luxury: "Dear {name}, an exclusive invitation awaits.",
}

export function generateAiMessage(tone: string) {
  const opener = TONE_OPENERS[tone] ?? TONE_OPENERS.friendly
  return `${opener}\n\nWe're excited to share some amazing opportunities with you at our latest property project.\n\n🏡 Key Highlights:\n• Prime location with excellent connectivity\n• World-class amenities\n• Special launch offers available\n\nWould you like to schedule a site visit this weekend?\n\nReply YES to confirm or call us at +91-XXXXXXXXXX\n\nTeam myprop.live`
}

export const TRIGGER_EVENTS = [
  { value: "new-lead", label: "New Lead Added" },
  { value: "form-submit", label: "Form Submission" },
  { value: "site-visit", label: "After Site Visit" },
  { value: "no-response", label: "No Response in 3 Days" },
  { value: "stage-change", label: "Pipeline Stage Change" },
]

export const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

export function labelOf(
  list: readonly { value: string; label: string }[],
  value: string
) {
  return list.find((item) => item.value === value)?.label
}

export function pct(part: number, whole: number) {
  return whole > 0 ? (part / whole) * 100 : 0
}

export function formatPct(part: number, whole: number) {
  return `${pct(part, whole).toFixed(1)}%`
}

/** Combines a calendar date with an "HH:mm" string. */
export function combineDateTime(date: Date | undefined, time: string) {
  if (!date) return undefined
  const [h = "0", m = "0"] = time.split(":")
  const result = new Date(date)
  result.setHours(Number(h), Number(m), 0, 0)
  return result
}

function formatTime(time: string) {
  const date = combineDateTime(new Date(), time || "00:00")
  return date ? format(date, "h:mm a") : time
}

export function describeSchedule(draft: CampaignDraft) {
  switch (draft.scheduleType) {
    case "immediate":
      return "Send immediately"
    case "scheduled": {
      const at = combineDateTime(draft.scheduleDate, draft.scheduleTime)
      if (!at) return "Date not set"
      if (isToday(at)) return `Today at ${format(at, "h:mm a")}`
      if (isTomorrow(at)) return `Tomorrow at ${format(at, "h:mm a")}`
      return format(at, "MMM d, yyyy 'at' h:mm a")
    }
    case "recurring": {
      const freq = labelOf(FREQUENCIES, draft.frequency) ?? "Daily"
      const time = draft.scheduleTime
        ? ` at ${formatTime(draft.scheduleTime)}`
        : ""
      return `${freq}${time}`
    }
    case "triggered":
      return `Trigger: ${labelOf(TRIGGER_EVENTS, draft.triggerEvent) ?? "Not set"}`
  }
}

export function scheduleLabel(campaign: Campaign) {
  if (campaign.status === "paused") return "Paused"
  if (campaign.status === "active" && campaign.scheduleType === "immediate")
    return "Running now"
  return describeSchedule(campaign)
}

/** Status a campaign gets when it is launched or resumed. */
export function statusFor(draft: CampaignDraft): CampaignStatus {
  if (draft.scheduleType !== "scheduled") return "active"
  const at = combineDateTime(draft.scheduleDate, draft.scheduleTime)
  return at && !isPast(at) ? "scheduled" : "active"
}

export function emptyDraft(): CampaignDraft {
  return {
    name: "",
    objective: "",
    type: "WhatsApp",
    audience: [],
    subject: "",
    message: "",
    aiTone: "friendly",
    scheduleType: "immediate",
    scheduleDate: undefined,
    scheduleTime: "10:00",
    frequency: "daily",
    triggerEvent: "",
  }
}

export type DraftErrors = Partial<Record<keyof CampaignDraft, string>>

export function validateBasics(d: CampaignDraft): DraftErrors {
  const errors: DraftErrors = {}
  if (!d.name.trim()) errors.name = "Campaign name is required."
  else if (d.name.trim().length > 80)
    errors.name = "Keep the name under 80 characters."
  return errors
}

export function validateAudience(d: CampaignDraft): DraftErrors {
  return d.audience.length === 0
    ? { audience: "Select at least one audience segment." }
    : {}
}

export function validateMessage(d: CampaignDraft): DraftErrors {
  const errors: DraftErrors = {}
  if (d.type === "Email" && !d.subject.trim())
    errors.subject = "Email subject is required."
  if (!d.message.trim()) errors.message = "Message content is required."
  return errors
}

export function validateSchedule(d: CampaignDraft): DraftErrors {
  const errors: DraftErrors = {}
  if (d.scheduleType === "scheduled") {
    if (!d.scheduleDate) errors.scheduleDate = "Pick a date."
    if (!d.scheduleTime) errors.scheduleTime = "Pick a time."
    const at = combineDateTime(d.scheduleDate, d.scheduleTime)
    if (at && d.scheduleTime && isPast(at))
      errors.scheduleTime = "Choose a time in the future."
  }
  if (d.scheduleType === "recurring" && !d.scheduleTime)
    errors.scheduleTime = "Pick a time."
  if (d.scheduleType === "triggered" && !d.triggerEvent)
    errors.triggerEvent = "Choose a trigger event."
  return errors
}

export function createMockCampaigns(): Campaign[] {
  const base = emptyDraft()
  return [
    {
      ...base,
      id: 1,
      name: "Skyline Heights Launch",
      objective: "leads",
      type: "WhatsApp",
      status: "active",
      audience: ["hot", "skyline"],
      message: MESSAGE_TEMPLATES[0].content,
      scheduleType: "immediate",
      sent: 1245,
      delivered: 1198,
      read: 892,
      replied: 234,
      leads: 45,
    },
    {
      ...base,
      id: 2,
      name: "Green Valley Promotion",
      objective: "awareness",
      type: "Email",
      status: "active",
      audience: ["warm", "green-valley"],
      subject: "Green Valley: limited time offer on select units",
      message: MESSAGE_TEMPLATES[2].content,
      scheduleType: "recurring",
      frequency: "daily",
      scheduleTime: "10:00",
      sent: 3456,
      delivered: 3289,
      read: 1456,
      replied: 89,
      leads: 28,
    },
    {
      ...base,
      id: 3,
      name: "Marina Bay Follow-up",
      objective: "nurture",
      type: "WhatsApp",
      status: "paused",
      audience: ["all"],
      message: MESSAGE_TEMPLATES[3].content,
      scheduleType: "triggered",
      triggerEvent: "no-response",
      sent: 567,
      delivered: 542,
      read: 398,
      replied: 156,
      leads: 32,
    },
    {
      ...base,
      id: 4,
      name: "Weekend Site Visit",
      objective: "sitevisit",
      type: "Email",
      status: "scheduled",
      audience: ["hot", "warm"],
      subject: "Your exclusive site visit this weekend",
      message: MESSAGE_TEMPLATES[1].content,
      scheduleType: "scheduled",
      scheduleDate: addDays(new Date(), 1),
      scheduleTime: "09:00",
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      leads: 0,
    },
  ]
}
