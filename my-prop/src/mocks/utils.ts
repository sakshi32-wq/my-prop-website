import { HttpResponse } from "msw"

import type { Error as ErrorBody } from "@/api/generated/model"

/** Must match the mock baseUrl in orval.config.ts. */
export const MOCK_API_BASE = "/api"

export function apiPath(path: string) {
  return `${MOCK_API_BASE}${path}`
}

export function errorResponse(status: 404 | 422, message: string) {
  return HttpResponse.json<ErrorBody>({ message }, { status })
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
