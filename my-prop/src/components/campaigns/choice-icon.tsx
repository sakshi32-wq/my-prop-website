import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Small muted tile that holds an icon inside choice cards and list rows. */
export function ChoiceIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground",
        className
      )}
    >
      <Icon className="size-4" />
    </div>
  )
}
