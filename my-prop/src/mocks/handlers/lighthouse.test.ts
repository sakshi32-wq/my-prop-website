import { describe, expect, it } from "vitest"

import {
  getLatestLighthouseReport,
  runLighthouseAudit,
} from "@/api/generated/websites/websites"
import { DEMO_WEBSITES } from "@/components/websites/data"

describe("lighthouse mock API", () => {
  it("404s until an audit runs, then returns the latest report", async () => {
    const id = DEMO_WEBSITES[1].id
    await expect(getLatestLighthouseReport(id)).rejects.toMatchObject({
      status: 404,
    })
    await runLighthouseAudit(id)
    const second = await runLighthouseAudit(id)
    expect(second.websiteId).toBe(id)
    expect((await getLatestLighthouseReport(id)).id).toBe(second.id)
    await expect(
      runLighthouseAudit("00000000-0000-4000-8000-000000000000")
    ).rejects.toMatchObject({ status: 404 })
  })
})
