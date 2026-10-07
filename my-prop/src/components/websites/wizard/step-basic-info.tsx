import { Building2Icon, MapPinIcon } from "lucide-react"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Textarea } from "@/components/ui/textarea"

import { StepIntro } from "./step-intro"
import type { StepProps } from "./types"

export function StepBasicInfo({ data, update, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon={Building2Icon}
        title="Tell us about your project"
        description="We'll use this information to create your website."
      />
      <FieldGroup>
        <Field data-invalid={!!errors.projectName}>
          <FieldLabel htmlFor="wizard-project-name">Project Name *</FieldLabel>
          <Input
            id="wizard-project-name"
            placeholder="e.g., Skyline Heights"
            value={data.projectName}
            aria-invalid={!!errors.projectName}
            onChange={(e) => update({ projectName: e.target.value })}
          />
          <FieldError>{errors.projectName}</FieldError>
        </Field>
        <Field data-invalid={!!errors.location}>
          <FieldLabel htmlFor="wizard-location">Location *</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="wizard-location"
              placeholder="e.g., Andheri West, Mumbai"
              value={data.location}
              aria-invalid={!!errors.location}
              onChange={(e) => update({ location: e.target.value })}
            />
            <InputGroupAddon>
              <MapPinIcon />
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{errors.location}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="wizard-description">
            Project Description
          </FieldLabel>
          <Textarea
            id="wizard-description"
            placeholder="Briefly describe your property project..."
            rows={4}
            value={data.description}
            onChange={(e) => update({ description: e.target.value })}
          />
        </Field>
      </FieldGroup>
    </div>
  )
}
