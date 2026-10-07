import { describe, expect, it } from "vitest"

import {
  deleteNotification,
  listNotifications,
  markAllNotificationsRead,
  updateNotification,
} from "@/api/generated/notifications/notifications"
import { DEMO_NOTIFICATIONS } from "@/components/app-shell/notifications-data"

describe("notifications mock API", () => {
  it("lists newest first, marks read, marks all read and deletes", async () => {
    const list = await listNotifications()
    expect(list.map((n) => n.id)).toEqual(DEMO_NOTIFICATIONS.map((n) => n.id))

    const id = DEMO_NOTIFICATIONS[0].id
    expect((await updateNotification(id, { read: true })).read).toBe(true)
    await markAllNotificationsRead()
    expect((await listNotifications()).every((n) => n.read)).toBe(true)

    await deleteNotification(id)
    await expect(deleteNotification(id)).rejects.toMatchObject({ status: 404 })
  })
})
