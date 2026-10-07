import { EyeIcon, SparklesIcon, StarIcon, WandSparklesIcon } from "lucide-react"

import type { LibraryTemplate } from "@/components/templates/template-data"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { unsplash } from "@/lib/mock-data"

const MAX_TAGS = 3

export function TemplateCard({
  template,
  selectedTags,
  onToggleTag,
  onPreview,
  onUse,
}: {
  template: LibraryTemplate
  selectedTags: Array<string>
  onToggleTag: (tag: string) => void
  onPreview: () => void
  onUse: () => void
}) {
  const hiddenTags = template.tags.length - MAX_TAGS

  return (
    <Card className="group pt-0">
      <AspectRatio ratio={4 / 3} className="overflow-hidden bg-muted">
        <img
          src={unsplash(template.thumbnail, 600, 450)}
          alt={template.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-1.5">
          {template.isCustom && (
            <Badge variant="secondary">
              <WandSparklesIcon data-icon="inline-start" />
              AI Generated
            </Badge>
          )}
          {template.isPremium && (
            <Badge>
              <SparklesIcon data-icon="inline-start" />
              Premium
            </Badge>
          )}
        </div>
      </AspectRatio>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, MAX_TAGS).map((tag) => {
            const active = selectedTags.includes(tag)
            return (
              <Badge
                key={tag}
                asChild
                variant={active ? "default" : "outline"}
                className="cursor-pointer"
              >
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleTag(tag)}
                >
                  #{tag}
                </button>
              </Badge>
            )
          })}
          {hiddenTags > 0 && <Badge variant="ghost">+{hiddenTags}</Badge>}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <StarIcon className="size-4 fill-current" aria-hidden />
              {template.rating.toFixed(1)}
            </span>
            <span>
              {template.uses > 0
                ? `${template.uses.toLocaleString()} uses`
                : "New"}
            </span>
          </div>
          <Badge variant="secondary">{template.category}</Badge>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1" onClick={onPreview}>
          <EyeIcon data-icon="inline-start" />
          Preview
        </Button>
        <Button className="flex-1" onClick={onUse}>
          Use Template
        </Button>
      </CardFooter>
    </Card>
  )
}
