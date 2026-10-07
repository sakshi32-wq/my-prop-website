import { describe, expect, it } from "vitest"

import {
  cancelSubscription,
  getSubscription,
  listInvoices,
  requestPlanUpgrade,
  resumeSubscription,
} from "@/api/generated/billing/billing"

describe("billing mock API", () => {
  it("cancels, rejects a second cancel, and resumes", async () => {
    expect((await getSubscription()).status).toBe("active")
    expect((await cancelSubscription()).status).toBe("cancelling")
    await expect(cancelSubscription()).rejects.toMatchObject({ status: 422 })
    expect((await resumeSubscription()).status).toBe("active")
  })

  it("lists invoices newest first and accepts upgrade requests", async () => {
    const invoices = await listInvoices()
    expect(invoices.map((i) => i.issuedAt)).toEqual(
      [...invoices.map((i) => i.issuedAt)].sort().reverse()
    )
    await expect(requestPlanUpgrade({ plan: "scale" })).resolves.toBeUndefined()
  })
})
