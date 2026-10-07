import { http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DEMO_TEMPLATES } from "./template-data"
import { UseTemplateDialog } from "./use-template-dialog"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithRouter } from "@/test/render"

const TEMPLATE = DEMO_TEMPLATES[2]

async function fillAndSubmit(
  user: ReturnType<typeof renderWithRouter>["user"],
  subdomain?: string
) {
  const dialog = await screen.findByRole("dialog")
  await user.type(within(dialog).getByLabelText("Website Name"), "Palm Grove")
  await user.type(
    within(dialog).getByLabelText("Project / Property Name"),
    "Palm Grove Villas"
  )
  await user.click(within(dialog).getByRole("button", { name: "Continue" }))
  if (subdomain) {
    const field = await within(dialog).findByLabelText(/Subdomain|Domain/)
    await user.clear(field)
    await user.type(field, subdomain)
  }
  await user.click(
    await within(dialog).findByRole("button", { name: /Create Website/ })
  )
  return dialog
}

describe("UseTemplateDialog", () => {
  it("creates a website from the template and opens the builder", async () => {
    const request = gate()
    server.use(http.post(apiPath("/websites"), request.resolver))
    const { user, router } = renderWithRouter(
      <UseTemplateDialog open onOpenChange={() => {}} template={TEMPLATE} />
    )

    const dialog = await fillAndSubmit(user)
    expect(
      within(dialog).getByRole("button", { name: /Creating Website/ })
    ).toBeDisabled()

    request.release()
    expect(await screen.findByText("Palm Grove created")).toBeVisible()
    const website = db.websites.all().find((w) => w.name === "Palm Grove")
    expect(website).toMatchObject({
      templateId: TEMPLATE.id,
      domain: "palm-grove-villas.myprop.live",
      status: "draft",
    })
    expect(db.templates.find(TEMPLATE.id)?.uses).toBe(TEMPLATE.uses + 1)
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        `/app/websites/${website!.id}/builder`
      )
    )
  })

  it("keeps the dialog open when the address is taken", async () => {
    const { user } = renderWithRouter(
      <UseTemplateDialog open onOpenChange={() => {}} template={TEMPLATE} />
    )

    await fillAndSubmit(user, "skyline-heights")

    expect(
      await screen.findByText("skyline-heights.myprop.live is already taken.")
    ).toBeVisible()
    expect(screen.getByRole("dialog")).toBeVisible()
    expect(db.websites.all().some((w) => w.name === "Palm Grove")).toBe(false)
  })
})
