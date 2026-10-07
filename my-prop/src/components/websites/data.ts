import { subDays } from "date-fns"

import type { Website, WebsiteInfo } from "@/api/generated/model"
import { PHOTOS, WEBSITE_TOOLS, unsplash } from "@/lib/mock-data"

export type {
  Website,
  WebsiteContent,
  WebsiteFile,
  WebsiteInfo,
  WebsiteInput,
  WebsiteStatus,
} from "@/api/generated/model"

export function formatConversion(rate: number) {
  return `${rate.toFixed(1)}%`
}

/** Tool ids that new websites start with. */
export const DEFAULT_TOOL_IDS = WEBSITE_TOOLS.filter((t) => t.enabled).map(
  (t) => t.id
)

/** Project info for a website that has nothing but a name yet. */
export function emptyWebsiteInfo(projectName: string): WebsiteInfo {
  return {
    projectName,
    location: "",
    description: "",
    propertyType: "apartment",
    configurations: [],
    priceRange: "",
    amenities: [],
    targetAudience: "",
    aiTone: "luxury",
    generateWithAI: true,
    uploadedFiles: [],
    additionalContent: {
      keyHighlights: "",
      developerInfo: "",
      nearbyLocations: "",
      specialOffers: "",
    },
    enabledToolIds: DEFAULT_TOOL_IDS,
  }
}

const now = new Date()

function demoWebsite(
  site: Omit<
    Website,
    "thumbnailUrl" | "templateId" | "createdAt" | "updatedAt" | "publishedAt"
  > & { photo: string; ageDays: number }
): Website {
  const { photo, ageDays, ...rest } = site
  const createdAt = subDays(now, ageDays).toISOString()
  return {
    ...rest,
    thumbnailUrl: unsplash(photo, 600, 375),
    templateId: "1",
    createdAt,
    updatedAt: createdAt,
    publishedAt: rest.status === "live" ? createdAt : null,
  }
}

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_WEBSITES: Array<Website> = [
  demoWebsite({
    id: "fbb777ab-e963-4c0a-8725-154038811399",
    name: "Skyline Heights",
    domain: "skyline-heights.myprop.live",
    status: "live",
    views: 1245,
    leads: 234,
    conversionRate: 18.8,
    photo: PHOTOS.building,
    toolIds: [
      "contact-form",
      "whatsapp-chat",
      "schedule-visit",
      "google-analytics",
    ],
    ageDays: 120,
  }),
  demoWebsite({
    id: "b8e1b63a-c8e1-4e12-b997-a0a9ec809eb9",
    name: "Green Valley Villas",
    domain: "green-valley.myprop.live",
    status: "live",
    views: 987,
    leads: 189,
    conversionRate: 19.1,
    photo: PHOTOS.villa,
    toolIds: [
      "contact-form",
      "whatsapp-chat",
      "emi-calculator",
      "virtual-tour",
    ],
    ageDays: 90,
  }),
  demoWebsite({
    id: "165a0d31-936e-4d43-9c01-d8e53fd0d53b",
    name: "Marina Bay Apartments",
    domain: "marina-bay.myprop.live",
    status: "live",
    views: 756,
    leads: 156,
    conversionRate: 20.6,
    photo: PHOTOS.tower,
    toolIds: ["contact-form", "live-chat", "promotion-banner", "notifications"],
    ageDays: 60,
  }),
  demoWebsite({
    id: "6905f088-17cc-4261-8e8f-9f90a29d31b5",
    name: "Riverside Residency",
    domain: "riverside.myprop.live",
    status: "draft",
    views: 0,
    leads: 0,
    conversionRate: 0,
    photo: PHOTOS.office,
    toolIds: ["contact-form", "whatsapp-chat"],
    ageDays: 7,
  }),
]

/** Seed project info for each demo website (the builder's "website info"). */
export function demoWebsiteInfo(website: Website): WebsiteInfo {
  return {
    projectName: website.name,
    location: "Andheri West, Mumbai",
    description: "Luxury residential apartments in the heart of Mumbai",
    propertyType: "apartment",
    configurations: ["2 BHK", "3 BHK"],
    priceRange: "₹80L - ₹1.5Cr",
    amenities: ["Swimming Pool", "Gym", "Parking", "24/7 Security"],
    targetAudience: "Young professionals, Families",
    aiTone: "luxury",
    generateWithAI: true,
    uploadedFiles: [],
    additionalContent: {
      keyHighlights: "Prime location, Vastu compliant",
      developerInfo: "Award-winning developer with 20+ years experience",
      nearbyLocations: "Metro station 500m, Schools nearby",
      specialOffers: "Limited time offer: 10% discount",
    },
    enabledToolIds: website.toolIds,
  }
}
