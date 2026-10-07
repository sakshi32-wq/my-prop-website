import { describe, expect, it } from "vitest"

import {
  deleteGeneration,
  designPage,
  generateContent,
  listGenerations,
  saveGeneration,
} from "@/api/generated/ai/ai"
import { EMPTY_FORM } from "@/components/ai-studio/data"

const input = { ...EMPTY_FORM, projectName: "Lakeside", location: "Pune" }

describe("ai mock API", () => {
  it("generates content for each tool", async () => {
    const copy = await generateContent({ tool: "copy", input })
    expect(copy.content.copy?.hero.headline).toBe("Welcome to Lakeside")
    expect(copy.title).toBe("Property Copy - Lakeside")
    expect(copy.plainText).toContain("Welcome to Lakeside")

    const social = await generateContent({
      tool: "social",
      input: { ...input, numPosts: "5" },
    })
    expect(social.content.posts).toHaveLength(5)
    expect(
      (await generateContent({ tool: "faq", input })).content.faqs?.[0].q
    ).toBe("What is Lakeside?")
    await expect(
      generateContent({ tool: "copy", input: { ...input, projectName: "" } })
    ).rejects.toMatchObject({ status: 422 })
  })

  it("saves, lists and deletes generations", async () => {
    const saved = await saveGeneration({
      type: "whatsapp",
      title: "WhatsApp Campaign - Lakeside",
      projectName: "Lakeside",
      location: "Pune",
      content: "Hello",
    })
    expect(saved).toMatchObject({ status: "draft", preview: "Hello" })
    expect((await listGenerations())[0].id).toBe(saved.id)
    await deleteGeneration(saved.id)
    await expect(deleteGeneration(saved.id)).rejects.toMatchObject({
      status: 404,
    })
  })

  it("designs a page", async () => {
    const design = await designPage({ prompt: "Landing page" })
    expect(design.html).toContain("<!doctype html>")
    await expect(designPage({ prompt: " " })).rejects.toMatchObject({
      status: 422,
    })
  })
})
