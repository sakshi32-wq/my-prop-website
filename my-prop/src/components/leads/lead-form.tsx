import { useState } from "react"
import type { ReactNode } from "react"
import { MailIcon, PhoneIcon, SparklesIcon } from "lucide-react"

import { SOURCE_ICONS } from "./data"
import { OptionSelect } from "./option-select"
import { TagEditor } from "./tag-editor"
import type { LeadInput } from "./data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  BUDGET_RANGES,
  CONFIGURATIONS,
  LEAD_SOURCES,
  LEAD_STAGES,
  PROJECTS,
} from "@/lib/mock-data"
import type { LeadSource, LeadStage } from "@/lib/mock-data"

type FormValues = Omit<LeadInput, "source"> & { source: LeadSource | "" }

const EMPTY_VALUES: FormValues = {
  name: "",
  phone: "",
  email: "",
  source: "",
  budget: "",
  configuration: "",
  project: "",
  stage: "new",
  tags: [],
  notes: "",
}

type Errors = Partial<Record<"name" | "phone" | "email" | "source", string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: FormValues): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = "Full name is required."
  if (!values.phone.trim()) errors.phone = "Phone number is required."
  else if (values.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Enter a valid phone number."
  if (values.email.trim() && !EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address."
  if (!values.source) errors.source = "Select where this lead came from."
  return errors
}

/**
 * Shared add/edit lead form. Mount it inside a DialogContent so it remounts
 * (and resets) every time the dialog opens.
 */
export function LeadForm({
  initialValues = EMPTY_VALUES,
  submitLabel,
  submitIcon,
  showAiTip = false,
  onSubmit,
}: {
  initialValues?: FormValues
  submitLabel: string
  submitIcon: ReactNode
  showAiTip?: boolean
  onSubmit: (values: LeadInput) => void
}) {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<Errors>({})

  const set = <TKey extends keyof FormValues>(
    key: TKey,
    value: FormValues[TKey]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean) || !values.source) return
    onSubmit({
      ...values,
      source: values.source,
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      notes: values.notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend>Contact Information</FieldLegend>
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="lead-name">Full Name *</FieldLabel>
            <Input
              id="lead-name"
              placeholder="e.g., Rahul Sharma"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              autoComplete="name"
            />
            <FieldError>{errors.name}</FieldError>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="lead-phone">Phone Number *</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="lead-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  autoComplete="tel"
                />
                <InputGroupAddon>
                  <PhoneIcon />
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{errors.phone}</FieldError>
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="lead-email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="lead-email"
                  type="email"
                  placeholder="email@example.com"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{errors.email}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Lead Details</FieldLegend>
        <FieldGroup>
          <Field data-invalid={!!errors.source}>
            <FieldLabel htmlFor="lead-source">Lead Source *</FieldLabel>
            <Select
              value={values.source}
              onValueChange={(v) => set("source", v as LeadSource)}
            >
              <SelectTrigger
                id="lead-source"
                className="w-full"
                aria-invalid={!!errors.source}
              >
                <SelectValue placeholder="Select lead source" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {LEAD_SOURCES.map((source) => {
                    const Icon = SOURCE_ICONS[source.value]
                    return (
                      <SelectItem key={source.value} value={source.value}>
                        <Icon />
                        {source.label}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError>{errors.source}</FieldError>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="lead-budget">Budget Range</FieldLabel>
              <OptionSelect
                id="lead-budget"
                value={values.budget}
                onChange={(v) => set("budget", v)}
                placeholder="Select budget"
                options={BUDGET_RANGES}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lead-config">Configuration</FieldLabel>
              <OptionSelect
                id="lead-config"
                value={values.configuration}
                onChange={(v) => set("configuration", v)}
                placeholder="Select config"
                options={CONFIGURATIONS}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lead-project">Interested Project</FieldLabel>
              <OptionSelect
                id="lead-project"
                value={values.project}
                onChange={(v) => set("project", v)}
                placeholder="Select project"
                options={PROJECTS}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lead-stage">Pipeline Stage</FieldLabel>
              <OptionSelect
                id="lead-stage"
                value={values.stage}
                onChange={(v) => set("stage", v as LeadStage)}
                options={LEAD_STAGES}
              />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Tags</FieldLegend>
        <TagEditor tags={values.tags} onChange={(tags) => set("tags", tags)} />
      </FieldSet>

      <Field>
        <FieldLabel htmlFor="lead-notes">Notes</FieldLabel>
        <Textarea
          id="lead-notes"
          placeholder="Add any additional information about this lead..."
          value={values.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
        />
      </Field>

      {showAiTip && (
        <Alert>
          <SparklesIcon />
          <AlertTitle>AI Tip</AlertTitle>
          <AlertDescription>
            After adding this lead, AI will automatically suggest personalized
            follow-up messages and recommend the best time to contact them.
          </AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">
          {submitIcon}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}
