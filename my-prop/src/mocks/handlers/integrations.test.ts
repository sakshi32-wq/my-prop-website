import { describe, expect, it } from "vitest"

import {
  connectIntegration,
  disconnectIntegration,
  listIntegrations,
  testIntegration,
  updateIntegration,
} from "@/api/generated/integrations/integrations"
import { DEMO_INTEGRATIONS } from "@/components/settings/integrations-data"

describe("integrations mock API", () => {
  it("lists every integration in the catalog", async () => {
    const list = await listIntegrations()
    expect(list.map((i) => i.id)).toEqual(DEMO_INTEGRATIONS.map((i) => i.id))
    expect(list.find((i) => i.id === "gmail")).toMatchObject({
      connected: false,
      connectedAt: null,
    })
  })

  it("connects, saves settings, tests and disconnects", async () => {
    const connected = await connectIntegration("stripe")
    expect(connected.connected).toBe(true)
    expect(connected.connectedAt).not.toBeNull()

    const saved = await updateIntegration("stripe", {
      settings: { key: " pk_test_1 " },
    })
    expect(saved.settings).toEqual({ key: "pk_test_1" })
    expect((await testIntegration("stripe")).ok).toBe(true)

    const disconnected = await disconnectIntegration("stripe")
    expect(disconnected).toMatchObject({
      connected: false,
      settings: { key: "pk_test_1" },
    })
  })

  it("needs a connection before saving or testing, and non-empty values", async () => {
    await expect(testIntegration("gmail")).rejects.toMatchObject({
      status: 422,
    })
    await expect(
      updateIntegration("gmail", { settings: { a: "b" } })
    ).rejects.toMatchObject({ status: 422 })
    await expect(
      updateIntegration("whatsapp", { settings: { number: "  " } })
    ).rejects.toMatchObject({ status: 422, message: "number is required." })
  })
})
