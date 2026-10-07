import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DEMO_AUTOMATIONS } from "./automation-data"
import { AutomationBuilder } from "./automation-builder"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithClient } from "@/test/render"

const SEED = DEMO_AUTOMATIONS[0]

describe("AutomationBuilder", () => {
  it("loads the saved automation", async () => {
    renderWithClient(<AutomationBuilder />)

    expect(screen.getByLabelText("Loading automation")).toBeInTheDocument()
    expect(await screen.findByText(SEED.name)).toBeVisible()
    expect(screen.getByText("4 steps configured")).toBeVisible()
  })

  it("saves renames and removed steps to the API", async () => {
    const request = gate()
    server.use(
      http.put(apiPath("/automations/:automationId"), request.resolver)
    )
    const { user } = renderWithClient(<AutomationBuilder />)
    await screen.findByText(SEED.name)

    await user.click(screen.getByRole("button", { name: "Rename automation" }))
    const input = screen.getByLabelText("Automation name")
    await user.clear(input)
    await user.type(input, "Weekend Follow-up{Enter}")
    await user.click(screen.getByRole("button", { name: "Delete Wait/Delay" }))
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete",
      })
    )
    await user.click(screen.getByRole("button", { name: /Save Automation/ }))
    expect(
      screen.getByRole("button", { name: /Save Automation/ })
    ).toBeDisabled()

    request.release()
    expect(await screen.findByText('"Weekend Follow-up" saved')).toBeVisible()
    expect(db.automations.find(SEED.id)).toMatchObject({
      name: "Weekend Follow-up",
      steps: [
        expect.objectContaining({ type: "trigger" }),
        expect.objectContaining({ type: "whatsapp" }),
        expect.objectContaining({ type: "assign" }),
      ],
    })
  })

  it("creates the automation on the first save when none exists", async () => {
    db.automations.remove(SEED.id)
    const { user } = renderWithClient(<AutomationBuilder />)
    await screen.findByText("New Automation")

    await user.click(screen.getByRole("button", { name: /Save Automation/ }))

    expect(await screen.findByText('"New Automation" saved')).toBeVisible()
    await waitFor(() => expect(db.automations.all()).toHaveLength(1))
  })

  it("shows an error with Retry when loading fails", async () => {
    server.use(
      http.get(
        apiPath("/automations"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<AutomationBuilder />)

    expect(
      await screen.findByText("Couldn't load your automation")
    ).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText(SEED.name)).toBeVisible()
  })
})
