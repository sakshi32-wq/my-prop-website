import {
  BuildingIcon,
  DumbbellIcon,
  FerrisWheelIcon,
  SquareParkingIcon,
  TreesIcon,
  WavesIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { PHOTOS } from "@/lib/mock-data"
import type { Template } from "@/lib/mock-data"

/** A template shown in the library. AI-generated ones are flagged as custom. */
export type LibraryTemplate = Template & { isCustom?: boolean }

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

/** Six gallery photos, starting after the template's own thumbnail. */
export function galleryPhotos(thumbnail: string) {
  const photos: Array<string> = Object.values(PHOTOS)
  const start = Math.max(photos.indexOf(thumbnail), 0) + 1
  return Array.from(
    { length: 6 },
    (_, i) => photos[(start + i) % photos.length]
  )
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function templateShareUrl(id: number) {
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
