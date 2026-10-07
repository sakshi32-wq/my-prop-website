import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { SearchIcon, SparklesIcon } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { GenerateTemplateWizard } from "@/components/templates/generate-template-wizard"
import { TemplateCard } from "@/components/templates/template-card"
import { ALL_CATEGORIES } from "@/components/templates/template-data"
import type { LibraryTemplate } from "@/components/templates/template-data"
import {
  ActiveFilters,
  TemplateFilters,
} from "@/components/templates/template-filters"
import type { TemplateFilterState } from "@/components/templates/template-filters"
import { TemplatePreviewDialog } from "@/components/templates/template-preview-dialog"
import { UseTemplateDialog } from "@/components/templates/use-template-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/mock-data"

type TemplatesSearch = {
  q?: string
  price?: "premium" | "free"
  category?: string
  tags?: Array<string>
  preview?: number
}

const CATEGORY_VALUES: ReadonlyArray<string> = TEMPLATE_CATEGORIES

export const Route = createFileRoute("/app/templates")({
  validateSearch: (search: Record<string, unknown>): TemplatesSearch => {
    const tags = Array.isArray(search.tags)
      ? search.tags.filter((tag): tag is string => typeof tag === "string")
      : []
    const preview = Number(search.preview)
    return {
      q: typeof search.q === "string" && search.q ? search.q : undefined,
      price:
        search.price === "premium" || search.price === "free"
          ? search.price
          : undefined,
      category:
        typeof search.category === "string" &&
        search.category !== ALL_CATEGORIES &&
        CATEGORY_VALUES.includes(search.category)
          ? search.category
          : undefined,
      tags: tags.length > 0 ? tags : undefined,
      preview: Number.isInteger(preview) && preview > 0 ? preview : undefined,
    }
  },
  component: TemplatesPage,
})

function matches(template: LibraryTemplate, filters: TemplateFilterState) {
  const q = filters.query.trim().toLowerCase()
  const matchesSearch =
    !q ||
    [template.name, template.description, template.category, ...template.tags]
      .join(" ")
      .toLowerCase()
      .includes(q)
  const matchesPrice =
    filters.price === "all" ||
    (filters.price === "premium" ? template.isPremium : !template.isPremium)
  const matchesCategory =
    filters.category === ALL_CATEGORIES ||
    template.category === filters.category
  const matchesTags = filters.tags.every((tag) => template.tags.includes(tag))
  return matchesSearch && matchesPrice && matchesCategory && matchesTags
}

function TemplatesPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [templates, setTemplates] = useState<Array<LibraryTemplate>>(TEMPLATES)
  // The search box is local for instant typing; it is mirrored into the URL.
  const [query, setQuery] = useState(search.q ?? "")
  const [lastPreview, setLastPreview] = useState<LibraryTemplate | null>(
    () => TEMPLATES.find((t) => t.id === search.preview) ?? null
  )
  const [useTarget, setUseTarget] = useState<LibraryTemplate | null>(null)
  const [useOpen, setUseOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)

  const filters: TemplateFilterState = {
    query,
    price: search.price ?? "all",
    category: search.category ?? ALL_CATEGORIES,
    tags: search.tags ?? [],
  }
  const filtered = templates.filter((template) => matches(template, filters))
  const activeFilterCount =
    (filters.query ? 1 : 0) +
    (filters.price !== "all" ? 1 : 0) +
    (filters.category !== ALL_CATEGORIES ? 1 : 0) +
    filters.tags.length

  const previewTemplate = search.preview
    ? (templates.find((t) => t.id === search.preview) ?? null)
    : null

  function setSearch(patch: Partial<TemplatesSearch>) {
    void navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
      resetScroll: false,
    })
  }

  function changeQuery(value: string) {
    setQuery(value)
    setSearch({ q: value || undefined })
  }

  function toggleTag(tag: string) {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]
    setSearch({ tags: next.length > 0 ? next : undefined })
  }

  function clearAll() {
    setQuery("")
    setSearch({
      q: undefined,
      price: undefined,
      category: undefined,
      tags: undefined,
    })
  }

  function openPreview(template: LibraryTemplate) {
    setLastPreview(template)
    setSearch({ preview: template.id })
  }

  function openUseTemplate(template: LibraryTemplate) {
    if (search.preview) setSearch({ preview: undefined })
    setWizardOpen(false)
    setUseTarget(template)
    setUseOpen(true)
  }

  function saveTemplate(template: LibraryTemplate) {
    setTemplates((prev) =>
      prev.some((t) => t.id === template.id) ? prev : [template, ...prev]
    )
  }

  return (
    <>
      <PageHeader
        title="Template Library"
        description="Choose from professionally designed templates"
        actions={
          <Button onClick={() => setWizardOpen(true)}>
            <SparklesIcon data-icon="inline-start" />
            Generate with AI
          </Button>
        }
      />

      <TemplateFilters
        filters={filters}
        onQueryChange={changeQuery}
        onPriceChange={(price) =>
          setSearch({ price: price === "all" ? undefined : price })
        }
        onCategoryChange={(category) =>
          setSearch({
            category: category === ALL_CATEGORIES ? undefined : category,
          })
        }
      />

      {activeFilterCount > 0 && (
        <ActiveFilters
          filters={filters}
          resultCount={filtered.length}
          onClearQuery={() => changeQuery("")}
          onClearPrice={() => setSearch({ price: undefined })}
          onClearCategory={() => setSearch({ category: undefined })}
          onToggleTag={toggleTag}
          onClearAll={clearAll}
        />
      )}

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              selectedTags={filters.tags}
              onToggleTag={toggleTag}
              onPreview={() => openPreview(template)}
              onUse={() => openUseTemplate(template)}
            />
          ))}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>No templates found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your filters or search query
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={clearAll}>
              Clear all filters
            </Button>
          </EmptyContent>
        </Empty>
      )}

      <Card>
        <CardHeader>
          <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <SparklesIcon className="size-5" />
          </span>
          <CardTitle>Create Custom Template with AI</CardTitle>
          <CardDescription>
            Describe your ideal property website and let AI generate a custom
            template tailored to your needs.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => setWizardOpen(true)}>
            <SparklesIcon data-icon="inline-start" />
            Generate Custom Template
          </Button>
        </CardFooter>
      </Card>

      <GenerateTemplateWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onUseTemplate={openUseTemplate}
        onSaveTemplate={saveTemplate}
      />
      <TemplatePreviewDialog
        open={previewTemplate !== null}
        onOpenChange={(open) => {
          if (!open) setSearch({ preview: undefined })
        }}
        template={previewTemplate ?? lastPreview}
        onUseTemplate={openUseTemplate}
      />
      <UseTemplateDialog
        open={useOpen}
        onOpenChange={setUseOpen}
        template={useTarget}
      />
    </>
  )
}
