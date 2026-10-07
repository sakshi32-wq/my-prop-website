import { useRef, useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import type { RangePreset } from "./data"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function rangeLabel(range: DateRange | undefined) {
  if (!range?.from) return "Pick dates"
  if (!range.to) return format(range.from, "MMM d, yyyy")
  return `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
}

export function DateRangeControl({
  preset,
  onPresetChange,
  customRange,
  onCustomRangeChange,
}: {
  preset: RangePreset
  onPresetChange: (preset: RangePreset) => void
  customRange: DateRange | undefined
  onCustomRangeChange: (range: DateRange | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const choseCustom = useRef(false)

  return (
    <>
      <Select
        value={preset}
        onValueChange={(value) => {
          const next = value as RangePreset
          onPresetChange(next)
          choseCustom.current = next === "custom"
        }}
      >
        <SelectTrigger aria-label="Date range" className="min-w-40">
          <CalendarIcon />
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          position="popper"
          align="end"
          onCloseAutoFocus={(event) => {
            // Hand focus to the date picker instead of the select trigger.
            if (choseCustom.current) {
              event.preventDefault()
              choseCustom.current = false
              requestAnimationFrame(() => setOpen(true))
            }
          }}
        >
          <SelectGroup>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="60">Last 60 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {preset === "custom" && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon data-icon="inline-start" />
              {rangeLabel(customRange)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={onCustomRangeChange}
              defaultMonth={customRange?.from}
              disabled={{ after: new Date() }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}
