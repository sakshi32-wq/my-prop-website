import { useEffect, useRef, useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { copyToClipboard } from "./utils"
import { Button } from "@/components/ui/button"

export function CopyButton({
  text,
  label = "Copy",
  showLabel = false,
  variant = "ghost",
  size,
}: {
  text: string
  label?: string
  showLabel?: boolean
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function handleCopy() {
    if (await copyToClipboard(text)) {
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1500)
    }
  }

  const Icon = copied ? CheckIcon : CopyIcon

  if (showLabel) {
    return (
      <Button variant={variant} size={size ?? "sm"} onClick={handleCopy}>
        <Icon data-icon="inline-start" />
        {label}
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size ?? "icon-sm"}
      onClick={handleCopy}
      aria-label={label}
      title={label}
    >
      <Icon />
    </Button>
  )
}
