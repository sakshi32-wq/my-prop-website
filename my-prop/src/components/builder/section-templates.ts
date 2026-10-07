import type { CSSProperties } from "react"

import { PHOTOS, unsplash } from "@/lib/mock-data"

import { uid, withStableIds } from "./tree-utils"
import type {
  BuilderElement,
  ElementType,
  Section,
  SectionIconKey,
  SectionType,
} from "./types"

// Colors below are website content (user-editable data rendered inside the
// canvas), not editor chrome.
const DARK = "#1e293b"
const ACCENT = "#10b981"
const BORDER = "#e2e8f0"

function el(
  type: ElementType,
  content: string | undefined,
  styles: CSSProperties,
  children?: Array<BuilderElement>
): BuilderElement {
  return { id: uid(), type, content, styles, children }
}

const sectionHeading = (text: string, marginBottom = 48) =>
  el("heading", text, {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom,
    textAlign: "center",
  })

const formInput = (placeholder: string): BuilderElement =>
  el("input", placeholder, {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    fontSize: 15,
    marginBottom: 0,
  })

export type SectionTemplate = {
  type: SectionType
  name: string
  icon: SectionIconKey
  create: () => Section
}

export const SECTION_TEMPLATES: Array<SectionTemplate> = [
  {
    type: "hero",
    name: "Hero Banner",
    icon: "layout",
    create: () => ({
      id: uid(),
      name: "Hero Banner",
      type: "hero",
      icon: "layout",
      styles: {
        backgroundColor: "#0f172a",
        backgroundImage: unsplash(PHOTOS.building, 1200, 600),
        padding: 96,
        height: 500,
        textAlign: "center",
        textColor: "#ffffff",
      },
      elements: [
        el("heading", "Welcome to Luxury Living", {
          fontSize: 48,
          fontWeight: "bold",
          marginBottom: 16,
        }),
        el("text", "Experience premium lifestyle with world-class amenities", {
          fontSize: 20,
          marginBottom: 32,
          opacity: 0.9,
        }),
        el("button", "Schedule a Visit", {
          backgroundColor: ACCENT,
          color: "#ffffff",
          padding: "12px 32px",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: "600",
        }),
      ],
    }),
  },
  {
    type: "gallery",
    name: "Photo Gallery",
    icon: "image",
    create: () => ({
      id: uid(),
      name: "Photo Gallery",
      type: "gallery",
      icon: "image",
      styles: { backgroundColor: "#ffffff", padding: 80, textColor: DARK },
      elements: [
        sectionHeading("Gallery"),
        el(
          "container",
          undefined,
          { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
          [PHOTOS.interior1, PHOTOS.interior2, PHOTOS.interior3].map((photo) =>
            el("image", unsplash(photo, 400, 300), {
              borderRadius: 12,
              width: "100%",
              height: 250,
              objectFit: "cover",
            })
          )
        ),
      ],
    }),
  },
  {
    type: "amenities",
    name: "Amenities Grid",
    icon: "grid",
    create: () => ({
      id: uid(),
      name: "Amenities",
      type: "amenities",
      icon: "grid",
      styles: { backgroundColor: "#f8fafc", padding: 80, textColor: DARK },
      elements: [
        sectionHeading("World-Class Amenities"),
        el(
          "container",
          undefined,
          { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
          [
            "Swimming Pool",
            "Fitness Center",
            "Garden",
            "Parking",
            "Security",
            "Club House",
          ].map((amenity) =>
            el(
              "container",
              undefined,
              {
                padding: 32,
                backgroundColor: "#ffffff",
                borderRadius: 12,
                textAlign: "center",
                border: `2px solid ${BORDER}`,
              },
              [el("text", amenity, { fontSize: 18, fontWeight: "600" })]
            )
          )
        ),
      ],
    }),
  },
  {
    type: "pricing",
    name: "Pricing Table",
    icon: "columns",
    create: () => ({
      id: uid(),
      name: "Pricing",
      type: "pricing",
      icon: "columns",
      styles: { backgroundColor: "#ffffff", padding: 80, textColor: DARK },
      elements: [
        sectionHeading("Choose Your Dream Home"),
        el(
          "container",
          undefined,
          {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            maxWidth: 1200,
            margin: "0 auto",
          },
          [
            { title: "2 BHK", price: "₹85 L", area: 850, rooms: 2 },
            { title: "3 BHK", price: "₹1.2 Cr", area: 1200, rooms: 3 },
            { title: "4 BHK", price: "₹1.8 Cr", area: 1800, rooms: 4 },
          ].map((plan, i) => {
            const featured = i === 1
            return el(
              "container",
              undefined,
              {
                padding: 40,
                backgroundColor: featured ? ACCENT : "#ffffff",
                color: featured ? "#ffffff" : DARK,
                borderRadius: 16,
                border: featured ? "none" : `2px solid ${BORDER}`,
                boxShadow: featured
                  ? "0 20px 40px rgba(16, 185, 129, 0.3)"
                  : "none",
              },
              [
                el("heading", plan.title, {
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 16,
                  textAlign: "center",
                }),
                el("text", plan.price, {
                  fontSize: 36,
                  fontWeight: "bold",
                  marginBottom: 24,
                  textAlign: "center",
                }),
                el(
                  "text",
                  `${plan.area} sq.ft • ${plan.rooms} Bedrooms • ${plan.rooms} Bathrooms`,
                  {
                    fontSize: 14,
                    marginBottom: 24,
                    textAlign: "center",
                    opacity: 0.8,
                  }
                ),
                el("button", "View Details", {
                  backgroundColor: featured ? "#ffffff" : ACCENT,
                  color: featured ? ACCENT : "#ffffff",
                  padding: "12px 32px",
                  borderRadius: 8,
                  width: "100%",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                }),
              ]
            )
          })
        ),
      ],
    }),
  },
  {
    type: "contact",
    name: "Contact Form",
    icon: "form",
    create: () => ({
      id: uid(),
      name: "Contact Form",
      type: "contact",
      icon: "form",
      styles: { backgroundColor: "#0f172a", padding: 80, textColor: "#ffffff" },
      elements: [
        sectionHeading("Get in Touch", 16),
        el("text", "Schedule a site visit or request more information", {
          fontSize: 18,
          marginBottom: 48,
          textAlign: "center",
          opacity: 0.9,
        }),
        el(
          "container",
          undefined,
          {
            maxWidth: 600,
            margin: "0 auto",
            backgroundColor: "rgba(255,255,255,0.05)",
            padding: 40,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            textAlign: "left",
          },
          [
            el(
              "container",
              undefined,
              {
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
              },
              [formInput("Full name"), formInput("Phone number")]
            ),
            formInput("Email address"),
            el("textarea", "I'm interested in a 3 BHK. Please call me back.", {
              width: "100%",
              minHeight: 120,
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#ffffff",
              fontSize: 15,
              resize: "none",
            }),
            el("button", "Request a Callback", {
              backgroundColor: ACCENT,
              color: "#ffffff",
              padding: "14px 32px",
              borderRadius: 8,
              width: "100%",
              fontSize: 16,
              fontWeight: "600",
            }),
          ]
        ),
      ],
    }),
  },
  {
    type: "features",
    name: "Features Section",
    icon: "rows",
    create: () => ({
      id: uid(),
      name: "Features",
      type: "features",
      icon: "rows",
      styles: { backgroundColor: "#ffffff", padding: 80, textColor: DARK },
      elements: [
        sectionHeading("Why Choose Us"),
        el(
          "container",
          undefined,
          {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 40,
            maxWidth: 1000,
            margin: "0 auto",
          },
          [
            {
              title: "Prime Location",
              text: "Minutes from the metro, top schools and business districts.",
            },
            {
              title: "Smart Design",
              text: "Vastu-compliant layouts with abundant natural light.",
            },
            {
              title: "Eco-Friendly",
              text: "Rainwater harvesting, solar power and green open spaces.",
            },
            {
              title: "Easy Financing",
              text: "Pre-approved loans from leading banks and flexible plans.",
            },
          ].map((feature) =>
            el("container", undefined, { display: "flex", gap: 20 }, [
              el("text", "✨", { fontSize: 32 }),
              el("container", undefined, { textAlign: "left" }, [
                el("heading", feature.title, {
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 8,
                }),
                el("text", feature.text, {
                  fontSize: 15,
                  opacity: 0.7,
                  lineHeight: 1.6,
                }),
              ]),
            ])
          )
        ),
      ],
    }),
  },
]

export function createDefaultSections(): Array<Section> {
  return [withStableIds(SECTION_TEMPLATES[0].create(), "default-hero")]
}
