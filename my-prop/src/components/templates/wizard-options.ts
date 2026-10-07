import {
  HouseIcon,
  LayoutTemplateIcon,
  MessageSquareIcon,
  PaletteIcon,
  SparklesIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { LibraryTemplate } from "@/components/templates/template-data"
import { PHOTOS } from "@/lib/mock-data"

export type Option = { value: string; label: string; description?: string }

export const WIZARD_STEPS: Array<{ name: string; icon: LucideIcon }> = [
  { name: "Template Type & Purpose", icon: HouseIcon },
  { name: "Design Style & Colors", icon: PaletteIcon },
  { name: "Layout & Sections", icon: LayoutTemplateIcon },
  { name: "Content & Features", icon: MessageSquareIcon },
  { name: "Generate & Preview", icon: SparklesIcon },
]

export const TEMPLATE_TYPES: Array<Option> = [
  { value: "single-property", label: "Single Property Showcase" },
  { value: "multi-property", label: "Multi-Property Listing" },
  { value: "builder-portfolio", label: "Builder/Developer Portfolio" },
  { value: "broker-profile", label: "Broker Profile & Listings" },
  { value: "project-launch", label: "New Project Launch" },
  { value: "landing-page", label: "Lead Generation Landing Page" },
]

export const WIZARD_PROPERTY_TYPES: Array<Option> = [
  { value: "luxury-apartments", label: "Luxury Apartments" },
  { value: "villas", label: "Villas & Independent Houses" },
  { value: "commercial", label: "Commercial Properties" },
  { value: "affordable-housing", label: "Affordable Housing" },
  { value: "plots", label: "Plots & Land" },
  { value: "penthouses", label: "Penthouses" },
]

export const TARGET_AUDIENCES: Array<Option> = [
  { value: "luxury-buyers", label: "Luxury Home Buyers" },
  { value: "first-time", label: "First-time Home Buyers" },
  { value: "investors", label: "Property Investors" },
  { value: "families", label: "Growing Families" },
  { value: "professionals", label: "Working Professionals" },
  { value: "nri", label: "NRI Buyers" },
]

export const DESIGN_STYLES: Array<Option> = [
  {
    value: "luxury",
    label: "Luxury & Premium",
    description: "Elegant, sophisticated",
  },
  {
    value: "modern",
    label: "Modern & Minimal",
    description: "Clean, contemporary",
  },
  { value: "warm", label: "Warm & Inviting", description: "Cozy, welcoming" },
  {
    value: "bold",
    label: "Bold & Vibrant",
    description: "Eye-catching, energetic",
  },
]

/** Swatches reference theme chart tokens rather than hard-coded colours. */
export const COLOR_SCHEMES: Array<Option & { swatches: [number, number] }> = [
  { value: "blue-gold", label: "Blue & Gold", swatches: [3, 1] },
  { value: "emerald-teal", label: "Emerald & Teal", swatches: [2, 4] },
  { value: "purple-pink", label: "Purple & Pink", swatches: [4, 1] },
  { value: "dark-elegant", label: "Dark & Elegant", swatches: [5, 2] },
  { value: "earth-tones", label: "Earth Tones", swatches: [3, 2] },
  { value: "monochrome", label: "Monochrome", swatches: [5, 1] },
]

export const LAYOUT_STYLES: Array<Option> = [
  {
    value: "single-page",
    label: "Single Page",
    description: "All-in-one scrolling",
  },
  { value: "multi-page", label: "Multi Page", description: "Separate pages" },
  { value: "hybrid", label: "Hybrid", description: "Best of both" },
]

export const SECTION_OPTIONS = [
  "Hero Banner",
  "About/Overview",
  "Floor Plans",
  "Amenities",
  "Location & Map",
  "Gallery",
  "Pricing",
  "Virtual Tour",
  "Testimonials",
  "Contact Form",
  "Site Visit Booking",
  "FAQ Section",
]

export const HERO_STYLES: Array<Option> = [
  {
    value: "fullscreen-video",
    label: "Fullscreen Video",
    description: "Immersive video background",
  },
  {
    value: "image-slider",
    label: "Image Slider",
    description: "Multiple property images",
  },
  {
    value: "split-screen",
    label: "Split Screen",
    description: "Content + Image split",
  },
  {
    value: "minimalist",
    label: "Minimalist",
    description: "Clean with CTA focus",
  },
]

export const FEATURE_OPTIONS = [
  "AI Chatbot",
  "WhatsApp Integration",
  "Live Chat",
  "Lead Capture Forms",
  "Virtual Site Tour",
  "EMI Calculator",
  "Interactive Floor Plans",
  "360° Gallery",
]

export type WizardData = {
  templateType: string
  propertyType: string
  targetAudience: string
  designStyle: string
  colorScheme: string
  layoutStyle: string
  sections: Array<string>
  heroStyle: string
  features: Array<string>
  templateName: string
  templateDescription: string
}

export const EMPTY_WIZARD_DATA: WizardData = {
  templateType: "",
  propertyType: "",
  targetAudience: "",
  designStyle: "",
  colorScheme: "",
  layoutStyle: "",
  sections: [],
  heroStyle: "",
  features: [],
  templateName: "",
  templateDescription: "",
}

export type WizardErrors = Partial<Record<keyof WizardData, string>>

/** Validation for steps 1–4 (index 0–3). */
export function validateStep(step: number, data: WizardData): WizardErrors {
  const errors: WizardErrors = {}
  if (step === 0) {
    if (!data.templateType) errors.templateType = "Choose a template type."
    if (!data.propertyType) errors.propertyType = "Choose a property type."
    if (!data.targetAudience)
      errors.targetAudience = "Choose a target audience."
  }
  if (step === 1) {
    if (!data.designStyle) errors.designStyle = "Choose a design style."
    if (!data.colorScheme) errors.colorScheme = "Choose a colour scheme."
  }
  if (step === 2) {
    if (!data.layoutStyle) errors.layoutStyle = "Choose a layout style."
    if (data.sections.length === 0)
      errors.sections = "Select at least one section."
  }
  if (step === 3) {
    if (!data.heroStyle) errors.heroStyle = "Choose a hero section style."
    if (data.features.length === 0)
      errors.features = "Select at least one feature."
  }
  return errors
}

export function optionLabel(options: Array<Option>, value: string) {
  return options.find((option) => option.value === value)?.label ?? "—"
}

const CATEGORY_BY_PROPERTY: Record<string, string> = {
  "luxury-apartments": "High-Rise",
  villas: "Villas",
  commercial: "Commercial",
  "affordable-housing": "Affordable",
  plots: "New Development",
  penthouses: "High-Rise",
}

const PHOTO_BY_PROPERTY: Record<string, string> = {
  "luxury-apartments": PHOTOS.tower,
  villas: PHOTOS.villa,
  commercial: PHOTOS.office,
  "affordable-housing": PHOTOS.building,
  plots: PHOTOS.interior3,
  penthouses: PHOTOS.interior2,
}

export function buildGeneratedTemplate(data: WizardData): LibraryTemplate {
  const style = optionLabel(DESIGN_STYLES, data.designStyle)
  const type = optionLabel(TEMPLATE_TYPES, data.templateType)
  return {
    id: Date.now(),
    name: data.templateName.trim() || `Custom ${style.split(" ")[0]} Template`,
    category: CATEGORY_BY_PROPERTY[data.propertyType] ?? "New Development",
    thumbnail: PHOTO_BY_PROPERTY[data.propertyType] ?? PHOTOS.building,
    rating: 5,
    uses: 0,
    isPremium: false,
    isCustom: true,
    description:
      data.templateDescription.trim() ||
      `AI-generated ${type.toLowerCase()} for ${optionLabel(
        TARGET_AUDIENCES,
        data.targetAudience
      ).toLowerCase()}`,
    tags: ["ai-generated", data.designStyle, data.layoutStyle, data.heroStyle],
  }
}
