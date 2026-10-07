import { GlobeIcon } from "lucide-react"

import type { GeneratedTemplate } from "@/components/templates/template-data"
import { Swatches } from "@/components/templates/wizard-steps"
import {
  DESIGN_STYLES,
  LAYOUT_STYLES,
  optionLabel,
} from "@/components/templates/wizard-options"
import type { WizardData } from "@/components/templates/wizard-options"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

/** Wireframe placeholder standing in for the AI-generated design. */
export function GeneratedPreview({
  template,
  data,
}: {
  template: GeneratedTemplate
  data: WizardData
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="flex items-center gap-2 border-b bg-muted px-3 py-2 text-xs text-muted-foreground">
        <GlobeIcon className="size-3.5 shrink-0" />
        <span className="truncate">{template.name} — preview</span>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col items-center gap-3 rounded-md bg-muted/50 px-4 py-8 text-center">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="aspect-video" />
          <Skeleton className="aspect-video" />
          <Skeleton className="aspect-video" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Swatches value={data.colorScheme} />
          <Badge variant="secondary">
            {optionLabel(DESIGN_STYLES, data.designStyle)}
          </Badge>
          <Badge variant="secondary">
            {optionLabel(LAYOUT_STYLES, data.layoutStyle)}
          </Badge>
          {data.sections.map((section) => (
            <Badge key={section} variant="outline">
              {section}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
