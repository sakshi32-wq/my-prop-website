import {
  ChoiceCards,
  CheckboxCards,
} from "@/components/templates/wizard-fields"
import {
  COLOR_SCHEMES,
  DESIGN_STYLES,
  FEATURE_OPTIONS,
  HERO_STYLES,
  LAYOUT_STYLES,
  SECTION_OPTIONS,
  TARGET_AUDIENCES,
  TEMPLATE_TYPES,
  WIZARD_PROPERTY_TYPES,
  optionLabel,
} from "@/components/templates/wizard-options"
import type {
  Option,
  WizardData,
  WizardErrors,
} from "@/components/templates/wizard-options"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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

type StepProps = {
  data: WizardData
  errors: WizardErrors
  update: (patch: Partial<WizardData>) => void
}

export function TypeStep({ data, errors, update }: StepProps) {
  return (
    <FieldGroup>
      <SelectField
        id="template-type"
        label="What type of template do you need?"
        placeholder="Select template type"
        options={TEMPLATE_TYPES}
        value={data.templateType}
        error={errors.templateType}
        onChange={(templateType) => update({ templateType })}
      />
      <SelectField
        id="property-type"
        label="Primary Property Type"
        placeholder="Select property type"
        options={WIZARD_PROPERTY_TYPES}
        value={data.propertyType}
        error={errors.propertyType}
        onChange={(propertyType) => update({ propertyType })}
      />
      <SelectField
        id="target-audience"
        label="Target Audience"
        placeholder="Select target audience"
        options={TARGET_AUDIENCES}
        value={data.targetAudience}
        error={errors.targetAudience}
        onChange={(targetAudience) => update({ targetAudience })}
      />
    </FieldGroup>
  )
}

export function DesignStep({ data, errors, update }: StepProps) {
  return (
    <FieldGroup>
      <ChoiceCards
        name="design-style"
        legend="Design Style"
        options={DESIGN_STYLES}
        value={data.designStyle}
        error={errors.designStyle}
        onChange={(designStyle) => update({ designStyle })}
      />
      <ChoiceCards
        name="color-scheme"
        legend="Color Scheme"
        className="grid-cols-2 sm:grid-cols-3"
        options={COLOR_SCHEMES}
        value={data.colorScheme}
        error={errors.colorScheme}
        onChange={(colorScheme) => update({ colorScheme })}
        renderExtra={(option) => <Swatches value={option.value} />}
      />
    </FieldGroup>
  )
}

export function Swatches({ value }: { value: string }) {
  const scheme = COLOR_SCHEMES.find((item) => item.value === value)
  if (!scheme) return null
  return (
    <span className="mb-1 flex gap-1.5" aria-hidden>
      {scheme.swatches.map((chart, i) => (
        <span
          key={i}
          className="size-6 rounded-md border"
          style={{ background: `var(--chart-${chart})` }}
        />
      ))}
    </span>
  )
}

export function LayoutStep({ data, errors, update }: StepProps) {
  return (
    <FieldGroup>
      <ChoiceCards
        name="layout-style"
        legend="Layout Style"
        className="sm:grid-cols-3"
        options={LAYOUT_STYLES}
        value={data.layoutStyle}
        error={errors.layoutStyle}
        onChange={(layoutStyle) => update({ layoutStyle })}
      />
      <CheckboxCards
        name="section"
        legend="Select Sections to Include"
        description={`${data.sections.length} selected`}
        options={SECTION_OPTIONS}
        value={data.sections}
        error={errors.sections}
        onChange={(sections) => update({ sections })}
      />
    </FieldGroup>
  )
}

export function ContentStep({ data, errors, update }: StepProps) {
  return (
    <FieldGroup>
      <ChoiceCards
        name="hero-style"
        legend="Hero Section Style"
        options={HERO_STYLES}
        value={data.heroStyle}
        error={errors.heroStyle}
        onChange={(heroStyle) => update({ heroStyle })}
      />
      <CheckboxCards
        name="feature"
        legend="Interactive Features"
        description={`${data.features.length} selected`}
        options={FEATURE_OPTIONS}
        value={data.features}
        error={errors.features}
        onChange={(features) => update({ features })}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="template-name">
            Template Name (Optional)
          </FieldLabel>
          <Input
            id="template-name"
            placeholder="e.g., Modern Luxury Template"
            value={data.templateName}
            onChange={(e) => update({ templateName: e.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="template-description">
            Short Description (Optional)
          </FieldLabel>
          <Input
            id="template-description"
            placeholder="Brief description"
            value={data.templateDescription}
            onChange={(e) => update({ templateDescription: e.target.value })}
          />
        </Field>
      </div>
    </FieldGroup>
  )
}

export function WizardSummary({ data }: { data: WizardData }) {
  const rows: Array<[string, React.ReactNode]> = [
    ["Template Name", data.templateName.trim() || "Auto-generated"],
    ["Description", data.templateDescription.trim() || "Auto-generated"],
    ["Template Type", optionLabel(TEMPLATE_TYPES, data.templateType)],
    ["Property Type", optionLabel(WIZARD_PROPERTY_TYPES, data.propertyType)],
    ["Target Audience", optionLabel(TARGET_AUDIENCES, data.targetAudience)],
    ["Design Style", optionLabel(DESIGN_STYLES, data.designStyle)],
    [
      "Color Scheme",
      <span key="scheme" className="flex items-center gap-2">
        <Swatches value={data.colorScheme} />
        {optionLabel(COLOR_SCHEMES, data.colorScheme)}
      </span>,
    ],
    ["Layout", optionLabel(LAYOUT_STYLES, data.layoutStyle)],
    ["Hero Style", optionLabel(HERO_STYLES, data.heroStyle)],
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Summary</CardTitle>
        <CardDescription>
          Review your selections before generating
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium break-words">{value}</dd>
            </div>
          ))}
        </dl>
        <BadgeList label="Sections" items={data.sections} />
        <BadgeList label="Features" items={data.features} />
      </CardContent>
    </Card>
  )
}

function BadgeList({ label, items }: { label: string; items: Array<string> }) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">
        {label} ({items.length})
      </span>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function SelectField({
  id,
  label,
  placeholder,
  options,
  value,
  error,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  options: Array<Option>
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-invalid={!!error} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
