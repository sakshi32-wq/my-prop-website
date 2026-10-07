import { subHours, subMinutes } from "date-fns"
import {
  CircleAlertIcon,
  GlobeIcon,
  MessageSquareIcon,
  SendIcon,
  TrendingUpIcon,
  UserPlusIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { Notification, NotificationType } from "@/api/generated/model"

export type { Notification, NotificationType } from "@/api/generated/model"

export const NOTIFICATION_ICONS: Record<NotificationType, LucideIcon> = {
  lead: UserPlusIcon,
  campaign: SendIcon,
  website: GlobeIcon,
  alert: CircleAlertIcon,
  message: MessageSquareIcon,
  milestone: TrendingUpIcon,
}

const now = new Date()

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_NOTIFICATIONS: Array<Notification> = [
  {
    id: "4d5e6f70-8192-4a3b-9c4d-5e6f7a8b9c01",
    type: "lead",
    title: "New Lead Captured",
    message: "Rahul Sharma submitted an inquiry for Skyline Heights",
    read: false,
    createdAt: subMinutes(now, 2).toISOString(),
  },
  {
    id: "4d5e6f70-8192-4a3b-9c4d-5e6f7a8b9c02",
    type: "campaign",
    title: "Campaign Launched",
    message: "Your WhatsApp campaign 'Marina Bay Launch' is now live",
    read: false,
    createdAt: subMinutes(now, 15).toISOString(),
  },
  {
    id: "4d5e6f70-8192-4a3b-9c4d-5e6f7a8b9c03",
    type: "website",
    title: "Website Published",
    message: "Green Valley Residency website is now live",
    read: false,
    createdAt: subHours(now, 1).toISOString(),
  },
  {
    id: "4d5e6f70-8192-4a3b-9c4d-5e6f7a8b9c04",
    type: "alert",
    title: "Low Response Rate",
    message: "Your Ocean View campaign has below average engagement",
    read: true,
    createdAt: subHours(now, 2).toISOString(),
  },
  {
    id: "4d5e6f70-8192-4a3b-9c4d-5e6f7a8b9c05",
    type: "message",
    title: "Message Received",
    message: "You have 3 new WhatsApp messages from leads",
    read: true,
    createdAt: subHours(now, 3).toISOString(),
  },
  {
    id: "4d5e6f70-8192-4a3b-9c4d-5e6f7a8b9c06",
    type: "milestone",
    title: "Conversion Milestone",
    message: "Congratulations! You've reached 100 conversions this month",
    read: true,
    createdAt: subHours(now, 5).toISOString(),
  },
]
