import { describe, expect, it } from "vitest"

import {
  createAutomation,
  deleteAutomation,
  getAutomation,
  listAutomations,
  saveAutomation,
} from "@/api/generated/automations/automations"
import {
  DEMO_AUTOMATIONS,
  createStep,
} from "@/components/campaigns/automation/automation-data"

const trigger = DEMO_AUTOMATIONS[0].steps[0]

describe("automations mock API", () => {
  it("creates, saves, reads and deletes", async () => {
    expect(await listAutomations()).toHaveLength(1)
    const created = await createAutomation({
      name: "Re-engage",
      steps: [trigger, createStep("sms")],
    })
    const saved = await saveAutomation(created.id, {
      name: "Re-engage cold leads",
      steps: [...created.steps, createStep("tag")],
    })
    expect(saved.steps.map((s) => s.type)).toEqual(["trigger", "sms", "tag"])
    expect((await getAutomation(created.id)).name).toBe("Re-engage cold leads")
    await deleteAutomation(created.id)
    await expect(getAutomation(created.id)).rejects.toMatchObject({
      status: 404,
    })
  })

  it("enforces one leading trigger and at least one action", async () => {
    const sms = createStep("sms")
    for (const steps of [[trigger], [sms, trigger], [trigger, sms, trigger]])
      await expect(
        createAutomation({ name: "Bad", steps })
      ).rejects.toMatchObject({ status: 422 })
  })
})
