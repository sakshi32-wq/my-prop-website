import { describe, expect, it } from "vitest"

import {
  getTeamMember,
  inviteTeamMember,
  listTeamMembers,
  removeTeamMember,
  updateTeamMember,
} from "@/api/generated/team/team"
import { DEMO_TEAM_MEMBERS } from "@/components/settings/team-data"

const OWNER_ID = DEMO_TEAM_MEMBERS[0].id

describe("team mock API", () => {
  it("lists oldest first", async () => {
    expect((await listTeamMembers()).map((m) => m.name)).toEqual(
      DEMO_TEAM_MEMBERS.map((m) => m.name)
    )
  })

  it("invites, changes the role and removes", async () => {
    const invited = await inviteTeamMember({
      email: " New.Person@Example.com ",
      role: "Agent",
    })
    expect(invited).toMatchObject({
      email: "new.person@example.com",
      name: "new.person",
      status: "invited",
    })
    expect((await updateTeamMember(invited.id, { role: "Admin" })).role).toBe(
      "Admin"
    )
    await removeTeamMember(invited.id)
    await expect(getTeamMember(invited.id)).rejects.toMatchObject({
      status: 404,
    })
  })

  it("rejects duplicates and protects the owner", async () => {
    await expect(
      inviteTeamMember({ email: "sarah@example.com", role: "Agent" })
    ).rejects.toMatchObject({
      status: 422,
      message: "This person is already on your team.",
    })
    await expect(removeTeamMember(OWNER_ID)).rejects.toMatchObject({
      status: 422,
    })
    await expect(
      updateTeamMember(OWNER_ID, { role: "Agent" })
    ).rejects.toMatchObject({ status: 422 })
  })
})
