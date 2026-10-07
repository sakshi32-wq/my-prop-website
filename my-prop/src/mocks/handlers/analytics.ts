// Handlers for the read-only "analytics" tag.
import { HttpResponse, delay, http } from "msw"
import { isValid, parseISO } from "date-fns"

import { buildAnalyticsReport } from "../analytics"
import { db } from "../db"
import { apiPath, errorResponse } from "../utils"
import type {
  AnalyticsReport,
  DashboardOverview,
  Error as ErrorBody,
} from "@/api/generated/model"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const analyticsHandlers = [
  http.get<never, never, DashboardOverview>(
    apiPath("/analytics/overview"),
    async () => {
      await delay()
      return HttpResponse.json(db.dashboardOverview.get())
    }
  ),

  http.get<never, never, AnalyticsReport | ErrorBody>(
    apiPath("/analytics/report"),
    async ({ request }) => {
      await delay()
      const query = new URL(request.url).searchParams
      const [from, to] = [query.get("from") ?? "", query.get("to") ?? ""]
      const fromDate = parseISO(from)
      const toDate = parseISO(to)
      if (
        !DATE_RE.test(from) ||
        !DATE_RE.test(to) ||
        !isValid(fromDate) ||
        !isValid(toDate)
      )
        return errorResponse(422, "from and to must be YYYY-MM-DD dates.")
      if (toDate < fromDate)
        return errorResponse(422, "The end date must be after the start date.")
      return HttpResponse.json(
        buildAnalyticsReport({ from: fromDate, to: toDate })
      )
    }
  ),
]
