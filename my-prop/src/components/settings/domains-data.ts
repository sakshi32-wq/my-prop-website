import { subDays } from "date-fns"

import type { DnsRecord, DnsRecordType, Domain } from "@/api/generated/model"

export type {
  DnsRecord,
  Domain,
  DomainInput,
  DomainStatus,
} from "@/api/generated/model"

export const DNS_RECORD_LABELS: Record<
  DnsRecordType,
  { label: string; copied: string }
> = {
  A: { label: "A Record", copied: "IP address copied" },
  CNAME: { label: "CNAME Record", copied: "CNAME copied" },
}

/** The records every custom domain needs (used by the mock API). */
export const DEMO_DNS_RECORDS: Array<DnsRecord> = [
  { type: "A", name: "@", value: "76.76.21.21" },
  { type: "CNAME", name: "www", value: "cname.myprop.live" },
]

const now = new Date()

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_DOMAINS: Array<Domain> = [
  {
    id: "8e3f2a4b-5c6d-4e7f-9a0b-1c2d3e4f5a01",
    domain: "skylineheights.com",
    websiteId: "1",
    websiteName: "Skyline Heights",
    status: "active",
    dnsRecords: DEMO_DNS_RECORDS,
    createdAt: subDays(now, 40).toISOString(),
  },
  {
    id: "8e3f2a4b-5c6d-4e7f-9a0b-1c2d3e4f5a02",
    domain: "marinabay.in",
    websiteId: "3",
    websiteName: "Marina Bay Apartments",
    status: "pending",
    dnsRecords: DEMO_DNS_RECORDS,
    createdAt: subDays(now, 20).toISOString(),
  },
  {
    id: "8e3f2a4b-5c6d-4e7f-9a0b-1c2d3e4f5a03",
    domain: "greenvalley.com",
    websiteId: "2",
    websiteName: "Green Valley Villas",
    status: "active",
    dnsRecords: DEMO_DNS_RECORDS,
    createdAt: subDays(now, 10).toISOString(),
  },
]
