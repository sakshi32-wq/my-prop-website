// Stateful handlers for the "notifications" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type { Error as ErrorBody, Notification } from "@/api/generated/model"

type NotificationParams = { notificationId: string }

const notFound = () => errorResponse(404, "Notification not found.")

export const notificationHandlers = [
  http.get<never, never, Array<Notification>>(
    apiPath("/notifications"),
    async () => {
      await delay()
      const notifications = db.notifications
        .all()
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      return HttpResponse.json(notifications)
    }
  ),

  http.post(apiPath("/notifications/read-all"), async () => {
    await delay()
    for (const n of db.notifications.all())
      if (!n.read) db.notifications.update(n.id, { read: true })
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch<NotificationParams, never, Notification | ErrorBody>(
    apiPath("/notifications/:notificationId"),
    async ({ params, request }) => {
      await delay()
      if (!db.notifications.find(params.notificationId)) return notFound()
      const body = await readJson(request)
      if (!isRecord(body) || typeof body.read !== "boolean")
        return errorResponse(422, "read must be true or false.")
      const updated = db.notifications.update(params.notificationId, {
        read: body.read,
      })
      return updated ? HttpResponse.json(updated) : notFound()
    }
  ),

  http.delete<NotificationParams, never, ErrorBody | null>(
    apiPath("/notifications/:notificationId"),
    async ({ params }) => {
      await delay()
      if (!db.notifications.remove(params.notificationId)) return notFound()
      return new HttpResponse(null, { status: 204 })
    }
  ),
]
