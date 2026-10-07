import { describe, expect, it } from "vitest"

import {
  changePassword,
  getMe,
  getNotificationPreferences,
  updateMe,
  updateNotificationPreferences,
} from "@/api/generated/account/account"
import {
  DEMO_NOTIFICATION_PREFERENCES,
  DEMO_PROFILE,
} from "@/components/settings/account-data"

describe("account mock API", () => {
  it("reads and partially updates the profile", async () => {
    expect(await getMe()).toEqual(DEMO_PROFILE)
    const updated = await updateMe({ company: " New Co " })
    expect(updated).toEqual({ ...DEMO_PROFILE, company: "New Co" })
    await expect(updateMe({ email: "nope" })).rejects.toMatchObject({
      status: 422,
    })
  })

  it("updates only the preferences that are sent", async () => {
    expect(await getNotificationPreferences()).toEqual(
      DEMO_NOTIFICATION_PREFERENCES
    )
    expect(
      await updateNotificationPreferences({ weeklyReports: true })
    ).toEqual({ ...DEMO_NOTIFICATION_PREFERENCES, weeklyReports: true })
  })

  it("validates password changes", async () => {
    await expect(
      changePassword({ currentPassword: "a", newPassword: "long-enough" })
    ).resolves.toBeUndefined()
    await expect(
      changePassword({ currentPassword: "a", newPassword: "short" })
    ).rejects.toMatchObject({ status: 422 })
  })
})
