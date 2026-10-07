import { FilterIcon, SearchIcon, XIcon } from "lucide-react"

import { EMPTY_FILTERS, filterChips } from "./filters"
import type { LeadFilters } from "./filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function LeadsToolbar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  activeCount,
  onOpenFilters,
  shown,
  total,
}: {
  search: string
  onSearchChange: (value: string) => void
  filters: LeadFilters
  onFiltersChange: (filters: LeadFilters) => void
  activeCount: number
  onOpenFilters: () => void
  shown: number
  total: number
}) {
  const chips = filterChips(filters)
  const filtering = activeCount > 0 || search.trim().length > 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 sm:gap-4">
        <InputGroup className="flex-1">
          <InputGroupInput
            type="search"
            placeholder="Search leads by name, phone, email..."
            aria-label="Search leads"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          {search && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => onSearchChange("")}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
        <Button variant="outline" onClick={onOpenFilters}>
          <FilterIcon data-icon="inline-start" />
          <span className="max-sm:sr-only">Filters</span>
          {activeCount > 0 && <Badge>{activeCount}</Badge>}
        </Button>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Active Filters:
          </span>
          {chips.map((chip) => (
            <Badge key={chip.id} variant="secondary" asChild>
              <button
                type="button"
                aria-label={`Remove filter ${chip.label}`}
                onClick={() => onFiltersChange(chip.remove(filters))}
              >
                {chip.label}
                <XIcon data-icon="inline-end" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange(EMPTY_FILTERS)}
          >
            Clear All
          </Button>
        </div>
      )}

      {filtering && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing {shown} of {total} leads
        </p>
      )}
    </div>
  )
}
