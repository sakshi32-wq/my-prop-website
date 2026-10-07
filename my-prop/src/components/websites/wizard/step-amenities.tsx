import { CheckIcon, RulerIcon } from "lucide-react"

import { Field, FieldDescription, FieldTitle } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AMENITIES } from "@/lib/mock-data"

import { StepIntro } from "./step-intro"
import type { StepProps } from "./types"

export function StepAmenities({ data, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon={RulerIcon}
        title="Amenities & Features"
        description="Select the amenities your project offers."
      />
      <Field>
        <FieldTitle id="wizard-amenities">Select Amenities</FieldTitle>
        <ToggleGroup
          type="multiple"
          variant="outline"
          aria-labelledby="wizard-amenities"
          className="grid grid-cols-2 sm:grid-cols-3"
          value={data.amenities}
          onValueChange={(value) => update({ amenities: value })}
        >
          {AMENITIES.map((amenity) => (
            <ToggleGroupItem
              key={amenity}
              value={amenity}
              className="justify-start"
            >
              <CheckIcon className="hidden group-data-[state=on]/toggle:block" />
              {amenity}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldDescription>
          Selected: {data.amenities.length}{" "}
          {data.amenities.length === 1 ? "amenity" : "amenities"}
        </FieldDescription>
      </Field>
    </div>
  )
}
