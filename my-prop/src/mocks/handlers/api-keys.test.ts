import { describe, expect, it } from "vitest"

import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
} from "@/api/generated/api-keys/api-keys"
import { DEMO_API_KEYS } from "@/components/settings/api-keys-data"

describe("api-keys mock API", () => {
  it("lists oldest first, without secrets", async () => {
    const keys = await listApiKeys()
    expect(keys.map((k) => k.name)).toEqual([
      DEMO_API_KEYS[1].name,
      DEMO_API_KEYS[0].name,
    ])
    for (const key of keys) expect(key).not.toHaveProperty("secret")
  })

  it("returns the secret once on create, then revokes", async () => {
    const created = await createApiKey({ name: "Test", type: "development" })
    expect(created.secret).toMatch(/^sk_test_\w{32}$/)
    expect(created.preview).toBe(
      `${created.secret.slice(0, 8)}${"•".repeat(16)}${created.secret.slice(-4)}`
    )

    const listed = (await listApiKeys()).find((k) => k.id === created.id)
    expect(listed).toBeDefined()
    expect(listed).not.toHaveProperty("secret")

    await revokeApiKey(created.id)
    await expect(revokeApiKey(created.id)).rejects.toMatchObject({
      status: 404,
    })
  })

  it("validates the name and type", async () => {
    await expect(
      createApiKey({ name: " ", type: "production" })
    ).rejects.toMatchObject({ status: 422, message: "Key name is required." })
  })
})
