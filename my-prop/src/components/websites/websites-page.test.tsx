import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { WebsitesPage } from "./websites-page"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithRouter } from "@/test/render"

describe("WebsitesPage", () => {
  it("shows a skeleton, then websites from the API", async () => {
    renderWithRouter(<WebsitesPage />)

    expect(await screen.findByLabelText("Loading websites")).toBeInTheDocument()
    expect(await screen.findByText("Skyline Heights")).toBeVisible()
    expect(screen.getByText("18.8%")).toBeVisible()
    expect(screen.getAllByText("Draft")).toHaveLength(1)
  })

  it("creates a website and opens it in the builder", async () => {
    const request = gate()
    server.use(http.post(apiPath("/websites"), request.resolver))
    const { user, router } = renderWithRouter(<WebsitesPage />)
    await screen.findByText("Skyline Heights")

    await user.click(
      screen.getAllByRole("button", { name: "Create New Website" })[0]
    )
    const dialog = await screen.findByRole("dialog")
    const next = () =>
      user.click(within(dialog).getByRole("button", { name: /Next/ }))
    await user.type(within(dialog).getByLabelText(/Project Name/), "Lakeside")
    await user.type(within(dialog).getByLabelText(/Location/), "Pune")
    await next()
    await user.click(within(dialog).getByLabelText(/Property Type/))
    await user.click(
      await screen.findByRole("option", { name: "Apartment Complex" })
    )
    await user.click(within(dialog).getByRole("button", { name: /2 BHK/ }))
    for (let step = 2; step < 7; step++) await next()

    await user.click(
      within(dialog).getByRole("button", { name: /Create Website/ })
    )
    expect(
      within(dialog).getByRole("button", { name: /Create Website/ })
    ).toBeDisabled()

    request.release()
    expect(await screen.findByText('"Lakeside" created')).toBeVisible()
    const created = db.websites.all().find((w) => w.name === "Lakeside")
    expect(created).toMatchObject({
      status: "draft",
      domain: "lakeside.myprop.live",
    })
    expect(db.websiteContents.find(created!.id)?.info).toMatchObject({
      location: "Pune",
      configurations: ["2 BHK"],
    })
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        `/app/websites/${created!.id}/builder`
      )
    )
  })

  it("shows an error with Retry when the list fails", async () => {
    server.use(
      http.get(
        apiPath("/websites"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithRouter(<WebsitesPage />)

    expect(await screen.findByText("Couldn't load websites")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("Skyline Heights")).toBeVisible()
  })
})
