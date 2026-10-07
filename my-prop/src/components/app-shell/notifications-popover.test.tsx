import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DEMO_NOTIFICATIONS } from "./notifications-data"
import { NotificationsPopover } from "./notifications-popover"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { renderWithClient } from "@/test/render"

const bell = () => screen.getByRole("button", { name: /Notifications/ })

async function openPopover(user: ReturnType<typeof renderWithClient>["user"]) {
  await waitFor(() => expect(bell()).toHaveTextContent("3"))
  await user.click(bell())
  return screen.findByRole("dialog")
}

describe("NotificationsPopover", () => {
  it("shows the unread count and list from the API", async () => {
    const { user } = renderWithClient(<NotificationsPopover />)
    const popover = await openPopover(user)

    expect(
      within(popover).getByText("You have 3 unread notifications")
    ).toBeVisible()
    expect(within(popover).getByText("New Lead Captured")).toBeVisible()
  })

  it("marks one and then all as read", async () => {
    const { user } = renderWithClient(<NotificationsPopover />)
    const popover = await openPopover(user)

    await user.click(
      within(popover).getAllByRole("button", { name: "Mark read" })[0]
    )
    await waitFor(() => expect(bell()).toHaveTextContent("2"))
    await waitFor(() =>
      expect(db.notifications.find(DEMO_NOTIFICATIONS[0].id)?.read).toBe(true)
    )

    await user.click(
      within(popover).getByRole("button", { name: /Mark all read/ })
    )
    expect(await within(popover).findByText("All caught up!")).toBeVisible()
    await waitFor(() =>
      expect(db.notifications.all().every((n) => n.read)).toBe(true)
    )
  })

  it("deletes a notification, and restores it if the server refuses", async () => {
    server.use(
      http.delete(
        apiPath("/notifications/:notificationId"),
        () => HttpResponse.json({ message: "Not allowed." }, { status: 403 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<NotificationsPopover />)
    const popover = await openPopover(user)
    const deleteFirst = () =>
      user.click(within(popover).getAllByRole("button", { name: "Delete" })[0])

    await deleteFirst()
    expect(await screen.findByText("Not allowed.")).toBeVisible()
    await waitFor(() =>
      expect(within(popover).getByText("New Lead Captured")).toBeVisible()
    )

    await deleteFirst()
    await waitFor(() =>
      expect(within(popover).queryByText("New Lead Captured")).toBeNull()
    )
    await waitFor(() =>
      expect(db.notifications.find(DEMO_NOTIFICATIONS[0].id)).toBeUndefined()
    )
  })

  it("shows an error with Retry when the list fails", async () => {
    server.use(
      http.get(
        apiPath("/notifications"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<NotificationsPopover />)
    await user.click(bell())

    expect(await screen.findByText("Couldn't load notifications")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("New Lead Captured")).toBeVisible()
  })
})
