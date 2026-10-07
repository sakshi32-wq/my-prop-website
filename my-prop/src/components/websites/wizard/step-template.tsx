import { useEffect } from "react"
import { LayoutTemplateIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { useListTemplates } from "@/api/generated/templates/templates"
import { QueryError } from "@/components/query-error"
import { PROPERTY_TYPES } from "@/lib/mock-data"

import { StepIntro } from "./step-intro"
import type { StepProps } from "./types"

/** The wizard offers the first few library templates. */
const WIZARD_TEMPLATE_COUNT = 3

export function StepTemplate({ data, update, errors }: StepProps) {
  const templatesQuery = useListTemplates()
  const templates = templatesQuery.data?.slice(0, WIZARD_TEMPLATE_COUNT) ?? []

  // Preselect the first template once the list arrives.
  const firstId = templates.at(0)?.id
  useEffect(() => {
    if (!data.templateId && firstId) update({ templateId: firstId })
  }, [data.templateId, firstId, update])

  const propertyType = PROPERTY_TYPES.find(
    (type) => type.value === data.propertyType
  )?.label
  const template = templates.find((t) => t.id === data.templateId)?.name

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
        {templatesQuery.isPending &&
          Array.from({ length: WIZARD_TEMPLATE_COUNT }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        {templatesQuery.isError && (
          <QueryError
            title="Couldn't load templates"
            error={templatesQuery.error}
            onRetry={() => void templatesQuery.refetch()}
          />
        )}
        {templates.map((item) => (
          <FieldLabel key={item.id} htmlFor={`wizard-template-${item.id}`}>
            <Field orientation="horizontal">
              <img
                src={item.thumbnailUrl}
                alt=""
                loading="lazy"
                className="size-16 shrink-0 rounded-md object-cover"
              />
              <FieldContent>
                <FieldTitle>{item.name}</FieldTitle>
                <FieldDescription>{item.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={item.id}
                id={`wizard-template-${item.id}`}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      <FieldError>{errors.templateId}</FieldError>

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
