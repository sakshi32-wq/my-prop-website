// Stateful handlers for the "integrations" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  Error as ErrorBody,
  Integration,
  IntegrationTestResult,
} from "@/api/generated/model"

type IntegrationParams = { integrationId: string }

const notFound = () => errorResponse(404, "Integration not found.")

export const integrationHandlers = [
  http.get<never, never, Array<Integration>>(
    apiPath("/integrations"),
    async () => {
      await delay()
      return HttpResponse.json(db.integrations.all())
    }
  ),

  http.patch<IntegrationParams, never, Integration | ErrorBody>(
    apiPath("/integrations/:integrationId"),
    async ({ params, request }) => {
      await delay()
      const integration = db.integrations.find(params.integrationId)
      if (!integration) return notFound()
      if (!integration.connected)
        return errorResponse(422, "Connect the integration first.")
      const body = await readJson(request)
      const settings = isRecord(body) ? body.settings : undefined
      if (!isRecord(settings))
        return errorResponse(422, "settings must be an object.")
      const entries = Object.entries(settings)
      if (entries.some(([, value]) => typeof value !== "string"))
        return errorResponse(422, "Every setting must be a string.")
      const empty = entries.find(([, value]) => !(value as string).trim())
      if (empty) return errorResponse(422, `${empty[0]} is required.`)

      const updated = db.integrations.update(params.integrationId, {
        settings: Object.fromEntries(
          entries.map(([key, value]) => [key, (value as string).trim()])
        ),
      })
      return updated ? HttpResponse.json(updated) : notFound()
    }
  ),

  http.post<IntegrationParams, never, Integration | ErrorBody>(
    apiPath("/integrations/:integrationId/connect"),
    async ({ params }) => {
      await delay()
      const integration = db.integrations.find(params.integrationId)
      if (!integration) return notFound()
      const updated = integration.connected
        ? integration
        : db.integrations.update(params.integrationId, {
            connected: true,
            connectedAt: new Date().toISOString(),
          })
      return updated ? HttpResponse.json(updated) : notFound()
    }
  ),

  http.post<IntegrationParams, never, Integration | ErrorBody>(
    apiPath("/integrations/:integrationId/disconnect"),
    async ({ params }) => {
      await delay()
      const updated = db.integrations.update(params.integrationId, {
        connected: false,
        connectedAt: null,
      })
      return updated ? HttpResponse.json(updated) : notFound()
    }
  ),

  http.post<IntegrationParams, never, IntegrationTestResult | ErrorBody>(
    apiPath("/integrations/:integrationId/test"),
    async ({ params }) => {
      await delay()
      const integration = db.integrations.find(params.integrationId)
      if (!integration) return notFound()
      if (!integration.connected)
        return errorResponse(422, "Connect the integration first.")
      return HttpResponse.json<IntegrationTestResult>({
        ok: true,
        message: "Connection successful",
      })
    }
  ),
]
