import { WEBSITE_TOOLS } from "@/lib/mock-data"

export type UploadedFile = {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

export type WizardData = {
  projectName: string
  location: string
  description: string
  propertyType: string
  configurations: Array<string>
  priceRange: string
  amenities: Array<string>
  generateWithAI: boolean
  aiTone: string
  targetAudience: string
  templateId: string
  keyHighlights: string
  developerInfo: string
  nearbyLocations: string
  specialOffers: string
  tools: Record<string, boolean>
}

export type WizardErrors = Partial<Record<keyof WizardData, string>>

export type StepProps = {
  data: WizardData
  update: (patch: Partial<WizardData>) => void
  errors: WizardErrors
}

export const WIZARD_STEPS = [
  "Basic Info",
  "Property Type",
  "Amenities",
  "AI Settings",
  "Template",
  "Additional Content",
  "Website Tools",
] as const

export function createInitialData(): WizardData {
  return {
    projectName: "",
    location: "",
    description: "",
    propertyType: "",
    configurations: [],
    priceRange: "",
    amenities: [],
    generateWithAI: true,
    aiTone: "luxury",
    targetAudience: "",
    templateId: "1",
    keyHighlights: "",
    developerInfo: "",
    nearbyLocations: "",
    specialOffers: "",
    tools: Object.fromEntries(
      WEBSITE_TOOLS.map((tool) => [tool.id, tool.enabled])
    ),
  }
}

export function validateStep(step: number, data: WizardData): WizardErrors {
  const errors: WizardErrors = {}
  if (step === 1) {
    if (!data.projectName.trim()) errors.projectName = "Enter a project name."
    if (!data.location.trim()) errors.location = "Enter the project location."
  }
  if (step === 2) {
    if (!data.propertyType) errors.propertyType = "Select a property type."
    if (data.configurations.length === 0) {
      errors.configurations = "Select at least one configuration."
    }
  }
  return errors
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const units = ["Bytes", "KB", "MB", "GB"]
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  return `${Math.round((bytes / Math.pow(1024, index)) * 100) / 100} ${units[index]}`
}
