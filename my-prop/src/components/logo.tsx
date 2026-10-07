import { Link } from "@tanstack/react-router"
import { GlobeIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className
      )}
    >
      <GlobeIcon className="size-4" />
    </div>
  )
}

export function Logo({
  to = "/",
  className,
}: {
  to?: string
  className?: string
}) {
  return (
    <Link to={to} className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-lg font-semibold">myprop.live</span>
    </Link>
  )
}
