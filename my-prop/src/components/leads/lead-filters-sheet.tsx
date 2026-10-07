import { CalendarIcon, FilterIcon, RotateCcwIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { SOURCE_ICONS } from "./data"
import { EMPTY_FILTERS, countActiveFilters, formatDateRange } from "./filters"
import type { LeadFilters, ListFilterKey } from "./filters"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  BUDGET_RANGES,
  CONFIGURATIONS,
  LEAD_SOURCES,
  LEAD_STAGES,
  PROJECTS,
} from "@/lib/mock-data"

function CheckboxList({
  legend,
  idPrefix,
  options,
  selected,
  onToggle,
}: {
  legend: string
  idPrefix: string
  options: ReadonlyArray<{
    value: string
    label: string
    icon?: LucideIcon
  }>
  selected: ReadonlyArray<string>
  onToggle: (value: string) => void
}) {
  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>
      <FieldGroup className="gap-3">
        {options.map((option) => {
          const id = `${idPrefix}-${option.value}`
          const Icon = option.icon
          return (
            <Field key={option.value} orientation="horizontal">
              <Checkbox
                id={id}
                checked={selected.includes(option.value)}
                onCheckedChange={() => onToggle(option.value)}
              />
              <FieldLabel htmlFor={id} className="font-normal">
                {Icon && <Icon className="size-4 text-muted-foreground" />}
                {option.label}
              </FieldLabel>
            </Field>
          )
        })}
      </FieldGroup>
    </FieldSet>
  )
}

function ToggleList({
  legend,
  options,
  selected,
  onChange,
}: {
  legend: string
  options: ReadonlyArray<string>
  selected: Array<string>
  onChange: (value: Array<string>) => void
}) {
  return (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>
      <ToggleGroup
        type="multiple"
        variant="outline"
        size="sm"
        className="flex-wrap"
        aria-label={legend}
        value={selected}
        onValueChange={onChange}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </FieldSet>
  )
}

export function LeadFiltersSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  tagOptions,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: LeadFilters
  onFiltersChange: (filters: LeadFilters) => void
  tagOptions: ReadonlyArray<string>
}) {
  const activeCount = countActiveFilters(filters)

  const toggle = (key: ListFilterKey, value: string) => {
    const list = filters[key] as Array<string>
    onFiltersChange({
      ...filters,
      [key]: list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    })
  }

  const sourceOptions = LEAD_SOURCES.map((s) => ({
    ...s,
    icon: SOURCE_ICONS[s.value],
  }))
  const projectOptions = PROJECTS.map((p) => ({ value: p, label: p }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            Filter Leads
            {activeCount > 0 && (
              <Badge variant="secondary">{activeCount} active</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Refine your lead list with advanced filters
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <FieldGroup className="p-4">
            <CheckboxList
              legend="Lead Source"
              idPrefix="filter-source"
              options={sourceOptions}
              selected={filters.sources}
              onToggle={(v) => toggle("sources", v)}
            />
            <FieldSeparator />
            <ToggleList
              legend="Budget Range"
              options={BUDGET_RANGES}
              selected={filters.budgets}
              onChange={(budgets) => onFiltersChange({ ...filters, budgets })}
            />
            <ToggleList
              legend="Configuration"
              options={CONFIGURATIONS}
              selected={filters.configurations}
              onChange={(configurations) =>
                onFiltersChange({ ...filters, configurations })
              }
            />
            <FieldSeparator />
            <CheckboxList
              legend="Project"
              idPrefix="filter-project"
              options={projectOptions}
              selected={filters.projects}
              onToggle={(v) => toggle("projects", v)}
            />
            <FieldSeparator />
            <CheckboxList
              legend="Pipeline Stage"
              idPrefix="filter-stage"
              options={LEAD_STAGES}
              selected={filters.stages}
              onToggle={(v) => toggle("stages", v)}
            />
            <FieldSeparator />
            <ToggleList
              legend="Tags"
              options={tagOptions}
              selected={filters.tags}
              onChange={(tags) => onFiltersChange({ ...filters, tags })}
            />
            <FieldSeparator />
            <Field>
              <FieldLabel htmlFor="filter-date">Date Added</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="filter-date"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    <CalendarIcon data-icon="inline-start" />
                    {filters.dateRange?.from
                      ? formatDateRange(filters.dateRange)
                      : "Any date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={filters.dateRange}
                    onSelect={(dateRange) =>
                      onFiltersChange({ ...filters, dateRange })
                    }
                    disabled={{ after: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </FieldGroup>
        </ScrollArea>

        <SheetFooter className="border-t">
          {activeCount > 0 && (
            <Button
              variant="outline"
              onClick={() => onFiltersChange(EMPTY_FILTERS)}
            >
              <RotateCcwIcon data-icon="inline-start" />
              Clear All Filters
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>
            <FilterIcon data-icon="inline-start" />
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
