import {
  AccessibilityIcon,
  CircleCheckIcon,
  CodeIcon,
  FileTextIcon,
  ImageIcon,
  SearchIcon,
  ShieldIcon,
  ZapIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Impact = "high" | "medium" | "low"

export type Issue = {
  title: string
  description: string
  impact: Impact
  element?: string
}

export const SCORES: Array<{ label: string; score: number; icon: LucideIcon }> =
  [
    { label: "Performance", score: 92, icon: ZapIcon },
    { label: "Accessibility", score: 88, icon: AccessibilityIcon },
    { label: "Best Practices", score: 95, icon: CircleCheckIcon },
    { label: "SEO", score: 100, icon: SearchIcon },
  ]

export const PERFORMANCE_METRICS = [
  {
    name: "First Contentful Paint",
    value: "1.2s",
    score: 95,
    description: "Time until first text or image is painted",
  },
  {
    name: "Largest Contentful Paint",
    value: "2.1s",
    score: 92,
    description: "Time until largest text or image is painted",
  },
  {
    name: "Total Blocking Time",
    value: "150ms",
    score: 88,
    description: "Sum of all time periods between FCP and Time to Interactive",
  },
  {
    name: "Cumulative Layout Shift",
    value: "0.05",
    score: 98,
    description: "Measures visual stability",
  },
  {
    name: "Speed Index",
    value: "2.4s",
    score: 90,
    description: "How quickly content is visually displayed",
  },
]

export const PERFORMANCE_OPPORTUNITIES: Array<Issue> = [
  {
    title: "Reduce unused JavaScript",
    description:
      "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity.",
    impact: "high",
    element: "Potential savings of 45 KB",
  },
  {
    title: "Properly size images",
    description:
      "Serve images that are appropriately-sized to save cellular data and improve load time.",
    impact: "medium",
    element: "Potential savings of 120 KB",
  },
  {
    title: "Enable text compression",
    description:
      "Text-based resources should be served with compression (gzip, deflate or brotli) to minimize total network bytes.",
    impact: "medium",
    element: "Potential savings of 28 KB",
  },
]

export const ACCESSIBILITY_ISSUES: Array<Issue> = [
  {
    title: "Image elements have [alt] attributes",
    description:
      "Informative elements should aim for short, descriptive alternate text. Decorative elements can be ignored with an empty alt attribute.",
    impact: "high",
    element: "2 images missing alt text",
  },
  {
    title: "Contrast ratio",
    description:
      "Background and foreground colors do not have a sufficient contrast ratio.",
    impact: "medium",
    element: "3 elements with low contrast",
  },
]

export const ACCESSIBILITY_PASSED = [
  "Document has a valid lang attribute",
  "Form elements have associated labels",
  "Links have a discernible name",
  "[aria-*] attributes are valid",
]

export const SEO_PASSED = [
  {
    title: "Document has a meta description",
    description:
      "Meta descriptions help search engines understand your content",
  },
  {
    title: "Page has successful HTTP status code",
    description:
      "Pages with unsuccessful status codes may not be indexed properly",
  },
  {
    title: "Links are crawlable",
    description: "Search engines can follow all links on your page",
  },
  {
    title: "Robots.txt is valid",
    description: "Properly configured robots.txt allows search engine crawling",
  },
  {
    title: "Document uses legible font sizes",
    description: "Font sizes are large enough for mobile devices",
  },
]

export const BEST_PRACTICES_PASSED: Array<{ label: string; icon: LucideIcon }> =
  [
    { label: "Uses HTTPS", icon: CodeIcon },
    { label: "No browser errors in console", icon: ShieldIcon },
    { label: "Images displayed with correct aspect ratio", icon: ImageIcon },
    { label: "Properly sized images", icon: FileTextIcon },
  ]
