// Stateful handlers for the "api-keys" tag: writes really change the mock db.
// Like a real backend, only the masked preview is stored; the secret is
// returned once, when the key is created.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  ApiKey,
  ApiKeyType,
  ApiKeyWithSecret,
  Error as ErrorBody,
} from "@/api/generated/model"
import { maskSecret, randomToken } from "@/components/settings/utils"

const TYPES: Array<ApiKeyType> = ["production", "development"]

type ApiKeyParams = { apiKeyId: string }

export const apiKeyHandlers = [
  http.get<never, never, Array<ApiKey>>(apiPath("/api-keys"), async () => {
    await delay()
    const keys = db.apiKeys
      .all()
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    return HttpResponse.json(keys)
  }),

  http.post<never, never, ApiKeyWithSecret | ErrorBody>(
    apiPath("/api-keys"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      const name = typeof body.name === "string" ? body.name.trim() : ""
      if (!name) return errorResponse(422, "Key name is required.")
      if (name.length > 60)
        return errorResponse(422, "Key name must be 60 characters or less.")
      if (!TYPES.includes(body.type as ApiKeyType))
        return errorResponse(422, "type must be production or development.")
      const type = body.type as ApiKeyType

      const secret =
        (type === "production" ? "sk_live_" : "sk_test_") + randomToken(32)
      const key = db.apiKeys.insert({
        id: crypto.randomUUID(),
        name,
        type,
        preview: maskSecret(secret),
        createdAt: new Date().toISOString(),
      })
      return HttpResponse.json({ ...key, secret }, { status: 201 })
    }
  ),

  http.delete<ApiKeyParams, never, ErrorBody | null>(
    apiPath("/api-keys/:apiKeyId"),
    async ({ params }) => {
      await delay()
      if (!db.apiKeys.remove(params.apiKeyId))
        return errorResponse(404, "API key not found.")
      return new HttpResponse(null, { status: 204 })
    }
  ),
]
