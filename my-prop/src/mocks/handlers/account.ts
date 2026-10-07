// Stateful handlers for the "account" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { currentUser } from "../session"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  Error as ErrorBody,
  NotificationPreferences,
  NotificationPreferencesUpdate,
  Profile,
  ProfileUpdate,
} from "@/api/generated/model"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "company",
  "phone",
] as const
const PREFERENCE_FIELDS = [
  "newLeads",
  "campaigns",
  "whatsapp",
  "weeklyReports",
] as const

export const accountHandlers = [
  http.get<never, never, Profile>(apiPath("/me"), async ({ request }) => {
    await delay()
    return HttpResponse.json(currentUser(request))
  }),

  http.patch<never, never, Profile | ErrorBody>(
    apiPath("/me"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      const patch: ProfileUpdate = {}
      for (const field of PROFILE_FIELDS) {
        const value = body[field]
        if (value === undefined) continue
        if (typeof value !== "string")
          return errorResponse(422, `${field} must be a string.`)
        patch[field] = value.trim()
      }
      if (patch.firstName === "" || patch.lastName === "")
        return errorResponse(422, "First and last name are required.")
      if (patch.email !== undefined && !EMAIL_RE.test(patch.email))
        return errorResponse(422, "Enter a valid email address.")
      const me = currentUser(request)
      if (
        patch.email &&
        db.users.all().some((u) => u.email === patch.email && u.id !== me.id)
      )
        return errorResponse(422, "Another account uses that email.")
      const updated = db.users.update(me.id, patch) ?? { ...me, ...patch }
      return HttpResponse.json(updated)
    }
  ),

  http.get<never, never, NotificationPreferences>(
    apiPath("/me/notification-preferences"),
    async () => {
      await delay()
      return HttpResponse.json(db.notificationPreferences.get())
    }
  ),

  http.patch<never, never, NotificationPreferences | ErrorBody>(
    apiPath("/me/notification-preferences"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      const patch: NotificationPreferencesUpdate = {}
      for (const field of PREFERENCE_FIELDS) {
        const value = body[field]
        if (value === undefined) continue
        if (typeof value !== "boolean")
          return errorResponse(422, `${field} must be true or false.`)
        patch[field] = value
      }
      return HttpResponse.json(db.notificationPreferences.update(patch))
    }
  ),

  // There's no real auth yet, so any current password is accepted.
  http.post<never, never, ErrorBody | null>(
    apiPath("/me/password"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      const { currentPassword, newPassword } = body
      if (typeof currentPassword !== "string" || !currentPassword)
        return errorResponse(422, "Enter your current password.")
      if (typeof newPassword !== "string" || newPassword.length < 8)
        return errorResponse(422, "New password must be at least 8 characters.")
      if (newPassword === currentPassword)
        return errorResponse(
          422,
          "New password must be different from the current one."
        )
      return new HttpResponse(null, { status: 204 })
    }
  ),
]
