// Stateful handlers for the "automations" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  Automation,
  AutomationInput,
  AutomationStep,
  AutomationStepType,
  Error as ErrorBody,
} from "@/api/generated/model"

type AutomationParams = { automationId: string }

const STEP_TYPES: Array<AutomationStepType> = [
  "trigger",
  "whatsapp",
  "email",
  "sms",
  "wait",
  "condition",
  "assign",
  "tag",
  "score",
  "notification",
  "webhook",
]

const notFound = () => errorResponse(404, "Automation not found.")

function parseAutomation(body: unknown): AutomationInput | string {
  if (!isRecord(body)) return "Request body must be a JSON object."
  const name = typeof body.name === "string" ? body.name.trim() : ""
  if (!name) return "Give the automation a name."
  if (!Array.isArray(body.steps)) return "steps must be an array."
  const steps = body.steps as Array<unknown>
  for (const step of steps) {
    if (
      !isRecord(step) ||
      typeof step.id !== "string" ||
      typeof step.name !== "string" ||
      typeof step.description !== "string" ||
      !STEP_TYPES.includes(step.type as AutomationStepType) ||
      !isRecord(step.config)
    )
      return "Every step needs an id, type, name, description and config."
  }
  const typed = steps as Array<AutomationStep>
  if (typed[0]?.type !== "trigger") return "The first step must be a trigger."
  if (typed.filter((s) => s.type === "trigger").length > 1)
    return "An automation has only one trigger."
  if (typed.length < 2) return "Add at least one step after the trigger."
  if (new Set(typed.map((s) => s.id)).size !== typed.length)
    return "Step ids must be unique."
  return { name, steps: typed }
}

export const automationHandlers = [
  http.get<never, never, Array<Automation>>(
    apiPath("/automations"),
    async () => {
      await delay()
      const automations = db.automations
        .all()
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
      return HttpResponse.json(automations)
    }
  ),

  http.post<never, never, Automation | ErrorBody>(
    apiPath("/automations"),
    async ({ request }) => {
      await delay()
      const input = parseAutomation(await readJson(request))
      if (typeof input === "string") return errorResponse(422, input)
      const now = new Date().toISOString()
      const automation = db.automations.insert({
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      })
      return HttpResponse.json(automation, { status: 201 })
    }
  ),

  http.get<AutomationParams, never, Automation | ErrorBody>(
    apiPath("/automations/:automationId"),
    async ({ params }) => {
      await delay()
      const automation = db.automations.find(params.automationId)
      return automation ? HttpResponse.json(automation) : notFound()
    }
  ),

  http.put<AutomationParams, never, Automation | ErrorBody>(
    apiPath("/automations/:automationId"),
    async ({ params, request }) => {
      await delay()
      if (!db.automations.find(params.automationId)) return notFound()
      const input = parseAutomation(await readJson(request))
      if (typeof input === "string") return errorResponse(422, input)
      const automation = db.automations.update(params.automationId, {
        ...input,
        updatedAt: new Date().toISOString(),
      })
      return automation ? HttpResponse.json(automation) : notFound()
    }
  ),

  http.delete<AutomationParams, never, ErrorBody | null>(
    apiPath("/automations/:automationId"),
    async ({ params }) => {
      await delay()
      if (!db.automations.remove(params.automationId)) return notFound()
      return new HttpResponse(null, { status: 204 })
    }
  ),
]
