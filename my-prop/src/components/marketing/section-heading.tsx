import { cn } from "@/lib/utils"

export function SectionHeading({
  title,
  description,
  className,
}: {
  title: string
  description: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-2xl flex-col gap-3 text-center",
        className
      )}
    >
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="text-lg text-balance text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
