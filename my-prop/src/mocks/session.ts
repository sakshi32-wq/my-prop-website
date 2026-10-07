// Who a mock request belongs to. There are no route guards yet, so requests
// without a valid token act as the demo user rather than getting a 401.
import { db } from "./db"
import type { Profile } from "@/api/generated/model"
import { DEMO_PROFILE } from "@/components/settings/account-data"

export function sessionToken(request: Request) {
  return request.headers.get("Authorization")?.replace(/^Bearer /, "") ?? ""
}

export function currentUser(request: Request): Profile {
  const session = db.sessions.find(sessionToken(request))
  return (
    (session && db.users.find(session.userId)) ??
    db.users.find(DEMO_PROFILE.id) ??
    DEMO_PROFILE
  )
}
