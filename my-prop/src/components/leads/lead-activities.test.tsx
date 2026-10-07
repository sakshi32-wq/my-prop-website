import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { DEMO_LEADS } from "./data"
import { LeadsPage } from "./leads-page"
import { db } from "@/mocks/db"
import { renderWithClient } from "@/test/render"

const AMIT = DEMO_LEADS[2] // "contacted", added a day ago
const sheet = () =>
  screen
    .getAllByRole("dialog")
    .find((d) => within(d).queryByText("Activity Timeline"))!

async function openAmit(user: ReturnType<typeof renderWithClient>["user"]) {
  await user.click(
    await screen.findByRole("button", { name: `Open ${AMIT.name}` })
  )
  return within(sheet())
}

describe("lead activities", () => {
  it("shows the timeline from the API", async () => {
    const { user } = renderWithClient(<LeadsPage />)
    const panel = await openAmit(user)

    expect(
      await panel.findByText("Lead captured via Social Media")
    ).toBeVisible()
    expect(panel.getByText("WhatsApp message sent")).toBeVisible()
    expect(panel.getByText("Email follow-up sent")).toBeVisible()
  })

  it("logs a call on the timeline", async () => {
    const { user } = renderWithClient(<LeadsPage />)
    const panel = await openAmit(user)
    await panel.findByText("Lead captured via Social Media")

    await user.click(panel.getByRole("button", { name: /Call/ }))
    const dialog = await screen.findByRole("dialog", { name: "Call Lead" })
    await user.click(
      within(dialog).getByRole("button", { name: "Log a Past Call" })
    )
    await user.click(within(dialog).getByLabelText(/Call Outcome/))
    await user.click(
      await screen.findByRole("option", { name: "Interested - Will Visit" })
    )
    await user.click(
      within(dialog).getByRole("button", { name: /Save Call Log/ })
    )

    expect(await screen.findByText("Call log saved")).toBeVisible()
    expect(
      await panel.findByText("Call logged: Interested - Will Visit")
    ).toBeVisible()
  })

  it("schedules a visit and the server moves the lead along", async () => {
    const { user } = renderWithClient(<LeadsPage />)
    const panel = await openAmit(user)
    await panel.findByText("Lead captured via Social Media")

    await user.click(panel.getByRole("button", { name: /Schedule/ }))
    const dialog = await screen.findByRole("dialog", {
      name: "Schedule Site Visit",
    })
    await user.click(within(dialog).getByLabelText(/Visit Date/))
    const grid = await screen.findByRole("grid")
    const days = within(grid)
      .getAllByRole("button")
      .filter((day) => !day.hasAttribute("disabled"))
    await user.click(days[days.length - 1])
    await user.type(within(dialog).getByLabelText(/Visit Time/), "11:30")
    await user.click(
      within(dialog).getByRole("button", { name: /Schedule Visit/ })
    )

    expect(await screen.findByText("Site visit scheduled")).toBeVisible()
    await waitFor(() => expect(db.leads.find(AMIT.id)?.stage).toBe("scheduled"))
    expect(
      await within(
        // The open sheet hides the board from the accessibility tree.
        screen.getByRole("region", {
          name: "Site Visit Scheduled",
          hidden: true,
        })
      ).findByText(AMIT.name)
    ).toBeVisible()
    expect(
      await panel.findByText("Moved to Site Visit Scheduled")
    ).toBeVisible()
  })

  it("records a WhatsApp message while opening WhatsApp", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null)
    const { user } = renderWithClient(<LeadsPage />)
    const panel = await openAmit(user)
    await panel.findByText("Lead captured via Social Media")

    await user.click(panel.getByRole("button", { name: /Send via WhatsApp/ }))
    const dialog = await screen.findByRole("dialog", {
      name: "Send WhatsApp Message",
    })
    await user.click(within(dialog).getByRole("button", { name: /Send/ }))

    expect(open).toHaveBeenCalledWith(
      expect.stringContaining("https://wa.me/919876543212"),
      "_blank",
      "noopener,noreferrer"
    )
    await waitFor(() =>
      expect(
        db.leadActivities
          .all()
          .filter((a) => a.leadId === AMIT.id && a.type === "whatsapp")
      ).toHaveLength(2)
    )
    open.mockRestore()
  })
})
