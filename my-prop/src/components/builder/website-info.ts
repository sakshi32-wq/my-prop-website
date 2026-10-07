import { WEBSITES, WEBSITE_TOOLS } from "@/lib/mock-data"

export type UploadedFile = {
  id: string
  name: string
  size: number
  type: string
  /** Object URL for image previews (session only, never persisted). */
  preview?: string
}

export type WebsiteInfo = {
  projectName: string
  location: string
  description: string
  propertyType: string
  configurations: Array<string>
  priceRange: string
  amenities: Array<string>
  targetAudience: string
  aiTone: string
  generateWithAI: boolean
  uploadedFiles: Array<UploadedFile>
  additionalContent: {
    keyHighlights: string
    developerInfo: string
    nearbyLocations: string
    specialOffers: string
  }
  /** Ids from WEBSITE_TOOLS that are enabled. */
  enabledToolIds: Array<string>
}

export function getWebsiteMeta(id: string) {
  const website = WEBSITES.find((w) => w.id === id)
  return {
    website,
    name: website?.name ?? "Untitled Website",
    domain: website?.domain ?? "new-website.myprop.live",
  }
}

export function createDefaultWebsiteInfo(id: string): WebsiteInfo {
  const { website, name } = getWebsiteMeta(id)
  const enabledToolIds =
    website?.toolIds ?? WEBSITE_TOOLS.filter((t) => t.enabled).map((t) => t.id)

  if (!website) {
    return {
      projectName: name,
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
      enabledToolIds,
    }
  }

  return {
    projectName: name,
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
    enabledToolIds,
  }
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  )
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}
