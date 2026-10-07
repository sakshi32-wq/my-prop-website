// Handlers for the "auth" tag. Passwords aren't checked: the mock only knows
// which emails have accounts.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { sessionToken } from "../session"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type { AuthSession, Error as ErrorBody } from "@/api/generated/model"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "")

function startSession(userId: string): string {
  const token = `mock_${crypto.randomUUID()}`
  db.sessions.insert({ id: token, userId })
  return token
}

export const authHandlers = [
  http.post<never, never, AuthSession | ErrorBody>(
    apiPath("/auth/login"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body)) return errorResponse(422, "Invalid body.")
      const email = text(body.email).toLowerCase()
      if (!EMAIL_RE.test(email) || !text(body.password))
        return errorResponse(422, "Enter your email and password.")
      const user = db.users.all().find((u) => u.email.toLowerCase() === email)
      if (!user)
        return HttpResponse.json(
          { message: "Invalid email or password." },
          { status: 401 }
        )
      return HttpResponse.json({ token: startSession(user.id), user })
    }
  ),

  http.post<never, never, AuthSession | ErrorBody>(
    apiPath("/auth/register"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body)) return errorResponse(422, "Invalid body.")
      const email = text(body.email).toLowerCase()
      const firstName = text(body.firstName)
      const lastName = text(body.lastName)
      if (!firstName || !lastName)
        return errorResponse(422, "First and last name are required.")
      if (!EMAIL_RE.test(email))
        return errorResponse(422, "Enter a valid email address.")
      if (typeof body.password !== "string" || body.password.length < 8)
        return errorResponse(422, "Password must be at least 8 characters.")
      if (db.users.all().some((u) => u.email.toLowerCase() === email))
        return errorResponse(422, "An account with that email already exists.")

      const user = db.users.insert({
        id: crypto.randomUUID(),
        firstName,
        lastName,
        email,
        company: text(body.company),
        phone: "",
      })
      return HttpResponse.json(
        { token: startSession(user.id), user },
        { status: 201 }
      )
    }
  ),

  http.post<never, never, ErrorBody | null>(
    apiPath("/auth/forgot-password"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      const email = isRecord(body) ? text(body.email) : ""
      if (!EMAIL_RE.test(email))
        return errorResponse(422, "Enter a valid email address.")
      return new HttpResponse(null, { status: 204 })
    }
  ),

  http.post(apiPath("/auth/logout"), async ({ request }) => {
    await delay()
    db.sessions.remove(sessionToken(request))
    return new HttpResponse(null, { status: 204 })
  }),
]
