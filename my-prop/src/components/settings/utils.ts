import { toast } from "sonner"

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Bare hostname: labels of letters/digits/hyphens (no leading/trailing hyphen) and a TLD.
export const HOSTNAME_RE =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/

export function getInitials(name: string) {
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

export function copyToClipboard(text: string, label = "Copied to clipboard") {
  navigator.clipboard.writeText(text).then(
    () => toast.success(label),
    () => toast.error("Could not access the clipboard")
  )
}

export function downloadTextFile(filename: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/plain" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const KEY_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export function randomToken(length: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(
    bytes,
    (byte) => KEY_ALPHABET[byte % KEY_ALPHABET.length]
  ).join("")
}

export function maskSecret(secret: string, visiblePrefix = 8) {
  return `${secret.slice(0, visiblePrefix)}${"•".repeat(16)}${secret.slice(-4)}`
}
