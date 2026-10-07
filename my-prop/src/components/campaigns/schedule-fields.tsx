import { useState } from "react"
import { format, startOfToday } from "date-fns"
import {
  CalendarClockIcon,
  CalendarIcon,
  RepeatIcon,
  TargetIcon,
  ZapIcon,
} from "lucide-react"

import { ChoiceIcon } from "./choice-icon"
import { FREQUENCIES, TRIGGER_EVENTS, describeSchedule } from "./campaign-data"
import type {
  CampaignDraft,
  DraftErrors,
  Frequency,
  ScheduleType,
} from "./campaign-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const SEND_TYPES: {
  value: ScheduleType
  label: string
  description: string
  icon: typeof ZapIcon
}[] = [
  {
    value: "immediate",
    label: "Send Immediately",
    description: "Start campaign right away",
    icon: ZapIcon,
  },
  {
    value: "scheduled",
    label: "Schedule for Later",
    description: "Pick a specific date and time",
    icon: CalendarClockIcon,
  },
  {
    value: "recurring",
    label: "Recurring",
    description: "Send daily, weekly or monthly",
    icon: RepeatIcon,
  },
  {
    value: "triggered",
    label: "Trigger-Based",
    description: "Send based on lead actions",
    icon: TargetIcon,
  },
]

export function ScheduleFields({
  draft,
  onChange,
  errors,
}: {
  draft: CampaignDraft
  onChange: (patch: Partial<CampaignDraft>) => void
  errors: DraftErrors
}) {
  const [dateOpen, setDateOpen] = useState(false)
  const showTime =
    draft.scheduleType === "scheduled" || draft.scheduleType === "recurring"

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend variant="label">Send Type</FieldLegend>
        <RadioGroup
          value={draft.scheduleType}
          onValueChange={(v) => onChange({ scheduleType: v as ScheduleType })}
          className="grid gap-3 sm:grid-cols-2"
        >
          {SEND_TYPES.map((type) => (
            <FieldLabel key={type.value} htmlFor={`send-${type.value}`}>
              <Field orientation="horizontal">
                <ChoiceIcon icon={type.icon} />
                <FieldContent>
                  <FieldTitle>{type.label}</FieldTitle>
                  <FieldDescription>{type.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={type.value} id={`send-${type.value}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>

      {draft.scheduleType === "recurring" && (
        <Field>
          <FieldTitle id="frequency-label">Frequency</FieldTitle>
          <ToggleGroup
            type="single"
            variant="outline"
            aria-labelledby="frequency-label"
            value={draft.frequency}
            onValueChange={(v) => v && onChange({ frequency: v as Frequency })}
          >
            {FREQUENCIES.map((f) => (
              <ToggleGroupItem key={f.value} value={f.value}>
                {f.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
      )}

      {showTime && (
        <div className="grid gap-5 sm:grid-cols-2">
          {draft.scheduleType === "scheduled" && (
            <Field data-invalid={!!errors.scheduleDate || undefined}>
              <FieldLabel htmlFor="schedule-date">Date</FieldLabel>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="schedule-date"
                    variant="outline"
                    data-empty={!draft.scheduleDate}
                    aria-invalid={!!errors.scheduleDate || undefined}
                    className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    <CalendarIcon data-icon="inline-start" />
                    {draft.scheduleDate
                      ? format(draft.scheduleDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={draft.scheduleDate}
                    defaultMonth={draft.scheduleDate}
                    disabled={{ before: startOfToday() }}
                    onSelect={(date) => {
                      onChange({ scheduleDate: date })
                      setDateOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FieldError>{errors.scheduleDate}</FieldError>
            </Field>
          )}
          <Field data-invalid={!!errors.scheduleTime || undefined}>
            <FieldLabel htmlFor="schedule-time">Time</FieldLabel>
            <Input
              id="schedule-time"
              type="time"
              value={draft.scheduleTime}
              aria-invalid={!!errors.scheduleTime || undefined}
              onChange={(e) => onChange({ scheduleTime: e.target.value })}
            />
            <FieldError>{errors.scheduleTime}</FieldError>
          </Field>
        </div>
      )}

      {draft.scheduleType === "triggered" && (
        <Field data-invalid={!!errors.triggerEvent || undefined}>
          <FieldLabel htmlFor="trigger-event">Trigger Event</FieldLabel>
          <Select
            value={draft.triggerEvent}
            onValueChange={(triggerEvent) => onChange({ triggerEvent })}
          >
            <SelectTrigger
              id="trigger-event"
              className="w-full"
              aria-invalid={!!errors.triggerEvent || undefined}
            >
              <SelectValue placeholder="Select trigger event" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {TRIGGER_EVENTS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError>{errors.triggerEvent}</FieldError>
        </Field>
      )}

      <Alert>
        <CalendarClockIcon />
        <AlertTitle>Current Schedule</AlertTitle>
        <AlertDescription>{describeSchedule(draft)}</AlertDescription>
      </Alert>
    </FieldGroup>
  )
}
