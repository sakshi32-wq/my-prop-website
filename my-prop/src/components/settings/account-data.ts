import type { NotificationPreferences, Profile } from "@/api/generated/model"

export type {
  NotificationPreferences,
  PasswordChange,
  Profile,
  ProfileUpdate,
} from "@/api/generated/model"

export const NOTIFICATION_OPTIONS = [
  {
    id: "newLeads",
    label: "New Lead Notifications",
    description: "Get notified when you receive a new lead",
  },
  {
    id: "campaigns",
    label: "Campaign Updates",
    description: "Receive updates on your campaign performance",
  },
  {
    id: "whatsapp",
    label: "WhatsApp Replies",
    description: "Get notified when leads reply via WhatsApp",
  },
  {
    id: "weeklyReports",
    label: "Weekly Reports",
    description: "Receive weekly performance summary emails",
  },
] as const satisfies ReadonlyArray<{
  id: keyof NotificationPreferences
  label: string
  description: string
}>

export function fullName(profile: Pick<Profile, "firstName" | "lastName">) {
  return `${profile.firstName} ${profile.lastName}`.trim()
}

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_PROFILE: Profile = {
  id: "0b9d8c7e-6f5a-4b3c-2d1e-0f9a8b7c6d50",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  company: "Acme Real Estate",
  phone: "+91 98765 43210",
}

export const DEMO_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  newLeads: true,
  campaigns: true,
  whatsapp: true,
  weeklyReports: false,
}
