import { addDays, format, subMonths } from "date-fns"

import type { Invoice, Subscription } from "@/api/generated/model"

export type { Invoice, Subscription } from "@/api/generated/model"

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`
}

const today = new Date()
const renewal = addDays(today, 8)

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_SUBSCRIPTION: Subscription = {
  plan: {
    id: "growth",
    name: "Growth Plan",
    tagline: "Perfect for growing developers",
    priceInr: 14999,
  },
  status: "active",
  currentPeriodEnd: format(renewal, "yyyy-MM-dd"),
  usage: [
    // The mock API replaces "used" for websites with the live count.
    { key: "websites", label: "Websites", used: 0, limit: 15 },
    { key: "leads", label: "Leads This Month", used: 2847, limit: 5000 },
  ],
  paymentMethod: { brand: "Visa", last4: "4242", expMonth: 12, expYear: 2026 },
}

export const DEMO_INVOICES: Array<Invoice> = [1, 2, 3].map((monthsAgo) => {
  const issued = subMonths(renewal, monthsAgo)
  return {
    id: `7a8b9c0d-1e2f-4a3b-8c4d-5e6f7a8b9c0${monthsAgo}`,
    number: `INV-${format(issued, "yyyy")}-${format(issued, "MM")}`,
    issuedAt: format(issued, "yyyy-MM-dd"),
    amountInr: 14999,
    status: "paid",
  }
})
