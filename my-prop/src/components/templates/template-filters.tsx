import { SearchIcon, SparklesIcon, XIcon } from "lucide-react"

import { ALL_CATEGORIES } from "@/components/templates/template-data"
import type { PriceFilter } from "@/components/templates/template-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldTitle } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TEMPLATE_CATEGORIES } from "@/lib/mock-data"

export type TemplateFilterState = {
  query: string
  price: PriceFilter
  category: string
  tags: Array<string>
}

export function TemplateFilters({
  filters,
  onQueryChange,
  onPriceChange,
  onCategoryChange,
}: {
  filters: TemplateFilterState
  onQueryChange: (query: string) => void
  onPriceChange: (price: PriceFilter) => void
  onCategoryChange: (category: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="sm:flex-1">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label="Search templates"
            placeholder="Search templates..."
            value={filters.query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {filters.query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => onQueryChange("")}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <ToggleGroup
          type="single"
          variant="outline"
          spacing={0}
          aria-label="Filter by price"
          value={filters.price}
          onValueChange={(value) =>
            onPriceChange(value ? (value as PriceFilter) : "all")
          }
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="premium">
            <SparklesIcon data-icon="inline-start" />
            Premium
          </ToggleGroupItem>
          <ToggleGroupItem value="free">Free</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Field>
        <FieldTitle id="template-categories">Categories</FieldTitle>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          aria-labelledby="template-categories"
          className="flex-wrap"
          value={filters.category}
          onValueChange={(value) => onCategoryChange(value || ALL_CATEGORIES)}
        >
          {TEMPLATE_CATEGORIES.map((category) => (
            <ToggleGroupItem key={category} value={category}>
              {category}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Field>
    </div>
  )
}

export function ActiveFilters({
  filters,
  resultCount,
  onClearQuery,
  onClearPrice,
  onClearCategory,
  onToggleTag,
  onClearAll,
}: {
  filters: TemplateFilterState
  resultCount: number
  onClearQuery: () => void
  onClearPrice: () => void
  onClearCategory: () => void
  onToggleTag: (tag: string) => void
  onClearAll: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <span className="text-sm font-medium">
          {resultCount} {resultCount === 1 ? "template" : "templates"} found
        </span>
        {filters.query && (
          <RemovableBadge
            label={`Search: "${filters.query}"`}
            onRemove={onClearQuery}
          />
        )}
        {filters.price !== "all" && (
          <RemovableBadge
            label={filters.price === "premium" ? "Premium only" : "Free only"}
            onRemove={onClearPrice}
          />
        )}
        {filters.category !== ALL_CATEGORIES && (
          <RemovableBadge label={filters.category} onRemove={onClearCategory} />
        )}
        {filters.tags.map((tag) => (
          <RemovableBadge
            key={tag}
            label={`#${tag}`}
            onRemove={() => onToggleTag(tag)}
          />
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="self-start sm:self-auto"
        onClick={onClearAll}
      >
        Clear all
      </Button>
    </div>
  )
}

function RemovableBadge({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <Badge asChild variant="secondary" className="max-w-full cursor-pointer">
      <button type="button" aria-label={`Remove ${label}`} onClick={onRemove}>
        <span className="truncate">{label}</span>
        <XIcon data-icon="inline-end" />
      </button>
    </Badge>
  )
}
