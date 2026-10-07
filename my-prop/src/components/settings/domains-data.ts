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
    websiteId: "fbb777ab-e963-4c0a-8725-154038811399",
    websiteName: "Skyline Heights",
    status: "active",
    dnsRecords: DEMO_DNS_RECORDS,
    createdAt: subDays(now, 40).toISOString(),
  },
  {
    id: "8e3f2a4b-5c6d-4e7f-9a0b-1c2d3e4f5a02",
    domain: "marinabay.in",
    websiteId: "165a0d31-936e-4d43-9c01-d8e53fd0d53b",
    websiteName: "Marina Bay Apartments",
    status: "pending",
    dnsRecords: DEMO_DNS_RECORDS,
    createdAt: subDays(now, 20).toISOString(),
  },
  {
    id: "8e3f2a4b-5c6d-4e7f-9a0b-1c2d3e4f5a03",
    domain: "greenvalley.com",
    websiteId: "b8e1b63a-c8e1-4e12-b997-a0a9ec809eb9",
    websiteName: "Green Valley Villas",
    status: "active",
    dnsRecords: DEMO_DNS_RECORDS,
    createdAt: subDays(now, 10).toISOString(),
  },
]
