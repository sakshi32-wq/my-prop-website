import { HttpResponse, http } from "msw"
import type { HttpResponseResolver } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DEMO_LEADS } from "./data"
import { LeadsPage } from "./leads-page"
import type { Lead } from "./data"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { renderWithClient } from "@/test/render"

const column = (stage: string) => screen.getByRole("region", { name: stage })

/**
 * A resolver that holds requests until release() is called. It returns
 * nothing, so MSW then falls through to the stateful handler (or the next
 * override), which makes the optimistic in-between state assertable.
 */
function gate() {
  let release = () => {}
  const opened = new Promise<void>((resolve) => (release = resolve))
  const resolver: HttpResponseResolver = async () => {
    await opened
  }
  return { resolver, release }
}

async function openCardMenu(
  user: ReturnType<typeof renderWithClient>["user"],
  name: string
) {
  await user.click(
    await screen.findByRole("button", { name: `Actions for ${name}` })
  )
}

describe("LeadsPage", () => {
  it("shows a skeleton, then leads from the API", async () => {
    const seeded: Lead = {
      ...DEMO_LEADS[0],
      id: "5b1c8d0e-2f4a-4b6c-8d9e-0f1a2b3c4d5e",
      name: "Seeded Lead",
      stage: "negotiation",
      addedAt: new Date().toISOString(),
    }
    db.leads.insert(seeded)

    renderWithClient(<LeadsPage />)

    expect(screen.getByLabelText("Loading leads")).toBeInTheDocument()
    await screen.findByText("Seeded Lead")
    expect(within(column("Negotiation")).getByText("Seeded Lead")).toBeVisible()
    expect(within(column("New Lead")).getByText("Rahul Sharma")).toBeVisible()
  })

  it("filters on the server when searching", async () => {
    const queries: Array<string | null> = []
    server.events.on("request:start", ({ request }) => {
      queries.push(new URL(request.url).searchParams.get("q"))
    })
    const { user } = renderWithClient(<LeadsPage />)
    await screen.findByText("Rahul Sharma")

    await user.type(screen.getByLabelText("Search leads"), "neha")

    await waitFor(() =>
      expect(screen.queryByText("Rahul Sharma")).not.toBeInTheDocument()
    )
    expect(screen.getByText("Neha Singh")).toBeInTheDocument()
    expect(screen.getByText("Showing 1 of 8 leads")).toBeInTheDocument()
    // Debounced: one request for the final value, none per keystroke.
    expect(queries.filter((q) => q !== null)).toEqual(["neha"])
  })

  it("creates a lead and refetches the board", async () => {
    const { user } = renderWithClient(<LeadsPage />)
    await screen.findByText("Rahul Sharma")

    await user.click(screen.getByRole("button", { name: "Add Lead" }))
    const dialog = await screen.findByRole("dialog")
    await user.type(within(dialog).getByLabelText(/Full Name/), "Kiran Rao")
    await user.type(
      within(dialog).getByLabelText(/Phone Number/),
      "+91 90000 00000"
    )
    await user.click(within(dialog).getByRole("combobox", { name: /Source/ }))
    await user.click(await screen.findByRole("option", { name: "Referral" }))
    await user.click(within(dialog).getByRole("button", { name: "Add Lead" }))

    expect(await screen.findByText("Lead added")).toBeInTheDocument()
    expect(
      await within(column("New Lead")).findByText("Kiran Rao")
    ).toBeInTheDocument()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(db.leads.all().map((l) => l.name)).toContain("Kiran Rao")
  })

  it("deletes a lead optimistically and persists it", async () => {
    const request = gate()
    server.use(http.delete(apiPath("/leads/:leadId"), request.resolver))
    const { user } = renderWithClient(<LeadsPage />)
    await openCardMenu(user, "Amit Kumar")
    await user.click(
      await screen.findByRole("menuitem", { name: "Delete Lead" })
    )
    await user.click(await screen.findByRole("button", { name: "Delete Lead" }))

    // Gone before the server answers, with no success toast yet…
    await waitFor(() =>
      expect(screen.queryByText("Amit Kumar")).not.toBeInTheDocument()
    )
    expect(screen.queryByText("Lead deleted")).not.toBeInTheDocument()
    // …which shows once it does.
    request.release()
    expect(await screen.findByText("Lead deleted")).toBeInTheDocument()
    expect(db.leads.all().map((l) => l.name)).not.toContain("Amit Kumar")
  })

  it("rolls back an optimistic update when the server rejects it", async () => {
    const request = gate()
    server.use(
      http.patch(apiPath("/leads/:leadId"), request.resolver),
      http.patch(apiPath("/leads/:leadId"), () =>
        HttpResponse.json({ message: "Stage is locked." }, { status: 422 })
      )
    )
    const { user } = renderWithClient(<LeadsPage />)
    await openCardMenu(user, "Rahul Sharma")
    await user.click(
      await screen.findByRole("menuitem", { name: "Mark as Won" })
    )

    expect(
      await within(column("Closed")).findByText("Rahul Sharma")
    ).toBeVisible()

    request.release()
    // The MutationCache shows the error body's message.
    expect(await screen.findByText("Stage is locked.")).toBeInTheDocument()
    await waitFor(() =>
      expect(within(column("New Lead")).getByText("Rahul Sharma")).toBeVisible()
    )
    expect(db.leads.find(DEMO_LEADS[0].id)?.stage).toBe("new")
  })

  it("shows an error with Retry when the list fails", async () => {
    server.use(
      http.get(
        apiPath("/leads"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<LeadsPage />)

    expect(await screen.findByText("Couldn't load leads")).toBeInTheDocument()
    expect(screen.getByText("Server down.")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("Rahul Sharma")).toBeInTheDocument()
  })
})
