import { subDays } from "date-fns"

import type { TeamMember } from "@/api/generated/model"

export type {
  TeamInvitableRole as InvitableRole,
  TeamMember,
  TeamMemberInvite,
  TeamRole,
} from "@/api/generated/model"

const now = new Date()

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_TEAM_MEMBERS: Array<TeamMember> = [
  {
    id: "6c1f0d2e-8a3b-4c5d-9e6f-7a8b9c0d1e01",
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    status: "active",
    createdAt: subDays(now, 120).toISOString(),
  },
  {
    id: "6c1f0d2e-8a3b-4c5d-9e6f-7a8b9c0d1e02",
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Admin",
    status: "active",
    createdAt: subDays(now, 90).toISOString(),
  },
  {
    id: "6c1f0d2e-8a3b-4c5d-9e6f-7a8b9c0d1e03",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Agent",
    status: "active",
    createdAt: subDays(now, 60).toISOString(),
  },
  {
    id: "6c1f0d2e-8a3b-4c5d-9e6f-7a8b9c0d1e04",
    name: "Lisa Chen",
    email: "lisa@example.com",
    role: "Agent",
    status: "active",
    createdAt: subDays(now, 30).toISOString(),
  },
]
