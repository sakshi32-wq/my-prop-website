import type { Option } from "@/components/templates/wizard-options"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

/** Single choice rendered as a grid of selectable cards. */
export function ChoiceCards({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  className,
  renderExtra,
}: {
  name: string
  legend: string
  options: Array<Option>
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
  renderExtra?: (option: Option) => React.ReactNode
}) {
  return (
    <FieldSet data-invalid={!!error}>
      <FieldLegend variant="label">{legend}</FieldLegend>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        aria-invalid={!!error}
        className={cn("grid gap-3 sm:grid-cols-2", className)}
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`
          return (
            <FieldLabel key={option.value} htmlFor={id}>
              <Field orientation="horizontal">
                <FieldContent>
                  {renderExtra?.(option)}
                  <FieldTitle>{option.label}</FieldTitle>
                  {option.description && (
                    <FieldDescription>{option.description}</FieldDescription>
                  )}
                </FieldContent>
                <RadioGroupItem
                  id={id}
                  value={option.value}
                  aria-invalid={!!error}
                />
              </Field>
            </FieldLabel>
          )
        })}
      </RadioGroup>
      {error && <FieldError>{error}</FieldError>}
    </FieldSet>
  )
}

/** Multiple choice rendered as a grid of checkbox cards. */
export function CheckboxCards({
  name,
  legend,
  description,
  options,
  value,
  onChange,
  error,
}: {
  name: string
  legend: string
  description?: string
  options: Array<string>
  value: Array<string>
  onChange: (value: Array<string>) => void
  error?: string
}) {
  function toggle(option: string, checked: boolean) {
    onChange(
      checked ? [...value, option] : value.filter((item) => item !== option)
    )
  }

  return (
    <FieldSet data-invalid={!!error}>
      <FieldLegend variant="label">{legend}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className="grid gap-2 sm:grid-cols-2" data-slot="checkbox-group">
        {options.map((option, index) => {
          const id = `${name}-${index}`
          return (
            <FieldLabel key={option} htmlFor={id}>
              <Field orientation="horizontal">
                <Checkbox
                  id={id}
                  checked={value.includes(option)}
                  aria-invalid={!!error}
                  onCheckedChange={(checked) =>
                    toggle(option, checked === true)
                  }
                />
                <FieldContent>
                  <FieldTitle>{option}</FieldTitle>
                </FieldContent>
              </Field>
            </FieldLabel>
          )
        })}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </FieldSet>
  )
}
