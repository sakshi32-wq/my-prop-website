import {
  BuildingIcon,
  DumbbellIcon,
  FerrisWheelIcon,
  SquareParkingIcon,
  TreesIcon,
  WavesIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { subDays } from "date-fns"

import type {
  ListTemplatesParams,
  Template,
  TemplateInput,
} from "@/api/generated/model"
import { PHOTOS, unsplash } from "@/lib/mock-data"

export type {
  Template,
  TemplateInput,
  TemplatePrice,
} from "@/api/generated/model"

/** A template shown in the library. AI-generated ones are flagged as custom. */
export type LibraryTemplate = Template

/** What the AI generator produces before it's saved to the library. */
export type GeneratedTemplate = TemplateInput

export const ALL_CATEGORIES = "All Templates"

export type PriceFilter = "all" | "premium" | "free"

export const PREVIEW_SECTIONS = [
  { id: "hero", name: "Hero Section" },
  { id: "about", name: "About" },
  { id: "features", name: "Features" },
  { id: "gallery", name: "Gallery" },
  { id: "contact", name: "Contact" },
] as const
export type PreviewSectionId = (typeof PREVIEW_SECTIONS)[number]["id"]

export const TEMPLATE_FEATURES = [
  "Responsive Design",
  "SEO Optimized",
  "Fast Loading",
  "Mobile First",
  "Contact Forms",
  "Social Integration",
  "Analytics Ready",
  "Cross-Browser Compatible",
]

export const ABOUT_HIGHLIGHTS = [
  "Prime Location",
  "Modern Amenities",
  "Sustainable Design",
  "24/7 Security",
]

export const PREVIEW_AMENITIES: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  { icon: WavesIcon, title: "Swimming Pool", description: "Olympic-size pool" },
  {
    icon: DumbbellIcon,
    title: "Fitness Center",
    description: "State-of-the-art gym",
  },
  { icon: TreesIcon, title: "Garden", description: "Landscaped gardens" },
  { icon: BuildingIcon, title: "Club House", description: "Modern club house" },
  {
    icon: FerrisWheelIcon,
    title: "Kids Play Area",
    description: "Safe play zone",
  },
  {
    icon: SquareParkingIcon,
    title: "Parking",
    description: "Ample parking space",
  },
]

export const INCLUDED_FEATURES = [
  "SSL Certificate",
  "CDN Hosting",
  "Mobile Responsive",
  "SEO Optimized",
  "Analytics Tracking",
  "Contact Forms",
  "WhatsApp Integration",
  "Lead Management",
]

/** Six gallery images, starting after the template's own photo. */
export function demoGalleryUrls(photo: string) {
  const photos: Array<string> = Object.values(PHOTOS)
  const start = Math.max(photos.indexOf(photo), 0) + 1
  return Array.from({ length: 6 }, (_, i) =>
    unsplash(photos[(start + i) % photos.length], 400, 300)
  )
}

export function templateThumbnailUrl(photo: string) {
  return unsplash(photo, 1200, 900)
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function templateShareUrl(id: string) {
  const path = `/app/templates?preview=${id}`
  return typeof window === "undefined" ? path : window.location.origin + path
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Maps the library's filters to listTemplates query params. Empty values are
 * dropped so equal filters always produce the same query key.
 */
export function toListTemplatesParams(filters: {
  query: string
  price: PriceFilter
  category: string
  tags: Array<string>
}): ListTemplatesParams | undefined {
  const params: ListTemplatesParams = {}
  const q = filters.query.trim()
  if (q) params.q = q
  if (filters.price !== "all") params.price = filters.price
  if (filters.category !== ALL_CATEGORIES) params.category = filters.category
  if (filters.tags.length > 0) params.tag = filters.tags
  return Object.keys(params).length > 0 ? params : undefined
}

const now = new Date()

function demoTemplate(
  template: Omit<
    Template,
    "thumbnailUrl" | "galleryUrls" | "isCustom" | "createdAt"
  > & { photo: string },
  index: number
): Template {
  const { photo, ...rest } = template
  return {
    ...rest,
    thumbnailUrl: templateThumbnailUrl(photo),
    galleryUrls: demoGalleryUrls(photo),
    isCustom: false,
    // Newest first keeps the library in this order.
    createdAt: subDays(now, 365 + index).toISOString(),
  }
}

/** Seed data for the mock API (src/mocks/db.ts). */
export const DEMO_TEMPLATES: Array<Template> = [
  {
    id: "2c4e6a8b-0d1f-4a3c-9e5b-7d9f1b3d5e01",
    name: "Luxury Launch",
    category: "New Development",
    photo: PHOTOS.building,
    rating: 4.9,
    uses: 1234,
    isPremium: true,
    description: "Perfect for high-end property launches",
    tags: ["luxury", "modern", "premium", "launch"],
  },
  {
    id: "2c4e6a8b-0d1f-4a3c-9e5b-7d9f1b3d5e02",
    name: "Modern Tower",
    category: "High-Rise",
    photo: PHOTOS.tower,
    rating: 4.8,
    uses: 987,
    isPremium: false,
    description: "Ideal for contemporary apartment complexes",
    tags: ["modern", "apartments", "urban", "tower"],
  },
  {
    id: "2c4e6a8b-0d1f-4a3c-9e5b-7d9f1b3d5e03",
    name: "Villa Showcase",
    category: "Villas",
    photo: PHOTOS.villa,
    rating: 4.7,
    uses: 756,
    isPremium: true,
    description: "Showcase luxury villas and independent houses",
    tags: ["luxury", "villas", "premium", "elegant"],
  },
  {
    id: "2c4e6a8b-0d1f-4a3c-9e5b-7d9f1b3d5e04",
    name: "Broker Profile",
    category: "Personal Brand",
    photo: PHOTOS.office,
    rating: 4.6,
    uses: 654,
    isPremium: false,
    description: "Build your personal real estate brand",
    tags: ["professional", "personal", "branding", "portfolio"],
  },
  {
    id: "2c4e6a8b-0d1f-4a3c-9e5b-7d9f1b3d5e05",
    name: "Investment Property",
    category: "Commercial",
    photo: PHOTOS.building,
    rating: 4.8,
    uses: 543,
    isPremium: true,
    description: "Attract investors with ROI focus",
    tags: ["commercial", "investment", "business", "roi"],
  },
  {
    id: "2c4e6a8b-0d1f-4a3c-9e5b-7d9f1b3d5e06",
    name: "Budget Homes",
    category: "Affordable",
    photo: PHOTOS.villa,
    rating: 4.5,
    uses: 432,
    isPremium: false,
    description: "Designed for affordable housing projects",
    tags: ["affordable", "budget", "housing", "family"],
  },
  {
    id: "2c4e6a8b-0d1f-4a3c-9e5b-7d9f1b3d5e07",
    name: "Eco Living",
    category: "Villas",
    photo: PHOTOS.interior1,
    rating: 4.9,
    uses: 890,
    isPremium: true,
    description: "Sustainable and eco-friendly properties",
    tags: ["eco-friendly", "sustainable", "green", "luxury"],
  },
  {
    id: "2c4e6a8b-0d1f-4a3c-9e5b-7d9f1b3d5e08",
    name: "Downtown Loft",
    category: "High-Rise",
    photo: PHOTOS.interior2,
    rating: 4.7,
    uses: 721,
    isPremium: false,
    description: "Urban loft-style apartments",
    tags: ["urban", "loft", "modern", "downtown"],
  },
].map(demoTemplate)
