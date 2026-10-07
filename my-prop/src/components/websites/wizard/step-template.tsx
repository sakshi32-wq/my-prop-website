import { LayoutTemplateIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PROPERTY_TYPES, TEMPLATES, unsplash } from "@/lib/mock-data"

import { StepIntro } from "./step-intro"
import type { StepProps } from "./types"

const WIZARD_TEMPLATES = TEMPLATES.slice(0, 3)

export function StepTemplate({ data, update }: StepProps) {
  const propertyType = PROPERTY_TYPES.find(
    (type) => type.value === data.propertyType
  )?.label
  const template = WIZARD_TEMPLATES.find(
    (t) => String(t.id) === data.templateId
  )?.name

  const summary = [
    { label: "Project", value: data.projectName || "Not set" },
    { label: "Location", value: data.location || "Not set" },
    { label: "Type", value: propertyType ?? "Not set" },
    {
      label: "Configurations",
      value: data.configurations.length
        ? data.configurations.join(", ")
        : "Not set",
    },
    { label: "Amenities", value: `${data.amenities.length} selected` },
    { label: "Template", value: template ?? "Not set" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon={LayoutTemplateIcon}
        title="Choose Your Template"
        description="Select a design template for your website."
      />
      <RadioGroup
        aria-label="Template"
        value={data.templateId}
        onValueChange={(value) => update({ templateId: value })}
        className="gap-3"
      >
        {WIZARD_TEMPLATES.map((item) => (
          <FieldLabel key={item.id} htmlFor={`wizard-template-${item.id}`}>
            <Field orientation="horizontal">
              <img
                src={unsplash(item.thumbnail, 160, 160)}
                alt=""
                loading="lazy"
                className="size-16 shrink-0 rounded-md object-cover"
              />
              <FieldContent>
                <FieldTitle>{item.name}</FieldTitle>
                <FieldDescription>{item.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={String(item.id)}
                id={`wizard-template-${item.id}`}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-2">
            {summary.map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
                <dd className="text-right font-medium break-words">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
