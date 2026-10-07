// Handlers for the "ai" tag. Generation is canned (src/mocks/ai-content.ts);
// saved generations are stateful.
import { HttpResponse, delay, http } from "msw"

import { generateContent } from "../ai-content"
import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  AiContentInput,
  AiContentTool,
  AiGeneration,
  AiPageDesign,
  AiToolType,
  Error as ErrorBody,
  SavedGeneration,
} from "@/api/generated/model"
import { PAGE_HTML } from "@/components/ai-studio/web-page-designer/page-code"

const CONTENT_TOOLS: Array<AiContentTool> = [
  "copy",
  "whatsapp",
  "social",
  "faq",
]
const TOOL_TYPES: Array<AiToolType> = [...CONTENT_TOOLS, "website", "webpage"]
const INPUT_FIELDS = [
  "projectName",
  "location",
  "propertyType",
  "tone",
  "features",
  "targetAudience",
  "platform",
  "numPosts",
  "campaignGoal",
] as const

const PAGE_REPLY =
  "I've created that for you. Check the live preview and let me know if you'd like any changes!"

function parseInput(value: unknown): AiContentInput | string {
  if (!isRecord(value)) return "input must be an object."
  for (const field of INPUT_FIELDS)
    if (typeof value[field] !== "string") return `input.${field} is required.`
  const input = value as unknown as AiContentInput
  if (!input.projectName.trim() || !input.location.trim())
    return "Enter the project name and location."
  return input
}

export const aiHandlers = [
  http.post<never, never, AiGeneration | ErrorBody>(
    apiPath("/ai/generate"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (
        !isRecord(body) ||
        !CONTENT_TOOLS.includes(body.tool as AiContentTool)
      )
        return errorResponse(422, "Choose a content tool.")
      const input = parseInput(body.input)
      if (typeof input === "string") return errorResponse(422, input)
      return HttpResponse.json(
        generateContent(body.tool as AiContentTool, input)
      )
    }
  ),

  http.post<never, never, AiPageDesign | ErrorBody>(
    apiPath("/ai/page-design"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      const prompt =
        isRecord(body) && typeof body.prompt === "string"
          ? body.prompt.trim()
          : ""
      if (!prompt) return errorResponse(422, "Describe the page you want.")
      return HttpResponse.json({ reply: PAGE_REPLY, html: PAGE_HTML })
    }
  ),

  http.get<never, never, Array<SavedGeneration>>(
    apiPath("/ai/generations"),
    async () => {
      await delay()
      const generations = db.generations
        .all()
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      return HttpResponse.json(generations)
    }
  ),

  http.post<never, never, SavedGeneration | ErrorBody>(
    apiPath("/ai/generations"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body)) return errorResponse(422, "Invalid body.")
      if (!TOOL_TYPES.includes(body.type as AiToolType))
        return errorResponse(422, "type is not an AI Studio tool.")
      const [title, projectName, location, content] = [
        body.title,
        body.projectName,
        body.location,
        body.content,
      ].map((v) => (typeof v === "string" ? v : ""))
      if (!title.trim() || !content.trim())
        return errorResponse(422, "A title and content are required.")
      const generation = db.generations.insert({
        id: crypto.randomUUID(),
        type: body.type as AiToolType,
        title: title.trim(),
        projectName,
        location,
        preview: content.slice(0, 160),
        content,
        status: "draft",
        createdAt: new Date().toISOString(),
      })
      return HttpResponse.json(generation, { status: 201 })
    }
  ),

  http.delete<{ generationId: string }, never, ErrorBody | null>(
    apiPath("/ai/generations/:generationId"),
    async ({ params }) => {
      await delay()
      if (!db.generations.remove(params.generationId))
        return errorResponse(404, "Generation not found.")
      return new HttpResponse(null, { status: 204 })
    }
  ),
]
