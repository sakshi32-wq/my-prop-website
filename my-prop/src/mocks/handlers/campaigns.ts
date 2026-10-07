// Stateful handlers for the "campaigns" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  Campaign,
  CampaignChannel,
  CampaignFrequency,
  CampaignInput,
  CampaignScheduleType,
  CampaignStatus,
  CampaignUpdate,
  Error as ErrorBody,
} from "@/api/generated/model"

const CHANNELS: Array<CampaignChannel> = ["WhatsApp", "Email", "SMS"]
const STATUSES: Array<CampaignStatus> = ["active", "paused", "scheduled"]
const SCHEDULE_TYPES: Array<CampaignScheduleType> = [
  "immediate",
  "scheduled",
  "recurring",
  "triggered",
]
const FREQUENCIES: Array<CampaignFrequency> = ["daily", "weekly", "monthly"]
const STRING_FIELDS = [
  "name",
  "objective",
  "subject",
  "message",
  "aiTone",
  "scheduleTime",
  "triggerEvent",
] as const
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

const DEFAULTS: Required<CampaignInput> = {
  name: "",
  objective: "",
  type: "WhatsApp",
  audience: [],
  subject: "",
  message: "",
  aiTone: "friendly",
  scheduleType: "immediate",
  scheduleDate: null,
  scheduleTime: "10:00",
  frequency: "daily",
  triggerEvent: "",
  status: "active",
}

type CampaignParams = { campaignId: string }

function oneOf<T extends string>(
  body: Record<string, unknown>,
  field: string,
  allowed: Array<T>
): T | undefined | { error: string } {
  const value = body[field]
  if (value === undefined) return undefined
  if (!allowed.includes(value as T))
    return { error: `${field} must be one of: ${allowed.join(", ")}.` }
  return value as T
}

/** Checks the body's field types. Cross-field rules run on the merged result. */
function parseCampaignBody(
  body: unknown
): { data: CampaignUpdate } | { error: string } {
  if (!isRecord(body)) return { error: "Request body must be a JSON object." }
  const data: CampaignUpdate = {}

  for (const field of STRING_FIELDS) {
    const value = body[field]
    if (value === undefined) continue
    if (typeof value !== "string")
      return { error: `${field} must be a string.` }
    data[field] = value.trim()
  }

  const type = oneOf(body, "type", CHANNELS)
  const status = oneOf(body, "status", STATUSES)
  const scheduleType = oneOf(body, "scheduleType", SCHEDULE_TYPES)
  const frequency = oneOf(body, "frequency", FREQUENCIES)
  for (const value of [type, status, scheduleType, frequency])
    if (typeof value === "object") return value
  Object.assign(data, { type, status, scheduleType, frequency })

  if (body.audience !== undefined) {
    if (
      !Array.isArray(body.audience) ||
      !body.audience.every((id) => typeof id === "string")
    )
      return { error: "audience must be an array of segment ids." }
    data.audience = [...new Set(body.audience)]
  }
  if (body.scheduleDate !== undefined) {
    if (
      body.scheduleDate !== null &&
      (typeof body.scheduleDate !== "string" ||
        !DATE_RE.test(body.scheduleDate))
    )
      return { error: "scheduleDate must be a YYYY-MM-DD date or null." }
    data.scheduleDate = body.scheduleDate
  }
  // Drop the keys that weren't sent, so they don't overwrite on merge.
  for (const key of Object.keys(data) as Array<keyof CampaignUpdate>)
    if (data[key] === undefined) delete data[key]
  return { data }
}

function validateCampaign(c: Required<CampaignInput>): string | null {
  if (!c.name) return "Campaign name is required."
  if (c.name.length > 80) return "Campaign name must be 80 characters or less."
  if (c.audience.length === 0) return "Select at least one audience segment."
  if (!c.message) return "Message content is required."
  if (c.type === "Email" && !c.subject) return "Email campaigns need a subject."
  if (c.scheduleTime && !TIME_RE.test(c.scheduleTime))
    return "scheduleTime must be HH:mm."
  if (c.scheduleType === "scheduled" && !c.scheduleDate)
    return "Scheduled campaigns need a date."
  if (c.scheduleType === "triggered" && !c.triggerEvent)
    return "Triggered campaigns need a trigger event."
  return null
}

export const campaignHandlers = [
  http.get<never, never, Array<Campaign>>(
    apiPath("/campaigns"),
    async ({ request }) => {
      await delay()
      const statuses = new URL(request.url).searchParams.getAll("status")
      const campaigns = db.campaigns
        .all()
        .filter((c) => statuses.length === 0 || statuses.includes(c.status))
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      return HttpResponse.json(campaigns)
    }
  ),

  http.post<never, never, Campaign | ErrorBody>(
    apiPath("/campaigns"),
    async ({ request }) => {
      await delay()
      const parsed = parseCampaignBody(await readJson(request))
      if ("error" in parsed) return errorResponse(422, parsed.error)
      const input = { ...DEFAULTS, ...parsed.data }
      const error = validateCampaign(input)
      if (error) return errorResponse(422, error)
      const campaign = db.campaigns.insert({
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        leads: 0,
      })
      return HttpResponse.json(campaign, { status: 201 })
    }
  ),

  http.get<CampaignParams, never, Campaign | ErrorBody>(
    apiPath("/campaigns/:campaignId"),
    async ({ params }) => {
      await delay()
      const campaign = db.campaigns.find(params.campaignId)
      if (!campaign) return errorResponse(404, "Campaign not found.")
      return HttpResponse.json(campaign)
    }
  ),

  http.patch<CampaignParams, never, Campaign | ErrorBody>(
    apiPath("/campaigns/:campaignId"),
    async ({ params, request }) => {
      await delay()
      const current = db.campaigns.find(params.campaignId)
      if (!current) return errorResponse(404, "Campaign not found.")
      const parsed = parseCampaignBody(await readJson(request))
      if ("error" in parsed) return errorResponse(422, parsed.error)
      const error = validateCampaign({ ...current, ...parsed.data })
      if (error) return errorResponse(422, error)
      const campaign = db.campaigns.update(params.campaignId, parsed.data)
      if (!campaign) return errorResponse(404, "Campaign not found.")
      return HttpResponse.json(campaign)
    }
  ),

  http.delete<CampaignParams, never, ErrorBody | null>(
    apiPath("/campaigns/:campaignId"),
    async ({ params }) => {
      await delay()
      if (!db.campaigns.remove(params.campaignId))
        return errorResponse(404, "Campaign not found.")
      return new HttpResponse(null, { status: 204 })
    }
  ),
]
