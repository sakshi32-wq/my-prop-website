import { subDays } from "date-fns"

import type { ApiKey, ApiKeyType } from "@/api/generated/model"

export type {
  ApiKey,
  ApiKeyInput,
  ApiKeyType,
  ApiKeyWithSecret,
} from "@/api/generated/model"

export const API_KEY_TYPES = [
  {
    value: "production",
    label: "Production",
    description: "For live applications",
  },
  {
    value: "development",
    label: "Development",
    description: "For testing and development",
  },
] as const satisfies ReadonlyArray<{
  value: ApiKeyType
  label: string
  description: string
}>

export function apiKeyTypeLabel(type: ApiKeyType) {
  return API_KEY_TYPES.find((t) => t.value === type)?.label ?? type
}

const now = new Date()

/** Seed data for the mock API (src/mocks/db.ts). Secrets are never stored. */
export const DEMO_API_KEYS: Array<ApiKey> = [
  {
    id: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c01",
    name: "Production API Key",
    type: "production",
    preview: "sk_live_••••••••••••••••4f2a",
    createdAt: subDays(now, 60).toISOString(),
  },
  {
    id: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c02",
    name: "Development API Key",
    type: "development",
    preview: "sk_test_••••••••••••••••9b7c",
    createdAt: subDays(now, 65).toISOString(),
  },
]
