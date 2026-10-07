import { HttpResponse, http } from "msw"
import { screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ProfileTab } from "./profile-tab"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithClient } from "@/test/render"

describe("ProfileTab", () => {
  it("loads the profile and preferences from the API", async () => {
    db.profile.update({ company: "Seeded Realty" })
    renderWithClient(<ProfileTab />)

    expect(screen.getByLabelText("Loading profile")).toBeInTheDocument()
    expect(await screen.findByDisplayValue("Seeded Realty")).toBeVisible()
    expect(
      await screen.findByRole("switch", { name: "Weekly Reports" })
    ).not.toBeChecked()
    expect(
      screen.getByRole("switch", { name: "New Lead Notifications" })
    ).toBeChecked()
  })

  it("saves profile changes", async () => {
    const { user } = renderWithClient(<ProfileTab />)
    const first = await screen.findByLabelText("First Name")

    await user.clear(first)
    await user.type(first, "Jane")
    await user.click(screen.getByRole("button", { name: /Save Changes/ }))

    expect(await screen.findByText("Profile updated")).toBeVisible()
    expect(db.profile.get().firstName).toBe("Jane")
  })

  it("toggles a preference optimistically", async () => {
    const request = gate()
    server.use(
      http.patch(apiPath("/me/notification-preferences"), request.resolver)
    )
    const { user } = renderWithClient(<ProfileTab />)
    const weekly = await screen.findByRole("switch", { name: "Weekly Reports" })

    await user.click(weekly)
    await waitFor(() => expect(weekly).toBeChecked())
    expect(screen.queryByText("Weekly Reports enabled")).toBeNull()

    request.release()
    expect(await screen.findByText("Weekly Reports enabled")).toBeVisible()
    expect(db.notificationPreferences.get().weeklyReports).toBe(true)
  })

  it("rolls a preference back when saving fails", async () => {
    server.use(
      http.patch(apiPath("/me/notification-preferences"), () =>
        HttpResponse.json({ message: "Try again later." }, { status: 503 })
      )
    )
    const { user } = renderWithClient(<ProfileTab />)
    const campaigns = await screen.findByRole("switch", {
      name: "Campaign Updates",
    })

    await user.click(campaigns)
    expect(await screen.findByText("Try again later.")).toBeVisible()
    await waitFor(() => expect(campaigns).toBeChecked())
    expect(db.notificationPreferences.get().campaigns).toBe(true)
  })

  it("changes the password and clears the form", async () => {
    const { user } = renderWithClient(<ProfileTab />)
    await screen.findByLabelText("First Name")

    await user.type(screen.getByLabelText("Current Password"), "old-password")
    await user.type(screen.getByLabelText("New Password"), "new-password-1")
    await user.type(
      screen.getByLabelText("Confirm New Password"),
      "new-password-1"
    )
    await user.click(screen.getByRole("button", { name: /Update Password/ }))

    expect(await screen.findByText("Password updated")).toBeVisible()
    expect(screen.getByLabelText("Current Password")).toHaveValue("")
  })

  it("shows an error with Retry when the profile fails to load", async () => {
    server.use(
      http.get(
        apiPath("/me"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<ProfileTab />)

    expect(await screen.findByText("Couldn't load your profile")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByDisplayValue("John")).toBeVisible()
  })
})
