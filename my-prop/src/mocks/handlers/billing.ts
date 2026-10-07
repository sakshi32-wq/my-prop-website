// Stateful handlers for the "billing" tag.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type {
  Error as ErrorBody,
  Invoice,
  Subscription,
} from "@/api/generated/model"

/** The subscription with live usage numbers. */
function currentSubscription(): Subscription {
  const subscription = db.subscription.get()
  return {
    ...subscription,
    usage: subscription.usage.map((item) =>
      item.key === "websites"
        ? { ...item, used: db.websites.all().length }
        : item
    ),
  }
}

export const billingHandlers = [
  http.get<never, never, Subscription>(
    apiPath("/billing/subscription"),
    async () => {
      await delay()
      return HttpResponse.json(currentSubscription())
    }
  ),

  http.post<never, never, Subscription | ErrorBody>(
    apiPath("/billing/subscription/cancel"),
    async () => {
      await delay()
      if (db.subscription.get().status === "cancelling")
        return errorResponse(422, "The subscription is already cancelled.")
      db.subscription.update({ status: "cancelling" })
      return HttpResponse.json(currentSubscription())
    }
  ),

  http.post<never, never, Subscription | ErrorBody>(
    apiPath("/billing/subscription/resume"),
    async () => {
      await delay()
      if (db.subscription.get().status === "active")
        return errorResponse(422, "The subscription is already active.")
      db.subscription.update({ status: "active" })
      return HttpResponse.json(currentSubscription())
    }
  ),

  http.post<never, never, ErrorBody | null>(
    apiPath("/billing/upgrade-requests"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (
        !isRecord(body) ||
        !["scale", "enterprise"].includes(String(body.plan))
      )
        return errorResponse(422, "plan must be scale or enterprise.")
      return new HttpResponse(null, { status: 204 })
    }
  ),

  http.get<never, never, Array<Invoice>>(
    apiPath("/billing/invoices"),
    async () => {
      await delay()
      const invoices = db.invoices
        .all()
        .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
      return HttpResponse.json(invoices)
    }
  ),
]
