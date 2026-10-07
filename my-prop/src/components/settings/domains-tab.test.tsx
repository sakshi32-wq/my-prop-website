import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DEMO_DOMAINS } from "./domains-data"
import { DomainsTab } from "./domains-tab"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithClient } from "@/test/render"

describe("DomainsTab", () => {
  it("shows a skeleton, then domains from the API", async () => {
    db.domains.insert({
      ...DEMO_DOMAINS[0],
      id: "9f4a3b5c-6d7e-4f8a-9b0c-1d2e3f4a5b60",
      domain: "seeded.example",
      createdAt: new Date().toISOString(),
    })
    renderWithClient(<DomainsTab />)

    expect(screen.getByLabelText("Loading domains")).toBeInTheDocument()
    expect(await screen.findByText("seeded.example")).toBeInTheDocument()
    expect(screen.getByText("marinabay.in")).toBeVisible()
  })

  it("adds a domain, then shows its DNS records and verifies", async () => {
    const request = gate()
    server.use(http.post(apiPath("/domains"), request.resolver))
    const { user } = renderWithClient(<DomainsTab />)
    await screen.findByText("skylineheights.com")

    await user.click(screen.getByRole("button", { name: "Add Domain" }))
    const dialog = await screen.findByRole("dialog")
    await user.type(
      within(dialog).getByLabelText("Domain Name"),
      "Riverside.in"
    )
    await user.click(within(dialog).getByRole("combobox"))
    await user.click(
      await screen.findByRole("option", { name: "Riverside Residency" })
    )
    await user.click(within(dialog).getByRole("button", { name: /Add Domain/ }))
    expect(
      within(dialog).getByRole("button", { name: /Add Domain/ })
    ).toBeDisabled()

    request.release()
    expect(
      await within(dialog).findByText("Configure DNS for riverside.in")
    ).toBeVisible()
    expect(within(dialog).getByText("76.76.21.21")).toBeVisible()
    expect(await screen.findByText("riverside.in added")).toBeVisible()
    // The list behind the dialog already has the new pending domain.
    expect(
      db.domains.all().find((d) => d.domain === "riverside.in")
    ).toMatchObject({ status: "pending", websiteName: "Riverside Residency" })

    await user.click(within(dialog).getByRole("button", { name: /Verify DNS/ }))
    expect(
      await screen.findByText("DNS records not detected yet")
    ).toBeVisible()
    await user.click(within(dialog).getByRole("button", { name: "Done" }))
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    )
    expect(screen.getByText("riverside.in")).toBeInTheDocument()
  })

  it("removes a domain, and restores it if the server refuses", async () => {
    server.use(
      http.delete(
        apiPath("/domains/:domainId"),
        () =>
          HttpResponse.json({ message: "Domain is locked." }, { status: 422 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<DomainsTab />)
    const remove = async () => {
      await user.click(
        await screen.findByRole("button", { name: "Remove marinabay.in" })
      )
      await user.click(
        within(await screen.findByRole("alertdialog")).getByRole("button", {
          name: "Remove Domain",
        })
      )
    }

    await remove()
    expect(await screen.findByText("Domain is locked.")).toBeVisible()
    await waitFor(() => expect(screen.getByText("marinabay.in")).toBeVisible())

    await remove()
    expect(await screen.findByText("marinabay.in removed")).toBeVisible()
    expect(db.domains.find(DEMO_DOMAINS[1].id)).toBeUndefined()
  })

  it("shows an error with Retry when the list fails", async () => {
    server.use(
      http.get(
        apiPath("/domains"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<DomainsTab />)

    expect(await screen.findByText("Couldn't load domains")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("greenvalley.com")).toBeInTheDocument()
  })
})
