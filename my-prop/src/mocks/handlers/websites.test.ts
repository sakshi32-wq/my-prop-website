import { describe, expect, it } from "vitest"

import {
  createWebsite,
  getWebsite,
  getWebsiteContent,
  listWebsites,
  publishWebsite,
  saveWebsiteContent,
} from "@/api/generated/websites/websites"
import { DEMO_WEBSITES, emptyWebsiteInfo } from "@/components/websites/data"

describe("websites mock API", () => {
  it("lists oldest first and filters by status", async () => {
    expect((await listWebsites()).map((w) => w.name)).toEqual(
      DEMO_WEBSITES.map((w) => w.name)
    )
    expect(await listWebsites({ status: ["draft"] })).toHaveLength(1)
  })

  it("creates a draft with a unique domain and empty layout", async () => {
    const info = emptyWebsiteInfo("Skyline Heights")
    const created = await createWebsite({ templateId: "2", info })
    expect(created).toMatchObject({
      status: "draft",
      domain: "skyline-heights-2.myprop.live",
      toolIds: info.enabledToolIds,
    })
    expect(await getWebsiteContent(created.id)).toMatchObject({
      sections: null,
      savedAt: null,
      info,
    })
  })

  it("saves content, renames the website and publishes", async () => {
    const id = DEMO_WEBSITES[3].id
    await expect(publishWebsite(id)).rejects.toMatchObject({ status: 422 })

    const info = { ...emptyWebsiteInfo("Riverside Reborn"), enabledToolIds: [] }
    const saved = await saveWebsiteContent(id, {
      info,
      sections: [{ id: "s1", elements: [] }],
    })
    expect(saved.savedAt).not.toBeNull()
    expect(await getWebsite(id)).toMatchObject({
      name: "Riverside Reborn",
      toolIds: [],
    })

    const live = await publishWebsite(id)
    expect(live.status).toBe("live")
    expect(live.publishedAt).not.toBeNull()
  })

  it("rejects bad bodies and unknown websites", async () => {
    await expect(
      createWebsite({ templateId: "1", info: emptyWebsiteInfo(" ") })
    ).rejects.toMatchObject({
      status: 422,
      message: "Project name is required.",
    })
    await expect(
      getWebsite("00000000-0000-4000-8000-000000000000")
    ).rejects.toMatchObject({ status: 404 })
  })
})
