import { describe, expect, it } from "vitest"

import { setAuthToken } from "@/api/fetcher"
import { getMe } from "@/api/generated/account/account"
import {
  login,
  logout,
  register,
  requestPasswordReset,
} from "@/api/generated/auth/auth"
import { DEMO_PROFILE } from "@/components/settings/account-data"

describe("auth mock API", () => {
  it("answers /me for the signed-in user, and the demo user otherwise", async () => {
    expect((await getMe()).id).toBe(DEMO_PROFILE.id)

    const session = await register({
      firstName: "Asha",
      lastName: "Iyer",
      email: "asha@example.com",
      password: "a-long-password",
    })
    setAuthToken(session.token)
    expect((await getMe()).email).toBe("asha@example.com")

    await logout()
    expect((await getMe()).id).toBe(DEMO_PROFILE.id)
  })

  it("logs in known emails only and rejects duplicate sign-ups", async () => {
    expect(
      (await login({ email: DEMO_PROFILE.email, password: "x" })).user.id
    ).toBe(DEMO_PROFILE.id)
    await expect(
      login({ email: "nobody@example.com", password: "x" })
    ).rejects.toMatchObject({ status: 401 })
    await expect(
      register({
        firstName: "J",
        lastName: "D",
        email: DEMO_PROFILE.email,
        password: "a-long-password",
      })
    ).rejects.toMatchObject({ status: 422 })
  })

  it("always accepts reset requests for valid emails", async () => {
    await expect(
      requestPasswordReset({ email: "nobody@example.com" })
    ).resolves.toBeUndefined()
  })
})
