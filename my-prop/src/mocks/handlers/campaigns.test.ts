import { describe, expect, it } from "vitest"

import {
  createCampaign,
  deleteCampaign,
  getCampaign,
  listCampaigns,
  updateCampaign,
} from "@/api/generated/campaigns/campaigns"
import { DEMO_CAMPAIGNS } from "@/components/campaigns/campaign-data"

const VALID = {
  name: "Diwali Offer",
  type: "SMS" as const,
  audience: ["hot"],
  message: "Festive pricing.",
  scheduleType: "immediate" as const,
}

describe("campaigns mock API", () => {
  it("lists newest first and filters by status", async () => {
    const all = await listCampaigns()
    expect(all.map((c) => c.id)).toEqual(
      [...DEMO_CAMPAIGNS]
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .map((c) => c.id)
    )
    const paused = await listCampaigns({ status: ["paused"] })
    expect(paused.map((c) => c.name)).toEqual(["Marina Bay Follow-up"])
  })

  it("creates, reads, updates and deletes", async () => {
    const created = await createCampaign(VALID)
    expect(created).toMatchObject({
      status: "active",
      scheduleDate: null,
      sent: 0,
      leads: 0,
    })

    const updated = await updateCampaign(created.id, { status: "paused" })
    expect(updated.status).toBe("paused")
    expect((await getCampaign(created.id)).status).toBe("paused")

    await deleteCampaign(created.id)
    await expect(getCampaign(created.id)).rejects.toMatchObject({
      status: 404,
    })
  })

  it("validates the merged campaign with 422", async () => {
    await expect(
      createCampaign({ ...VALID, type: "Email" })
    ).rejects.toMatchObject({
      status: 422,
      message: "Email campaigns need a subject.",
    })
    await expect(
      updateCampaign(DEMO_CAMPAIGNS[0].id, { scheduleType: "scheduled" })
    ).rejects.toMatchObject({
      status: 422,
      message: "Scheduled campaigns need a date.",
    })
    await expect(
      createCampaign({ ...VALID, scheduleDate: "tomorrow" })
    ).rejects.toMatchObject({ status: 422 })
  })
})
