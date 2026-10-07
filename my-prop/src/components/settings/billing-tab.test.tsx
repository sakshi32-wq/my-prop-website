import { HttpResponse, http } from "msw"
import { screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { BillingTab } from "./billing-tab"
import { DEMO_INVOICES } from "./billing-data"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { renderWithClient } from "@/test/render"

describe("BillingTab", () => {
  it("shows the plan, live usage and invoices from the API", async () => {
    renderWithClient(<BillingTab />)

    expect(screen.getByLabelText("Loading billing")).toBeInTheDocument()
    expect(await screen.findByText("Growth Plan")).toBeVisible()
    // Websites usage counts the mock websites table.
    expect(screen.getByText(`${db.websites.all().length} / 15`)).toBeVisible()
    expect(await screen.findByText(DEMO_INVOICES[0].number)).toBeVisible()
  })

  it("cancels and resumes the subscription", async () => {
    const { user } = renderWithClient(<BillingTab />)
    await screen.findByText("Growth Plan")

    await user.click(
      screen.getByRole("button", { name: /Cancel Subscription/ })
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Cancel Subscription",
      })
    )
    expect(await screen.findByText("Subscription cancelled")).toBeVisible()
    expect(await screen.findByText("Will not renew")).toBeVisible()
    expect(db.subscription.get().status).toBe("cancelling")

    await user.click(
      screen.getByRole("button", { name: /Resume Subscription/ })
    )
    expect(await screen.findByText("Subscription resumed")).toBeVisible()
    expect(db.subscription.get().status).toBe("active")
  })

  it("sends an upgrade request", async () => {
    const { user } = renderWithClient(<BillingTab />)
    await user.click(
      await screen.findByRole("button", { name: /Upgrade Plan/ })
    )
    expect(await screen.findByText("Upgrade request received")).toBeVisible()
  })

  it("shows an error with Retry when the subscription fails to load", async () => {
    server.use(
      http.get(
        apiPath("/billing/subscription"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<BillingTab />)

    expect(
      await screen.findByText("Couldn't load your subscription")
    ).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("Growth Plan")).toBeVisible()
  })
})
