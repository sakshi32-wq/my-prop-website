import { describe, expect, it } from "vitest"

import {
  createDomain,
  deleteDomain,
  getDomain,
  listDomains,
  verifyDomain,
} from "@/api/generated/domains/domains"
import { DEMO_DOMAINS } from "@/components/settings/domains-data"

describe("domains mock API", () => {
  it("lists oldest first", async () => {
    expect((await listDomains()).map((d) => d.domain)).toEqual(
      DEMO_DOMAINS.map((d) => d.domain)
    )
  })

  it("creates a pending domain with DNS records, verifies and deletes", async () => {
    const created = await createDomain({
      domain: " New-Site.COM ",
      websiteId: "4",
    })
    expect(created).toMatchObject({
      domain: "new-site.com",
      status: "pending",
      websiteName: "Riverside Residency",
    })
    expect(created.dnsRecords.map((r) => r.type)).toEqual(["A", "CNAME"])
    expect((await verifyDomain(created.id)).status).toBe("pending")

    await deleteDomain(created.id)
    await expect(getDomain(created.id)).rejects.toMatchObject({ status: 404 })
  })

  it("rejects invalid, duplicate and unknown-website domains", async () => {
    await expect(
      createDomain({ domain: "https://x.com", websiteId: "1" })
    ).rejects.toMatchObject({ status: 422 })
    await expect(
      createDomain({ domain: "marinabay.in", websiteId: "1" })
    ).rejects.toMatchObject({
      status: 422,
      message: "This domain has already been added.",
    })
    await expect(
      createDomain({ domain: "fresh.com", websiteId: "nope" })
    ).rejects.toMatchObject({ status: 422 })
  })
})
