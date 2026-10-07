import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DEMO_TEAM_MEMBERS } from "./team-data"
import { TeamTab } from "./team-tab"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithClient } from "@/test/render"

const memberRow = (text: string) =>
  screen.getByText(text).closest<HTMLElement>("[data-slot=item]")!

describe("TeamTab", () => {
  it("shows a skeleton, then members from the API", async () => {
    db.teamMembers.insert({
      id: "7d2e1f3a-4b5c-4d6e-8f9a-0b1c2d3e4f50",
      name: "Seeded Member",
      email: "seeded@example.com",
      role: "Agent",
      status: "active",
      createdAt: new Date().toISOString(),
    })
    renderWithClient(<TeamTab />)

    expect(screen.getByLabelText("Loading team members")).toBeInTheDocument()
    expect(await screen.findByText("Seeded Member")).toBeInTheDocument()
    expect(screen.getByText("5 members in your workspace.")).toBeVisible()
  })

  it("invites a member", async () => {
    const request = gate()
    server.use(http.post(apiPath("/team/members"), request.resolver))
    const { user } = renderWithClient(<TeamTab />)
    await screen.findByText("Sarah Smith")

    await user.click(screen.getByRole("button", { name: "Invite Member" }))
    const dialog = await screen.findByRole("dialog")
    await user.type(
      within(dialog).getByLabelText("Email Address"),
      "Priya@Example.com"
    )
    await user.click(
      within(dialog).getByRole("button", { name: /Send Invitation/ })
    )
    expect(
      within(dialog).getByRole("button", { name: /Send Invitation/ })
    ).toBeDisabled()

    request.release()
    expect(await screen.findByText("Invitation sent")).toBeVisible()
    expect(await screen.findByText("priya@example.com")).toBeInTheDocument()
    expect(
      within(memberRow("priya@example.com")).getByText("Invited")
    ).toBeVisible()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("changes a role optimistically", async () => {
    const request = gate()
    server.use(http.patch(apiPath("/team/members/:memberId"), request.resolver))
    const { user } = renderWithClient(<TeamTab />)

    await user.click(
      await screen.findByRole("combobox", { name: "Role for Mike Johnson" })
    )
    await user.click(await screen.findByRole("option", { name: "Admin" }))

    expect(
      screen.getByRole("combobox", { name: "Role for Mike Johnson" })
    ).toHaveTextContent("Admin")
    request.release()
    expect(
      await screen.findByText("Mike Johnson is now an Admin")
    ).toBeVisible()
    expect(db.teamMembers.find(DEMO_TEAM_MEMBERS[2].id)?.role).toBe("Admin")
  })

  it("puts a member back when removing fails", async () => {
    server.use(
      http.delete(apiPath("/team/members/:memberId"), () =>
        HttpResponse.json({ message: "Lisa owns 3 websites." }, { status: 422 })
      )
    )
    const { user } = renderWithClient(<TeamTab />)
    await screen.findByText("Lisa Chen")

    await user.click(
      within(memberRow("Lisa Chen")).getByRole("button", { name: "Remove" })
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Remove",
      })
    )

    expect(await screen.findByText("Lisa owns 3 websites.")).toBeVisible()
    await waitFor(() => expect(screen.getByText("Lisa Chen")).toBeVisible())
    expect(db.teamMembers.all()).toHaveLength(DEMO_TEAM_MEMBERS.length)
  })

  it("removes a member", async () => {
    const { user } = renderWithClient(<TeamTab />)
    await screen.findByText("Lisa Chen")

    await user.click(
      within(memberRow("Lisa Chen")).getByRole("button", { name: "Remove" })
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Remove",
      })
    )

    expect(
      await screen.findByText("Lisa Chen removed from the team")
    ).toBeVisible()
    expect(db.teamMembers.find(DEMO_TEAM_MEMBERS[3].id)).toBeUndefined()
  })

  it("shows an error with Retry when the list fails", async () => {
    server.use(
      http.get(
        apiPath("/team/members"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<TeamTab />)

    expect(
      await screen.findByText("Couldn't load team members")
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("Sarah Smith")).toBeInTheDocument()
  })
})
