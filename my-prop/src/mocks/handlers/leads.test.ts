import { describe, expect, it } from "vitest"

import {
  createLead,
  deleteLead,
  getLead,
  listLeads,
  updateLead,
} from "@/api/generated/leads/leads"
import { ApiError } from "@/api/fetcher"
import { DEMO_LEADS } from "@/components/leads/data"

// Goes through the generated client and fetch mutator, so this also covers
// query param serialization and error parsing.
describe("leads mock API", () => {
  it("lists newest first and filters by repeated query params", async () => {
    const all = await listLeads()
    expect(all.map((l) => l.name)).toEqual(DEMO_LEADS.map((l) => l.name))

    const filtered = await listLeads({
      source: ["website", "referral"],
      stage: ["interested", "closed"],
    })
    expect(filtered.map((l) => l.name)).toEqual([
      "Neha Singh",
      "Vikram Mehta",
      "Sunita Verma",
    ])
    expect(await listLeads({ limit: 2 })).toHaveLength(2)
  })

  it("creates, reads, updates and deletes", async () => {
    const created = await createLead({
      name: "Kiran Rao",
      phone: "+91 90000 00000",
      source: "walk-in",
    })
    expect(created).toMatchObject({ stage: "new", tags: [], email: "" })

    const updated = await updateLead(created.id, { stage: "contacted" })
    expect(updated.stage).toBe("contacted")
    expect((await getLead(created.id)).stage).toBe("contacted")

    await deleteLead(created.id)
    await expect(getLead(created.id)).rejects.toMatchObject({
      status: 404,
      body: { message: "Lead not found." },
    })
  })

  it("rejects invalid bodies with 422 and the Error schema", async () => {
    const error = await createLead({
      name: "",
      phone: "1",
      source: "website",
    }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 422,
      message: "Name is required.",
    })
  })
})
