import { CheckIcon, HouseIcon } from "lucide-react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { PROPERTY_TYPES, UNIT_CONFIGURATIONS } from "@/lib/mock-data"

import { StepIntro } from "./step-intro"
import type { StepProps } from "./types"

export function StepPropertyType({ data, update, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon={HouseIcon}
        title="Property Details"
        description="Select the type and configurations available."
      />
      <FieldGroup>
        <Field data-invalid={!!errors.propertyType}>
          <FieldLabel htmlFor="wizard-property-type">
            Property Type *
          </FieldLabel>
          <Select
            value={data.propertyType}
            onValueChange={(value) => update({ propertyType: value })}
          >
            <SelectTrigger
              id="wizard-property-type"
              className="w-full"
              aria-invalid={!!errors.propertyType}
            >
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError>{errors.propertyType}</FieldError>
        </Field>

        <Field data-invalid={!!errors.configurations}>
          <FieldTitle id="wizard-configurations">
            Configurations Available *
          </FieldTitle>
          <ToggleGroup
            type="multiple"
            variant="outline"
            aria-labelledby="wizard-configurations"
            className="grid grid-cols-2 sm:grid-cols-3"
            value={data.configurations}
            onValueChange={(value) => update({ configurations: value })}
          >
            {UNIT_CONFIGURATIONS.map((config) => (
              <ToggleGroupItem
                key={config}
                value={config}
                aria-invalid={!!errors.configurations}
              >
                <CheckIcon className="hidden group-data-[state=on]/toggle:block" />
                {config}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <FieldError>{errors.configurations}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="wizard-price-range">Price Range</FieldLabel>
          <Input
            id="wizard-price-range"
            placeholder="e.g., ₹80L - ₹1.5Cr"
            value={data.priceRange}
            onChange={(e) => update({ priceRange: e.target.value })}
          />
        </Field>
      </FieldGroup>
    </div>
  )
}
