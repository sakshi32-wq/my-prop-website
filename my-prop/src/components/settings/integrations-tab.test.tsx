import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { IntegrationsTab } from "./integrations-tab"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithClient } from "@/test/render"

const item = (name: string) =>
  screen.getByText(name).closest<HTMLElement>("[data-slot=item]")!

describe("IntegrationsTab", () => {
  it("shows a skeleton, then connection state from the API", async () => {
    renderWithClient(<IntegrationsTab />)

    expect(screen.getByLabelText("Loading integrations")).toBeInTheDocument()
    await screen.findByText("WhatsApp Business API")
    expect(
      within(item("WhatsApp Business API")).getByText("Active")
    ).toBeVisible()
    expect(within(item("Gmail")).getByText("Not connected")).toBeVisible()
    expect(
      screen.getByLabelText<HTMLInputElement>("WhatsApp Business Number").value
    ).toBe("+91 98765 43210")
  })

  it("connects an integration", async () => {
    const request = gate()
    server.use(
      http.post(
        apiPath("/integrations/:integrationId/connect"),
        request.resolver
      )
    )
    const { user } = renderWithClient(<IntegrationsTab />)

    await user.click(
      await screen.findByRole("button", { name: "Connect Gmail" })
    )
    expect(screen.getByRole("button", { name: "Connect Gmail" })).toBeDisabled()
    expect(screen.getByText("Connecting...")).toBeVisible()

    request.release()
    expect(await screen.findByText("Gmail connected")).toBeVisible()
    expect(
      await screen.findByRole("button", { name: "Disconnect Gmail" })
    ).toBeVisible()
    expect(db.integrations.find("gmail")?.connected).toBe(true)
  })

  it("disconnects optimistically, and Undo reconnects", async () => {
    const request = gate()
    server.use(
      http.post(
        apiPath("/integrations/:integrationId/disconnect"),
        request.resolver
      )
    )
    const { user } = renderWithClient(<IntegrationsTab />)

    await user.click(
      await screen.findByRole("button", { name: "Disconnect Twilio SMS" })
    )
    // Settings hide right away; the toast waits for the server.
    await waitFor(() =>
      expect(screen.queryByLabelText("Account SID")).not.toBeInTheDocument()
    )
    expect(screen.queryByText("Twilio SMS disconnected")).toBeNull()

    request.release()
    expect(await screen.findByText("Twilio SMS disconnected")).toBeVisible()
    expect(db.integrations.find("twilio")?.connected).toBe(false)

    await user.click(screen.getByRole("button", { name: "Undo" }))
    expect(await screen.findByText("Twilio SMS connected")).toBeVisible()
    expect(await screen.findByLabelText("Account SID")).toBeVisible()
    expect(db.integrations.find("twilio")).toMatchObject({
      connected: true,
      settings: { sid: "AC-demo-sid-not-real-5f3e" },
    })
  })

  it("saves and tests settings", async () => {
    const { user } = renderWithClient(<IntegrationsTab />)
    const number = await screen.findByLabelText("WhatsApp Business Number")

    await user.clear(number)
    await user.type(number, "+91 90000 11111")
    const card = number.closest<HTMLElement>("[data-slot=card]")!
    await user.click(within(card).getByRole("button", { name: "Save" }))
    expect(
      await screen.findByText("WhatsApp Business API settings saved")
    ).toBeVisible()
    expect(db.integrations.find("whatsapp")?.settings.number).toBe(
      "+91 90000 11111"
    )

    await user.click(
      within(card).getByRole("button", { name: /Test Connection/ })
    )
    expect(await screen.findByText("Connection successful")).toBeVisible()
  })

  it("shows an error with Retry when the list fails", async () => {
    server.use(
      http.get(
        apiPath("/integrations"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<IntegrationsTab />)

    expect(await screen.findByText("Couldn't load integrations")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("WhatsApp Business API")).toBeVisible()
  })
})
