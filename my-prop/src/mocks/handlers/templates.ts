// Stateful handlers for the "templates" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type { Error as ErrorBody, Template } from "@/api/generated/model"
import { demoGalleryUrls } from "@/components/templates/template-data"
import { PHOTOS } from "@/lib/mock-data"

type TemplateParams = { templateId: string }

function matches(template: Template, query: URLSearchParams) {
  const q = query.get("q")?.trim().toLowerCase()
  const price = query.get("price")
  const category = query.get("category")
  const tags = query.getAll("tag")
  return (
    (!q ||
      [template.name, template.description, template.category, ...template.tags]
        .join(" ")
        .toLowerCase()
        .includes(q)) &&
    (!price || (price === "premium") === template.isPremium) &&
    (!category || template.category === category) &&
    tags.every((tag) => template.tags.includes(tag))
  )
}

export const templateHandlers = [
  http.get<never, never, Array<Template>>(
    apiPath("/templates"),
    async ({ request }) => {
      await delay()
      const query = new URL(request.url).searchParams
      const templates = db.templates
        .all()
        .filter((template) => matches(template, query))
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      return HttpResponse.json(templates)
    }
  ),

  http.post<never, never, Template | ErrorBody>(
    apiPath("/templates"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      const name = typeof body.name === "string" ? body.name.trim() : ""
      if (!name) return errorResponse(422, "Template name is required.")
      if (name.length > 60)
        return errorResponse(
          422,
          "Template name must be 60 characters or less."
        )
      if (
        typeof body.category !== "string" ||
        typeof body.description !== "string" ||
        typeof body.thumbnailUrl !== "string"
      )
        return errorResponse(
          422,
          "category, description and thumbnailUrl are required."
        )
      if (
        !Array.isArray(body.tags) ||
        !body.tags.every((tag) => typeof tag === "string")
      )
        return errorResponse(422, "tags must be an array of strings.")

      const template = db.templates.insert({
        id: crypto.randomUUID(),
        name,
        category: body.category,
        description: body.description.trim(),
        tags: body.tags,
        thumbnailUrl: body.thumbnailUrl,
        galleryUrls: demoGalleryUrls(PHOTOS.building),
        rating: 5,
        uses: 0,
        isPremium: false,
        isCustom: true,
        createdAt: new Date().toISOString(),
      })
      return HttpResponse.json(template, { status: 201 })
    }
  ),

  http.get<TemplateParams, never, Template | ErrorBody>(
    apiPath("/templates/:templateId"),
    async ({ params }) => {
      await delay()
      const template = db.templates.find(params.templateId)
      return template
        ? HttpResponse.json(template)
        : errorResponse(404, "Template not found.")
    }
  ),
]
