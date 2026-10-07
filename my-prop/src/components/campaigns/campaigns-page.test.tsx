import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DEMO_CAMPAIGNS } from "./campaign-data"
import { CampaignsPage } from "./campaigns-page"
import type { Campaign } from "./campaign-data"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithClient } from "@/test/render"

const campaignItem = (name: string) =>
  screen.getByText(name).closest<HTMLElement>("[data-slot=item]")!

describe("CampaignsPage", () => {
  it("shows a skeleton, then campaigns from the API", async () => {
    const seeded: Campaign = {
      ...DEMO_CAMPAIGNS[0],
      id: "0f5e7c3a-1b2d-4e6f-8a9b-c0d1e2f3a4b5",
      name: "Seeded Campaign",
      createdAt: new Date().toISOString(),
    }
    db.campaigns.insert(seeded)

    renderWithClient(<CampaignsPage />)

    expect(screen.getByLabelText("Loading campaigns")).toBeInTheDocument()
    expect(await screen.findByText("Seeded Campaign")).toBeInTheDocument()
    expect(screen.getByText("5 campaigns · 3 active")).toBeInTheDocument()
  })

  it("creates a campaign through the wizard", async () => {
    const request = gate()
    server.use(http.post(apiPath("/campaigns"), request.resolver))
    const { user } = renderWithClient(<CampaignsPage />)
    await screen.findByText("Skyline Heights Launch")

    await user.click(screen.getByRole("button", { name: "Create Campaign" }))
    const dialog = await screen.findByRole("dialog")
    await user.type(
      within(dialog).getByLabelText("Campaign Name"),
      "Diwali Offer"
    )
    await user.click(within(dialog).getByRole("button", { name: /Next/ }))
    await user.click(
      within(dialog).getByRole("checkbox", { name: /Hot Leads/ })
    )
    await user.click(within(dialog).getByRole("button", { name: /Next/ }))
    await user.type(
      within(dialog).getByLabelText("Message Content"),
      "Festive pricing on all units."
    )
    await user.click(within(dialog).getByRole("button", { name: /Next/ }))
    await user.click(within(dialog).getByRole("button", { name: /Next/ }))
    await user.click(
      within(dialog).getByRole("button", { name: /Launch Campaign/ })
    )
    // The button shows as loading until the server answers.
    expect(
      within(dialog).getByRole("button", { name: /Launch Campaign/ })
    ).toBeDisabled()
    request.release()

    expect(await screen.findByText('"Diwali Offer" launched')).toBeVisible()
    expect(await screen.findByText("Diwali Offer")).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(
      db.campaigns.all().find((c) => c.name === "Diwali Offer")
    ).toMatchObject({ status: "active", audience: ["hot"], sent: 0 })
  })

  it("pauses a campaign optimistically", async () => {
    const request = gate()
    server.use(http.patch(apiPath("/campaigns/:campaignId"), request.resolver))
    const { user } = renderWithClient(<CampaignsPage />)
    await screen.findByText("Skyline Heights Launch")

    await user.click(
      within(campaignItem("Skyline Heights Launch")).getByRole("button", {
        name: "Pause campaign",
      })
    )

    expect(
      await within(campaignItem("Skyline Heights Launch")).findByRole(
        "button",
        { name: "Resume campaign" }
      )
    ).toBeInTheDocument()
    expect(screen.queryByText('"Skyline Heights Launch" paused')).toBeNull()

    request.release()
    expect(
      await screen.findByText('"Skyline Heights Launch" paused')
    ).toBeVisible()
    expect(db.campaigns.find(DEMO_CAMPAIGNS[0].id)?.status).toBe("paused")
  })

  it("rolls back a failed delete", async () => {
    server.use(
      http.delete(apiPath("/campaigns/:campaignId"), () =>
        HttpResponse.json({ message: "Campaign is sending." }, { status: 422 })
      )
    )
    const { user } = renderWithClient(<CampaignsPage />)
    await screen.findByText("Marina Bay Follow-up")

    await user.click(
      within(campaignItem("Marina Bay Follow-up")).getByRole("button", {
        name: "Delete campaign",
      })
    )
    await user.click(await screen.findByRole("button", { name: "Delete" }))

    expect(await screen.findByText("Campaign is sending.")).toBeVisible()
    await waitFor(() =>
      expect(screen.getByText("Marina Bay Follow-up")).toBeInTheDocument()
    )
    expect(db.campaigns.all()).toHaveLength(DEMO_CAMPAIGNS.length)
  })

  it("deletes a campaign", async () => {
    const { user } = renderWithClient(<CampaignsPage />)
    await screen.findByText("Marina Bay Follow-up")

    await user.click(
      within(campaignItem("Marina Bay Follow-up")).getByRole("button", {
        name: "Delete campaign",
      })
    )
    await user.click(await screen.findByRole("button", { name: "Delete" }))

    expect(
      await screen.findByText('"Marina Bay Follow-up" deleted')
    ).toBeVisible()
    expect(screen.queryByText("Marina Bay Follow-up")).not.toBeInTheDocument()
    expect(db.campaigns.find(DEMO_CAMPAIGNS[2].id)).toBeUndefined()
  })

  it("shows an error with Retry when the list fails", async () => {
    server.use(
      http.get(
        apiPath("/campaigns"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<CampaignsPage />)

    expect(
      await screen.findByText("Couldn't load campaigns")
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(
      await screen.findByText("Skyline Heights Launch")
    ).toBeInTheDocument()
  })
})
