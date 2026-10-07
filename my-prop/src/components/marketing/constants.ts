import { toast } from "sonner"

export const CONTAINER = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#templates", label: "Templates" },
  { href: "#pricing", label: "Pricing" },
] as const

export function requestDemo() {
  toast.success("Demo request received", {
    description: "Our team will reach out within one business day.",
  })
}
