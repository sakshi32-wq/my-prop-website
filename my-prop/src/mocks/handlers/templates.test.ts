import { describe, expect, it } from "vitest"

import {
  createTemplate,
  getTemplate,
  listTemplates,
} from "@/api/generated/templates/templates"
import { DEMO_TEMPLATES } from "@/components/templates/template-data"

const names = (list: Array<{ name: string }>) => list.map((t) => t.name)

describe("templates mock API", () => {
  it("lists the library in order and filters on the server", async () => {
    expect(names(await listTemplates())).toEqual(names(DEMO_TEMPLATES))
    expect(names(await listTemplates({ category: "Villas" }))).toEqual(
      names(DEMO_TEMPLATES.filter((t) => t.category === "Villas"))
    )
    const free = await listTemplates({ price: "free" })
    expect(free.every((t) => !t.isPremium)).toBe(true)
    const tagged = await listTemplates({ tag: ["luxury", "launch"] })
    expect(names(tagged)).toEqual(["Luxury Launch"])
    expect(names(await listTemplates({ q: "LOFT" }))).toEqual(["Downtown Loft"])
  })

  it("saves a custom template, listed first", async () => {
    const saved = await createTemplate({
      name: "My AI Template",
      category: "Villas",
      description: "Generated",
      tags: ["ai-generated"],
      thumbnailUrl: "https://images.example.com/x.jpg",
    })
    expect(saved).toMatchObject({ isCustom: true, uses: 0, isPremium: false })
    expect(saved.galleryUrls).toHaveLength(6)
    expect((await listTemplates())[0].id).toBe(saved.id)
    expect((await getTemplate(saved.id)).name).toBe("My AI Template")
  })

  it("rejects bad input and unknown ids", async () => {
    await expect(
      createTemplate({
        name: " ",
        category: "Villas",
        description: "",
        tags: [],
        thumbnailUrl: "https://images.example.com/x.jpg",
      })
    ).rejects.toMatchObject({ status: 422 })
    await expect(
      getTemplate("00000000-0000-4000-8000-000000000000")
    ).rejects.toMatchObject({ status: 404 })
  })
})
