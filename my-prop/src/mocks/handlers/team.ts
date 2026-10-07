// Stateful handlers for the "team" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  Error as ErrorBody,
  TeamInvitableRole,
  TeamMember,
} from "@/api/generated/model"

const INVITABLE_ROLES: Array<TeamInvitableRole> = ["Admin", "Agent"]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type MemberParams = { memberId: string }

function parseRole(body: Record<string, unknown>) {
  return INVITABLE_ROLES.includes(body.role as TeamInvitableRole)
    ? (body.role as TeamInvitableRole)
    : undefined
}

export const teamHandlers = [
  http.get<never, never, Array<TeamMember>>(
    apiPath("/team/members"),
    async () => {
      await delay()
      const members = db.teamMembers
        .all()
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
      return HttpResponse.json(members)
    }
  ),

  http.post<never, never, TeamMember | ErrorBody>(
    apiPath("/team/members"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      const email =
        typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
      if (!EMAIL_RE.test(email))
        return errorResponse(422, "Enter a valid email address.")
      const role = parseRole(body)
      if (!role) return errorResponse(422, "role must be Admin or Agent.")
      if (db.teamMembers.all().some((m) => m.email === email))
        return errorResponse(422, "This person is already on your team.")

      const member = db.teamMembers.insert({
        id: crypto.randomUUID(),
        name: email.split("@")[0] ?? email,
        email,
        role,
        status: "invited",
        createdAt: new Date().toISOString(),
      })
      return HttpResponse.json(member, { status: 201 })
    }
  ),

  http.get<MemberParams, never, TeamMember | ErrorBody>(
    apiPath("/team/members/:memberId"),
    async ({ params }) => {
      await delay()
      const member = db.teamMembers.find(params.memberId)
      if (!member) return errorResponse(404, "Member not found.")
      return HttpResponse.json(member)
    }
  ),

  http.patch<MemberParams, never, TeamMember | ErrorBody>(
    apiPath("/team/members/:memberId"),
    async ({ params, request }) => {
      await delay()
      const member = db.teamMembers.find(params.memberId)
      if (!member) return errorResponse(404, "Member not found.")
      if (member.role === "Owner")
        return errorResponse(422, "The owner's role can't be changed.")
      const body = await readJson(request)
      const role = isRecord(body) ? parseRole(body) : undefined
      if (!role) return errorResponse(422, "role must be Admin or Agent.")
      const updated = db.teamMembers.update(params.memberId, { role })
      if (!updated) return errorResponse(404, "Member not found.")
      return HttpResponse.json(updated)
    }
  ),

  http.delete<MemberParams, never, ErrorBody | null>(
    apiPath("/team/members/:memberId"),
    async ({ params }) => {
      await delay()
      const member = db.teamMembers.find(params.memberId)
      if (!member) return errorResponse(404, "Member not found.")
      if (member.role === "Owner")
        return errorResponse(422, "The workspace owner can't be removed.")
      db.teamMembers.remove(params.memberId)
      return new HttpResponse(null, { status: 204 })
    }
  ),
]
