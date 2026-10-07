// Stateful handlers for the "leads" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"
import { format, isValid, parseISO } from "date-fns"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import {
  CALL_DURATIONS,
  CALL_NEXT_ACTIONS,
  CALL_OUTCOMES,
  optionLabel,
  sourceLabel,
  stageLabel,
} from "@/components/leads/data"
import type {
  Error as ErrorBody,
  Lead,
  LeadActivity,
  LeadSource,
  LeadStage,
  LeadUpdate,
} from "@/api/generated/model"

const SOURCES: Array<LeadSource> = [
  "website",
  "whatsapp",
  "social",
  "referral",
  "walk-in",
]
const STAGES: Array<LeadStage> = [
  "new",
  "contacted",
  "interested",
  "scheduled",
  "negotiation",
  "closed",
  "lost",
]
const STRING_FIELDS = [
  "name",
  "phone",
  "email",
  "budget",
  "configuration",
  "project",
  "notes",
] as const
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type LeadParams = { leadId: string }

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const EARLY_STAGES: Array<LeadStage> = ["new", "contacted", "interested"]

const stringOr = (value: unknown) => (typeof value === "string" ? value : "")

/** Validates a create (partial = false) or update body like a real API would. */
function parseLeadBody(
  body: unknown,
  partial: boolean
): { data: LeadUpdate } | { error: string } {
  if (!isRecord(body)) return { error: "Request body must be a JSON object." }
  const data: LeadUpdate = {}

  for (const field of STRING_FIELDS) {
    const value = body[field]
    if (value === undefined) continue
    if (typeof value !== "string")
      return { error: `${field} must be a string.` }
    data[field] = value.trim()
  }
  if (!partial || data.name !== undefined)
    if (!data.name) return { error: "Name is required." }
  if (!partial || data.phone !== undefined)
    if (!data.phone) return { error: "Phone number is required." }
  if (data.email && !EMAIL_RE.test(data.email))
    return { error: "Email address is invalid." }

  if (body.source !== undefined || !partial) {
    if (!SOURCES.includes(body.source as LeadSource))
      return { error: `source must be one of: ${SOURCES.join(", ")}.` }
    data.source = body.source as LeadSource
  }
  if (body.stage !== undefined) {
    if (!STAGES.includes(body.stage as LeadStage))
      return { error: `stage must be one of: ${STAGES.join(", ")}.` }
    data.stage = body.stage as LeadStage
  }
  if (body.tags !== undefined) {
    if (
      !Array.isArray(body.tags) ||
      !body.tags.every((tag) => typeof tag === "string")
    )
      return { error: "tags must be an array of strings." }
    data.tags = [...new Set(body.tags.map((tag: string) => tag.trim()))]
  }
  return { data }
}

function matchesSearch(lead: Lead, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const isPhoneQuery = /^[\d\s+()-]+$/.test(q)
  return (
    lead.name.toLowerCase().includes(q) ||
    lead.email.toLowerCase().includes(q) ||
    lead.phone.includes(q) ||
    (isPhoneQuery &&
      lead.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "")))
  )
}

function inList(list: Array<string>, value: string) {
  return list.length === 0 || list.includes(value)
}

function filterLeads(leads: Array<Lead>, query: URLSearchParams) {
  const sources = query.getAll("source")
  const stages = query.getAll("stage")
  const budgets = query.getAll("budget")
  const configurations = query.getAll("configuration")
  const projects = query.getAll("project")
  const tags = query.getAll("tag")
  const from = query.get("addedFrom")
  const to = query.get("addedTo")
  const fromTime = from ? Date.parse(from) : -Infinity
  const toTime = to ? Date.parse(to) : Infinity

  return leads.filter((lead) => {
    const added = Date.parse(lead.addedAt)
    return (
      matchesSearch(lead, query.get("q") ?? "") &&
      inList(sources, lead.source) &&
      inList(stages, lead.stage) &&
      inList(budgets, lead.budget) &&
      inList(configurations, lead.configuration) &&
      inList(projects, lead.project) &&
      (tags.length === 0 || tags.some((tag) => lead.tags.includes(tag))) &&
      added >= fromTime &&
      added <= toTime
    )
  })
}

export const leadHandlers = [
  http.get<never, never, Array<Lead>>(
    apiPath("/leads"),
    async ({ request }) => {
      await delay()
      const query = new URL(request.url).searchParams
      const limit = Number(query.get("limit")) || undefined
      const leads = filterLeads(db.leads.all(), query)
        .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
        .slice(0, limit)
      return HttpResponse.json(leads)
    }
  ),

  http.post<never, never, Lead | ErrorBody>(
    apiPath("/leads"),
    async ({ request }) => {
      await delay()
      const parsed = parseLeadBody(await readJson(request), false)
      if ("error" in parsed) return errorResponse(422, parsed.error)
      const lead = db.leads.insert({
        name: "",
        phone: "",
        email: "",
        source: "website",
        budget: "",
        configuration: "",
        project: "",
        stage: "new",
        tags: [],
        notes: "",
        ...parsed.data,
        id: crypto.randomUUID(),
        addedAt: new Date().toISOString(),
      })
      addActivity(lead.id, "captured", {
        title: `Lead captured via ${sourceLabel(lead.source)}`,
        description: lead.project,
      })
      return HttpResponse.json(lead, { status: 201 })
    }
  ),

  http.get<LeadParams, never, Lead | ErrorBody>(
    apiPath("/leads/:leadId"),
    async ({ params }) => {
      await delay()
      const lead = db.leads.find(params.leadId)
      if (!lead) return errorResponse(404, "Lead not found.")
      return HttpResponse.json(lead)
    }
  ),

  http.patch<LeadParams, never, Lead | ErrorBody>(
    apiPath("/leads/:leadId"),
    async ({ params, request }) => {
      await delay()
      const before = db.leads.find(params.leadId)
      if (!before) return errorResponse(404, "Lead not found.")
      const parsed = parseLeadBody(await readJson(request), true)
      if ("error" in parsed) return errorResponse(422, parsed.error)
      const lead = db.leads.update(params.leadId, parsed.data)
      if (!lead) return errorResponse(404, "Lead not found.")
      if (lead.stage !== before.stage)
        addActivity(lead.id, "stage-change", {
          title: `Moved to ${stageLabel(lead.stage)}`,
          description: `From ${stageLabel(before.stage)}`,
        })
      return HttpResponse.json(lead)
    }
  ),

  http.delete<LeadParams, never, ErrorBody | null>(
    apiPath("/leads/:leadId"),
    async ({ params }) => {
      await delay()
      if (!db.leads.remove(params.leadId))
        return errorResponse(404, "Lead not found.")
      for (const activity of db.leadActivities.all())
        if (activity.leadId === params.leadId)
          db.leadActivities.remove(activity.id)
      return new HttpResponse(null, { status: 204 })
    }
  ),

  http.get<LeadParams, never, Array<LeadActivity> | ErrorBody>(
    apiPath("/leads/:leadId/activities"),
    async ({ params }) => {
      await delay()
      if (!db.leads.find(params.leadId))
        return errorResponse(404, "Lead not found.")
      const activities = db.leadActivities
        .all()
        .filter((a) => a.leadId === params.leadId)
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      return HttpResponse.json(activities)
    }
  ),

  http.post<LeadParams, never, LeadActivity | ErrorBody>(
    apiPath("/leads/:leadId/calls"),
    async ({ params, request }) => {
      await delay()
      if (!db.leads.find(params.leadId))
        return errorResponse(404, "Lead not found.")
      const body = await readJson(request)
      if (!isRecord(body)) return errorResponse(422, "Invalid body.")
      const outcome = optionLabel(CALL_OUTCOMES, stringOr(body.outcome))
      if (!outcome) return errorResponse(422, "Choose the call outcome.")
      const activity = addActivity(params.leadId, "call", {
        title: `Call logged: ${outcome}`,
        description: [
          optionLabel(CALL_DURATIONS, stringOr(body.duration)),
          optionLabel(CALL_NEXT_ACTIONS, stringOr(body.nextAction)),
          stringOr(body.notes).trim(),
        ]
          .filter(Boolean)
          .join(" · "),
      })
      return HttpResponse.json(activity, { status: 201 })
    }
  ),

  http.post<LeadParams, never, LeadActivity | ErrorBody>(
    apiPath("/leads/:leadId/messages"),
    async ({ params, request }) => {
      await delay()
      if (!db.leads.find(params.leadId))
        return errorResponse(404, "Lead not found.")
      const body = await readJson(request)
      if (!isRecord(body) || body.channel !== "whatsapp")
        return errorResponse(422, "channel must be whatsapp.")
      const text = stringOr(body.text).trim()
      if (!text) return errorResponse(422, "The message is empty.")
      const activity = addActivity(params.leadId, "whatsapp", {
        title: "WhatsApp message sent",
        description: text.length > 80 ? `${text.slice(0, 77)}…` : text,
      })
      return HttpResponse.json(activity, { status: 201 })
    }
  ),

  http.post<LeadParams, never, LeadActivity | ErrorBody>(
    apiPath("/leads/:leadId/site-visits"),
    async ({ params, request }) => {
      await delay()
      const lead = db.leads.find(params.leadId)
      if (!lead) return errorResponse(404, "Lead not found.")
      const body = await readJson(request)
      if (!isRecord(body)) return errorResponse(422, "Invalid body.")
      const date = parseISO(stringOr(body.date))
      const time = stringOr(body.time)
      const project = stringOr(body.project).trim()
      if (!isValid(date)) return errorResponse(422, "Pick a visit date.")
      if (!TIME_RE.test(time)) return errorResponse(422, "Pick a visit time.")
      if (!project) return errorResponse(422, "Select a project.")

      const rep = stringOr(body.assignedTo)
      const activity = addActivity(params.leadId, "site-visit", {
        title: "Site visit scheduled",
        description: `${project} on ${format(date, "EEE, d MMM")} at ${time}${rep ? ` with ${rep}` : ""}`,
      })
      // Early-stage leads move along the pipeline.
      if (EARLY_STAGES.includes(lead.stage)) {
        db.leads.update(lead.id, { stage: "scheduled" })
        addActivity(lead.id, "stage-change", {
          title: `Moved to ${stageLabel("scheduled")}`,
          description: `From ${stageLabel(lead.stage)}`,
        })
      }
      return HttpResponse.json(activity, { status: 201 })
    }
  ),
]

function addActivity(
  leadId: string,
  type: LeadActivity["type"],
  { title, description }: { title: string; description: string }
) {
  return db.leadActivities.insert({
    id: crypto.randomUUID(),
    leadId,
    type,
    title,
    description,
    createdAt: new Date().toISOString(),
  })
}
