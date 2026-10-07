// Stateful handlers for the "websites" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  Error as ErrorBody,
  Website,
  WebsiteContent,
  WebsiteInfo,
} from "@/api/generated/model"
import { PHOTOS, unsplash } from "@/lib/mock-data"

type WebsiteParams = { websiteId: string }

const notFound = () => errorResponse(404, "Website not found.")

const STRING_FIELDS = [
  "projectName",
  "location",
  "description",
  "propertyType",
  "priceRange",
  "targetAudience",
  "aiTone",
] as const
const LIST_FIELDS = ["configurations", "amenities", "enabledToolIds"] as const
const CONTENT_FIELDS = [
  "keyHighlights",
  "developerInfo",
  "nearbyLocations",
  "specialOffers",
] as const

const isStringArray = (value: unknown): value is Array<string> =>
  Array.isArray(value) && value.every((item) => typeof item === "string")

/** Checks a WebsiteInfo body; returns an error message or the info. */
function parseInfo(value: unknown): WebsiteInfo | string {
  if (!isRecord(value)) return "info must be an object."
  for (const field of STRING_FIELDS)
    if (typeof value[field] !== "string")
      return `info.${field} must be a string.`
  for (const field of LIST_FIELDS)
    if (!isStringArray(value[field]))
      return `info.${field} must be an array of strings.`
  if (typeof value.generateWithAI !== "boolean")
    return "info.generateWithAI must be a boolean."
  if (!Array.isArray(value.uploadedFiles))
    return "info.uploadedFiles must be an array."
  const extra = value.additionalContent
  if (
    !isRecord(extra) ||
    CONTENT_FIELDS.some((field) => typeof extra[field] !== "string")
  )
    return "info.additionalContent is incomplete."
  const info = value as unknown as WebsiteInfo
  if (!info.projectName.trim()) return "Project name is required."
  return { ...info, projectName: info.projectName.trim() }
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "website"
  )
}

/** A free <slug>.myprop.live address. */
function uniqueDomain(name: string) {
  const taken = new Set(db.websites.all().map((w) => w.domain))
  const slug = slugify(name)
  let domain = `${slug}.myprop.live`
  for (let n = 2; taken.has(domain); n++) domain = `${slug}-${n}.myprop.live`
  return domain
}

function toContent({ id: _id, ...content }: WebsiteContent & { id: string }) {
  return content
}

export const websiteHandlers = [
  http.get<never, never, Array<Website>>(
    apiPath("/websites"),
    async ({ request }) => {
      await delay()
      const statuses = new URL(request.url).searchParams.getAll("status")
      const websites = db.websites
        .all()
        .filter((w) => statuses.length === 0 || statuses.includes(w.status))
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
      return HttpResponse.json(websites)
    }
  ),

  http.post<never, never, Website | ErrorBody>(
    apiPath("/websites"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      if (typeof body.templateId !== "string")
        return errorResponse(422, "templateId is required.")
      const info = parseInfo(body.info)
      if (typeof info === "string") return errorResponse(422, info)

      const now = new Date().toISOString()
      const website = db.websites.insert({
        id: crypto.randomUUID(),
        name: info.projectName,
        domain: uniqueDomain(info.projectName),
        status: "draft",
        thumbnailUrl: unsplash(PHOTOS.building, 600, 375),
        views: 0,
        leads: 0,
        conversionRate: 0,
        toolIds: info.enabledToolIds,
        templateId: body.templateId,
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
      })
      db.websiteContents.insert({
        id: website.id,
        websiteId: website.id,
        info,
        sections: null,
        savedAt: null,
      })
      return HttpResponse.json(website, { status: 201 })
    }
  ),

  http.get<WebsiteParams, never, Website | ErrorBody>(
    apiPath("/websites/:websiteId"),
    async ({ params }) => {
      await delay()
      const website = db.websites.find(params.websiteId)
      return website ? HttpResponse.json(website) : notFound()
    }
  ),

  http.get<WebsiteParams, never, WebsiteContent | ErrorBody>(
    apiPath("/websites/:websiteId/content"),
    async ({ params }) => {
      await delay()
      const content = db.websiteContents.find(params.websiteId)
      return content ? HttpResponse.json(toContent(content)) : notFound()
    }
  ),

  http.put<WebsiteParams, never, WebsiteContent | ErrorBody>(
    apiPath("/websites/:websiteId/content"),
    async ({ params, request }) => {
      await delay()
      if (!db.websites.find(params.websiteId)) return notFound()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      const info = parseInfo(body.info)
      if (typeof info === "string") return errorResponse(422, info)
      if (!Array.isArray(body.sections) || !body.sections.every(isRecord))
        return errorResponse(422, "sections must be an array of objects.")

      const savedAt = new Date().toISOString()
      const content = db.websiteContents.update(params.websiteId, {
        info,
        sections: body.sections,
        savedAt,
      })
      db.websites.update(params.websiteId, {
        name: info.projectName,
        toolIds: info.enabledToolIds,
        updatedAt: savedAt,
      })
      return content ? HttpResponse.json(toContent(content)) : notFound()
    }
  ),

  http.post<WebsiteParams, never, Website | ErrorBody>(
    apiPath("/websites/:websiteId/publish"),
    async ({ params }) => {
      await delay()
      const content = db.websiteContents.find(params.websiteId)
      if (!content) return notFound()
      if (!content.sections?.length)
        return errorResponse(
          422,
          "Save at least one section before publishing."
        )
      const now = new Date().toISOString()
      const website = db.websites.update(params.websiteId, {
        status: "live",
        publishedAt: now,
        updatedAt: now,
      })
      return website ? HttpResponse.json(website) : notFound()
    }
  ),
]
