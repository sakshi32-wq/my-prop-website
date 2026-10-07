import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ApiKeysCard } from "./api-keys-card"
import { DEMO_API_KEYS } from "./api-keys-data"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithClient } from "@/test/render"

describe("ApiKeysCard", () => {
  it("shows a skeleton, then masked keys from the API", async () => {
    renderWithClient(<ApiKeysCard />)

    expect(screen.getByLabelText("Loading API keys")).toBeInTheDocument()
    expect(await screen.findByText("Production API Key")).toBeVisible()
    expect(screen.getByText(DEMO_API_KEYS[0].preview)).toBeVisible()
  })

  it("generates a key and shows its secret only once", async () => {
    const request = gate()
    server.use(http.post(apiPath("/api-keys"), request.resolver))
    const { user } = renderWithClient(<ApiKeysCard />)
    await screen.findByText("Production API Key")

    await user.click(
      screen.getByRole("button", { name: "Generate New API Key" })
    )
    const dialog = await screen.findByRole("dialog")
    await user.type(within(dialog).getByLabelText("Key Name"), "CRM Sync")
    await user.click(
      within(dialog).getByRole("button", { name: /Generate Key/ })
    )
    expect(
      within(dialog).getByRole("button", { name: /Generate Key/ })
    ).toBeDisabled()

    request.release()
    const secret = await within(dialog).findByLabelText("Your new API key")
    expect((secret as HTMLInputElement).value).toMatch(/^sk_live_\w{32}$/)
    expect(await screen.findByText("CRM Sync created")).toBeVisible()

    // The list only ever has the masked preview.
    await user.click(within(dialog).getByRole("button", { name: "Done" }))
    expect(await screen.findByText("CRM Sync")).toBeVisible()
    expect(
      screen.queryByText((secret as HTMLInputElement).value)
    ).not.toBeInTheDocument()
    expect(
      db.apiKeys.all().find((k) => k.name === "CRM Sync")
    ).not.toHaveProperty("secret")
  })

  it("revokes a key, and restores it if the server refuses", async () => {
    server.use(
      http.delete(
        apiPath("/api-keys/:apiKeyId"),
        () => HttpResponse.json({ message: "Key is in use." }, { status: 422 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<ApiKeysCard />)
    const revoke = async () => {
      await user.click(
        await screen.findByRole("button", {
          name: "Revoke Development API Key",
        })
      )
      await user.click(
        within(await screen.findByRole("alertdialog")).getByRole("button", {
          name: "Revoke Key",
        })
      )
    }

    await revoke()
    expect(await screen.findByText("Key is in use.")).toBeVisible()
    await waitFor(() =>
      expect(screen.getByText("Development API Key")).toBeVisible()
    )

    await revoke()
    expect(await screen.findByText("Development API Key revoked")).toBeVisible()
    expect(db.apiKeys.find(DEMO_API_KEYS[1].id)).toBeUndefined()
  })

  it("shows an error with Retry when the list fails", async () => {
    server.use(
      http.get(
        apiPath("/api-keys"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<ApiKeysCard />)

    expect(await screen.findByText("Couldn't load API keys")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("Production API Key")).toBeVisible()
  })
})
