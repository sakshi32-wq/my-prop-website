// Shared mock data and option lists. The reference app has no backend, so
// every page reads from here (or from its own local state) instead of an API.
import {
  BellIcon,
  CalculatorIcon,
  CalendarIcon,
  ChartNoAxesColumnIcon,
  GiftIcon,
  MailIcon,
  MessageSquareIcon,
  PhoneIcon,
  VideoIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { LeadSource, LeadStage } from "@/api/generated/model"

export type { LeadSource, LeadStage }

export function unsplash(photoId: string, width: number, height: number) {
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop`
}

export const PHOTOS = {
  building: "photo-1560518883-ce09059eeffa",
  tower: "photo-1545324418-cc1a3fa10c00",
  villa: "photo-1512917774080-9991f1c4c750",
  office: "photo-1486406146926-c627a92ad1ab",
  interior1: "photo-1600596542815-ffad4c1539a9",
  interior2: "photo-1600607687939-ce8a6c25118c",
  interior3: "photo-1600585154340-be6161a56a0c",
} as const

export const PROJECTS = [
  "Skyline Heights",
  "Marina Bay",
  "Green Valley",
  "Ocean View Residency",
  "Royal Gardens",
] as const

export const LEAD_SOURCES = [
  { value: "website", label: "Website" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "social", label: "Social Media" },
  { value: "referral", label: "Referral" },
  { value: "walk-in", label: "Walk-in" },
] as const satisfies ReadonlyArray<{ value: LeadSource; label: string }>

export const BUDGET_RANGES = [
  "₹40L - 60L",
  "₹60L - 80L",
  "₹80L - 1Cr",
  "₹1Cr - 1.5Cr",
  "₹1.5Cr - 2Cr",
  "₹2Cr+",
] as const

export const CONFIGURATIONS = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5 BHK",
  "Penthouse",
  "Villa",
  "Plot",
] as const

export const LEAD_STAGES = [
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "scheduled", label: "Site Visit Scheduled" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
] as const satisfies ReadonlyArray<{ value: LeadStage; label: string }>

export const QUICK_TAGS = [
  "Hot Lead",
  "First Time Buyer",
  "Investor",
  "NRI",
  "End User",
  "Resale Interest",
] as const

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment Complex" },
  { value: "villa", label: "Villas / Independent Houses" },
  { value: "penthouse", label: "Penthouses" },
  { value: "commercial", label: "Commercial Space" },
  { value: "plot", label: "Plots / Land" },
] as const

export const UNIT_CONFIGURATIONS = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5 BHK",
  "Duplex",
] as const

export const AMENITIES = [
  "Swimming Pool",
  "Gym",
  "Garden",
  "Parking",
  "24/7 Security",
  "Club House",
  "Kids Play Area",
  "Jogging Track",
  "Indoor Games",
  "Power Backup",
  "Elevator",
  "CCTV",
  "Intercom",
  "Fire Safety",
] as const

export const AI_TONES = [
  { value: "luxury", label: "Luxury & Premium" },
  { value: "budget", label: "Budget-Friendly & Affordable" },
  { value: "investor", label: "Investor-Focused" },
  { value: "family", label: "Family-Oriented" },
] as const

export type WebsiteTool = {
  id: string
  name: string
  description: string
  category: "lead-generation" | "engagement" | "analytics" | "utilities"
  icon: LucideIcon
  enabled: boolean
}

export const WEBSITE_TOOLS: Array<WebsiteTool> = [
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Allow visitors to contact you directly",
    category: "lead-generation",
    icon: MailIcon,
    enabled: true,
  },
  {
    id: "lead-capture",
    name: "Lead Capture Form",
    description: "Capture visitor information with custom forms",
    category: "lead-generation",
    icon: MessageSquareIcon,
    enabled: false,
  },
  {
    id: "whatsapp-chat",
    name: "WhatsApp Chat Widget",
    description: "Enable WhatsApp chat for instant communication",
    category: "engagement",
    icon: PhoneIcon,
    enabled: true,
  },
  {
    id: "schedule-visit",
    name: "Schedule Visit",
    description: "Let visitors book property visits",
    category: "lead-generation",
    icon: CalendarIcon,
    enabled: false,
  },
  {
    id: "live-chat",
    name: "Live Chat",
    description: "Real-time chat with visitors",
    category: "engagement",
    icon: MessageSquareIcon,
    enabled: false,
  },
  {
    id: "email-popup",
    name: "Email Popup",
    description: "Collect emails with popup forms",
    category: "lead-generation",
    icon: MailIcon,
    enabled: false,
  },
  {
    id: "promotion-banner",
    name: "Promotion Banner",
    description: "Display special offers and announcements",
    category: "engagement",
    icon: GiftIcon,
    enabled: false,
  },
  {
    id: "notifications",
    name: "Push Notifications",
    description: "Send updates to subscribed visitors",
    category: "engagement",
    icon: BellIcon,
    enabled: false,
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track website traffic and behavior",
    category: "analytics",
    icon: ChartNoAxesColumnIcon,
    enabled: false,
  },
  {
    id: "facebook-pixel",
    name: "Facebook Pixel",
    description: "Track conversions and retarget visitors",
    category: "analytics",
    icon: ChartNoAxesColumnIcon,
    enabled: false,
  },
  {
    id: "call-tracking",
    name: "Call Tracking",
    description: "Track phone call conversions",
    category: "analytics",
    icon: PhoneIcon,
    enabled: false,
  },
  {
    id: "virtual-tour",
    name: "Virtual Tour",
    description: "360° property tours",
    category: "utilities",
    icon: VideoIcon,
    enabled: false,
  },
  {
    id: "emi-calculator",
    name: "EMI Calculator",
    description: "Help visitors calculate loan EMIs",
    category: "utilities",
    icon: CalculatorIcon,
    enabled: false,
  },
  {
    id: "mortgage-calculator",
    name: "Mortgage Calculator",
    description: "Calculate mortgage and affordability",
    category: "utilities",
    icon: CalculatorIcon,
    enabled: false,
  },
]

export type Website = {
  id: string
  name: string
  domain: string
  status: "live" | "draft"
  views: number
  leads: number
  conversion: string
  thumbnail: string
  toolIds: Array<string>
}

export const WEBSITES: Array<Website> = [
  {
    id: "1",
    name: "Skyline Heights",
    domain: "skyline-heights.myprop.live",
    status: "live",
    views: 1245,
    leads: 234,
    conversion: "18.8%",
    thumbnail: PHOTOS.building,
    toolIds: [
      "contact-form",
      "whatsapp-chat",
      "schedule-visit",
      "google-analytics",
    ],
  },
  {
    id: "2",
    name: "Green Valley Villas",
    domain: "green-valley.myprop.live",
    status: "live",
    views: 987,
    leads: 189,
    conversion: "19.1%",
    thumbnail: PHOTOS.villa,
    toolIds: [
      "contact-form",
      "whatsapp-chat",
      "emi-calculator",
      "virtual-tour",
    ],
  },
  {
    id: "3",
    name: "Marina Bay Apartments",
    domain: "marina-bay.myprop.live",
    status: "live",
    views: 756,
    leads: 156,
    conversion: "20.6%",
    thumbnail: PHOTOS.tower,
    toolIds: ["contact-form", "live-chat", "promotion-banner", "notifications"],
  },
  {
    id: "4",
    name: "Riverside Residency",
    domain: "riverside.myprop.live",
    status: "draft",
    views: 0,
    leads: 0,
    conversion: "0%",
    thumbnail: PHOTOS.office,
    toolIds: ["contact-form", "whatsapp-chat"],
  },
]

export type Template = {
  id: number
  name: string
  category: string
  thumbnail: string
  rating: number
  uses: number
  isPremium: boolean
  description: string
  tags: Array<string>
}

export const TEMPLATE_CATEGORIES = [
  "All Templates",
  "New Development",
  "High-Rise",
  "Villas",
  "Commercial",
  "Personal Brand",
  "Affordable",
] as const

export const TEMPLATES: Array<Template> = [
  {
    id: 1,
    name: "Luxury Launch",
    category: "New Development",
    thumbnail: PHOTOS.building,
    rating: 4.9,
    uses: 1234,
    isPremium: true,
    description: "Perfect for high-end property launches",
    tags: ["luxury", "modern", "premium", "launch"],
  },
  {
    id: 2,
    name: "Modern Tower",
    category: "High-Rise",
    thumbnail: PHOTOS.tower,
    rating: 4.8,
    uses: 987,
    isPremium: false,
    description: "Ideal for contemporary apartment complexes",
    tags: ["modern", "apartments", "urban", "tower"],
  },
  {
    id: 3,
    name: "Villa Showcase",
    category: "Villas",
    thumbnail: PHOTOS.villa,
    rating: 4.7,
    uses: 756,
    isPremium: true,
    description: "Showcase luxury villas and independent houses",
    tags: ["luxury", "villas", "premium", "elegant"],
  },
  {
    id: 4,
    name: "Broker Profile",
    category: "Personal Brand",
    thumbnail: PHOTOS.office,
    rating: 4.6,
    uses: 654,
    isPremium: false,
    description: "Build your personal real estate brand",
    tags: ["professional", "personal", "branding", "portfolio"],
  },
  {
    id: 5,
    name: "Investment Property",
    category: "Commercial",
    thumbnail: PHOTOS.building,
    rating: 4.8,
    uses: 543,
    isPremium: true,
    description: "Attract investors with ROI focus",
    tags: ["commercial", "investment", "business", "roi"],
  },
  {
    id: 6,
    name: "Budget Homes",
    category: "Affordable",
    thumbnail: PHOTOS.villa,
    rating: 4.5,
    uses: 432,
    isPremium: false,
    description: "Designed for affordable housing projects",
    tags: ["affordable", "budget", "housing", "family"],
  },
  {
    id: 7,
    name: "Eco Living",
    category: "Villas",
    thumbnail: PHOTOS.interior1,
    rating: 4.9,
    uses: 890,
    isPremium: true,
    description: "Sustainable and eco-friendly properties",
    tags: ["eco-friendly", "sustainable", "green", "luxury"],
  },
  {
    id: 8,
    name: "Downtown Loft",
    category: "High-Rise",
    thumbnail: PHOTOS.interior2,
    rating: 4.7,
    uses: 721,
    isPremium: false,
    description: "Urban loft-style apartments",
    tags: ["urban", "loft", "modern", "downtown"],
  },
]
