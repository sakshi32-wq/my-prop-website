import { useState } from "react"
import { keepPreviousData } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { SearchIcon, SparklesIcon } from "lucide-react"

import {
  useGetTemplate,
  useListTemplates,
} from "@/api/generated/templates/templates"
import { PageHeader } from "@/components/page-header"
import { QueryError } from "@/components/query-error"
import { GenerateTemplateWizard } from "@/components/templates/generate-template-wizard"
import { TemplateCard } from "@/components/templates/template-card"
import {
  ALL_CATEGORIES,
  toListTemplatesParams,
} from "@/components/templates/template-data"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { TEMPLATE_CATEGORIES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type TemplatesSearch = {
  q?: string
  price?: "premium" | "free"
  category?: string
  tags?: Array<string>
  preview?: string
}

const CATEGORY_VALUES: ReadonlyArray<string> = TEMPLATE_CATEGORIES

export const Route = createFileRoute("/app/templates")({
  validateSearch: (search: Record<string, unknown>): TemplatesSearch => {
    const tags = Array.isArray(search.tags)
      ? search.tags.filter((tag): tag is string => typeof tag === "string")
      : []
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
      preview:
        typeof search.preview === "string" && search.preview
          ? search.preview
          : undefined,
    }
  },
  component: TemplatesPage,
})

function TemplatesPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  // The search box is local for instant typing; it is mirrored into the URL.
  const [query, setQuery] = useState(search.q ?? "")
  const [lastPreview, setLastPreview] = useState<LibraryTemplate | null>(null)
  const [useTarget, setUseTarget] = useState<LibraryTemplate | null>(null)
  const [useOpen, setUseOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)

  const filters: TemplateFilterState = {
    query,
    price: search.price ?? "all",
    category: search.category ?? ALL_CATEGORIES,
    tags: search.tags ?? [],
  }
  // Filtering happens on the server; typing is debounced.
  const templatesQuery = useListTemplates(
    toListTemplatesParams({ ...filters, query: useDebouncedValue(query) }),
    { query: { placeholderData: keepPreviousData } }
  )
  const filtered = templatesQuery.data ?? []
  const activeFilterCount =
    (filters.query ? 1 : 0) +
    (filters.price !== "all" ? 1 : 0) +
    (filters.category !== ALL_CATEGORIES ? 1 : 0) +
    filters.tags.length

  // A shared ?preview= link may point outside the current filters.
  const previewQuery = useGetTemplate(search.preview ?? "", {
    query: { enabled: !!search.preview },
  })
  const previewTemplate = search.preview
    ? (filtered.find((t) => t.id === search.preview) ??
      previewQuery.data ??
      null)
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

      {templatesQuery.isPending ? (
        <div
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          aria-busy="true"
          aria-label="Loading templates"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      ) : templatesQuery.isError ? (
        <QueryError
          title="Couldn't load templates"
          error={templatesQuery.error}
          onRetry={() => void templatesQuery.refetch()}
        />
      ) : filtered.length > 0 ? (
        <div
          className={cn(
            "grid gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
            templatesQuery.isPlaceholderData && "opacity-60"
          )}
          aria-busy={templatesQuery.isPlaceholderData}
        >
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
