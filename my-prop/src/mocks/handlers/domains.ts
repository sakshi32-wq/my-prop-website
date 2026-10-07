// Stateful handlers for the "domains" tag: writes really change the mock db.
import { HttpResponse, delay, http } from "msw"

import { db } from "../db"
import { apiPath, errorResponse, isRecord, readJson } from "../utils"
import type { Domain, Error as ErrorBody } from "@/api/generated/model"
import { DEMO_DNS_RECORDS } from "@/components/settings/domains-data"
import { HOSTNAME_RE } from "@/components/settings/utils"

type DomainParams = { domainId: string }

export const domainHandlers = [
  http.get<never, never, Array<Domain>>(apiPath("/domains"), async () => {
    await delay()
    const domains = db.domains
      .all()
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    return HttpResponse.json(domains)
  }),

  http.post<never, never, Domain | ErrorBody>(
    apiPath("/domains"),
    async ({ request }) => {
      await delay()
      const body = await readJson(request)
      if (!isRecord(body))
        return errorResponse(422, "Request body must be a JSON object.")
      const domain =
        typeof body.domain === "string" ? body.domain.trim().toLowerCase() : ""
      if (!HOSTNAME_RE.test(domain))
        return errorResponse(422, "Enter a valid domain, e.g. example.com.")
      if (db.domains.all().some((d) => d.domain === domain))
        return errorResponse(422, "This domain has already been added.")
      const website =
        typeof body.websiteId === "string"
          ? db.websites.find(body.websiteId)
          : undefined
      if (!website) return errorResponse(422, "Select a website that exists.")

      const created = db.domains.insert({
        id: crypto.randomUUID(),
        domain,
        websiteId: website.id,
        websiteName: website.name,
        status: "pending",
        dnsRecords: DEMO_DNS_RECORDS,
        createdAt: new Date().toISOString(),
      })
      return HttpResponse.json(created, { status: 201 })
    }
  ),

  http.get<DomainParams, never, Domain | ErrorBody>(
    apiPath("/domains/:domainId"),
    async ({ params }) => {
      await delay()
      const domain = db.domains.find(params.domainId)
      if (!domain) return errorResponse(404, "Domain not found.")
      return HttpResponse.json(domain)
    }
  ),

  http.delete<DomainParams, never, ErrorBody | null>(
    apiPath("/domains/:domainId"),
    async ({ params }) => {
      await delay()
      if (!db.domains.remove(params.domainId))
        return errorResponse(404, "Domain not found.")
      return new HttpResponse(null, { status: 204 })
    }
  ),

  // There is no real DNS behind the mock, so pending domains stay pending.
  http.post<DomainParams, never, Domain | ErrorBody>(
    apiPath("/domains/:domainId/verify"),
    async ({ params }) => {
      await delay()
      const domain = db.domains.find(params.domainId)
      if (!domain) return errorResponse(404, "Domain not found.")
      return HttpResponse.json(domain)
    }
  ),
]
