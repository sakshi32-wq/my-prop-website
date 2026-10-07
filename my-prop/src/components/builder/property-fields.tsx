import { useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { Slider } from "@/components/ui/slider"

import { toHexColor } from "./tree-utils"

/** Number input that tolerates empty/partial input and ignores NaN. */
export function NumberField({
  id,
  label,
  value,
  min,
  max,
  unit = "px",
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (value: number) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={draft ?? String(value)}
          onChange={(event) => {
            setDraft(event.target.value)
            const next = event.target.valueAsNumber
            if (Number.isFinite(next) && next >= min && next <= max) {
              onChange(next)
            }
          }}
          onBlur={() => setDraft(null)}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>{unit}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export function SliderField({
  id,
  label,
  value,
  min = 0,
  max,
  step,
  format = (v) => `${v}px`,
  onChange,
}: {
  id: string
  label: string
  value: number
  min?: number
  max: number
  step: number
  format?: (value: number) => string
  onChange: (value: number) => void
}) {
  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <span className="text-xs text-muted-foreground tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        id={id}
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
      />
    </Field>
  )
}

/** Native color picker + free-form CSS color text input. */
export function ColorField({
  id,
  label,
  value,
  fallback,
  onChange,
  hideLabel = false,
}: {
  id: string
  label: string
  value: string | undefined
  fallback: string
  onChange: (value: string) => void
  hideLabel?: boolean
}) {
  return (
    <Field>
      {hideLabel ? (
        <FieldLabel htmlFor={id} className="sr-only">
          {label}
        </FieldLabel>
      ) : (
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      )}
      <InputGroup>
        <InputGroupAddon>
          <input
            type="color"
            aria-label={`${label} picker`}
            value={toHexColor(value, fallback)}
            onChange={(event) => onChange(event.target.value)}
            className="size-5 cursor-pointer rounded-sm border-0 bg-transparent p-0"
          />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          value={value ?? ""}
          placeholder={fallback}
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
      </InputGroup>
    </Field>
  )
}
