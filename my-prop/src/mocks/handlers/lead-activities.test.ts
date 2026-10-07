import { describe, expect, it } from "vitest"

import {
  createLead,
  deleteLead,
  listLeadActivities,
  logLeadCall,
  scheduleSiteVisit,
  sendLeadMessage,
  updateLead,
} from "@/api/generated/leads/leads"
import { DEMO_LEADS } from "@/components/leads/data"

const titles = async (leadId: string) =>
  (await listLeadActivities(leadId)).map((a) => a.title)

describe("lead activities mock API", () => {
  it("records capture and stage changes automatically", async () => {
    const lead = await createLead({
      name: "Kiran Rao",
      phone: "+91 90000 00000",
      source: "referral",
    })
    expect(await titles(lead.id)).toEqual(["Lead captured via Referral"])

    await updateLead(lead.id, { stage: "interested" })
    await updateLead(lead.id, { notes: "No stage change" })
    expect((await titles(lead.id))[0]).toBe("Moved to Interested")
    expect(await titles(lead.id)).toHaveLength(2)

    await deleteLead(lead.id)
    await expect(listLeadActivities(lead.id)).rejects.toMatchObject({
      status: 404,
    })
  })

  it("logs calls and messages with readable details", async () => {
    const id = DEMO_LEADS[0].id
    const call = await logLeadCall(id, {
      outcome: "callback",
      duration: "3-5min",
      notes: "Call after 6pm",
    })
    expect(call).toMatchObject({
      type: "call",
      title: "Call logged: Call Back Later",
      description: "3-5 minutes · Call after 6pm",
    })
    const message = await sendLeadMessage(id, {
      channel: "whatsapp",
      text: "Hello!",
    })
    expect(message).toMatchObject({ type: "whatsapp", description: "Hello!" })
    expect((await titles(id)).slice(0, 2)).toEqual([
      "WhatsApp message sent",
      "Call logged: Call Back Later",
    ])
  })

  it("schedules visits and moves only early-stage leads", async () => {
    const early = DEMO_LEADS[0] // new
    const late = DEMO_LEADS[6] // negotiation
    const visit = { date: "2026-10-10", time: "11:30", project: "Marina Bay" }

    const activity = await scheduleSiteVisit(early.id, {
      ...visit,
      assignedTo: "Priya Singh",
    })
    expect(activity.description).toBe(
      "Marina Bay on Sat, 10 Oct at 11:30 with Priya Singh"
    )
    expect((await titles(early.id))[0]).toBe("Moved to Site Visit Scheduled")

    await scheduleSiteVisit(late.id, visit)
    expect((await titles(late.id))[0]).toBe("Site visit scheduled")
  })

  it("validates the action bodies", async () => {
    const id = DEMO_LEADS[0].id
    await expect(
      // @ts-expect-error -- an outcome the API doesn't know
      logLeadCall(id, { outcome: "maybe" })
    ).rejects.toMatchObject({ status: 422 })
    await expect(
      scheduleSiteVisit(id, { date: "2026-10-10", time: "25:00", project: "X" })
    ).rejects.toMatchObject({ status: 422 })
  })
})
