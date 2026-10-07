import { useState } from "react"
import { SparklesIcon } from "lucide-react"

import { CAMPAIGN_GOALS, POST_COUNTS, SOCIAL_PLATFORMS } from "./data"
import type { ContentFormData, ContentToolId } from "./data"
import { Button } from "@/components/ui/button"
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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { AI_TONES, PROPERTY_TYPES } from "@/lib/mock-data"

type Option = { value: string; label: string }

function SelectField({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  placeholder?: string
  options: ReadonlyArray<Option>
  onChange: (value: string) => void
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export function ContentForm({
  tool,
  data,
  onChange,
  generating,
  onGenerate,
}: {
  tool: ContentToolId
  data: ContentFormData
  onChange: (data: ContentFormData) => void
  generating: boolean
  onGenerate: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState({
    projectName: false,
    location: false,
  })

  const set = <TKey extends keyof ContentFormData>(
    key: TKey,
    value: ContentFormData[TKey]
  ) => onChange({ ...data, [key]: value })

  const projectError =
    (submitted || touched.projectName) && !data.projectName.trim()
  const locationError = (submitted || touched.location) && !data.location.trim()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (!data.projectName.trim() || !data.location.trim()) return
    onGenerate()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <div className="grid gap-5 md:grid-cols-2 md:gap-4">
          <Field data-invalid={projectError || undefined}>
            <FieldLabel htmlFor="ai-project-name">Project Name *</FieldLabel>
            <Input
              id="ai-project-name"
              placeholder="e.g., Skyline Heights"
              value={data.projectName}
              aria-invalid={projectError || undefined}
              onBlur={() => setTouched((t) => ({ ...t, projectName: true }))}
              onChange={(e) => set("projectName", e.target.value)}
            />
            {projectError && <FieldError>Project name is required.</FieldError>}
          </Field>
          <Field data-invalid={locationError || undefined}>
            <FieldLabel htmlFor="ai-location">Location *</FieldLabel>
            <Input
              id="ai-location"
              placeholder="e.g., Andheri West, Mumbai"
              value={data.location}
              aria-invalid={locationError || undefined}
              onBlur={() => setTouched((t) => ({ ...t, location: true }))}
              onChange={(e) => set("location", e.target.value)}
            />
            {locationError && <FieldError>Location is required.</FieldError>}
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-4">
          <SelectField
            id="ai-property-type"
            label="Property Type"
            value={data.propertyType}
            options={PROPERTY_TYPES}
            onChange={(value) => set("propertyType", value)}
          />
          <SelectField
            id="ai-tone"
            label="Content Tone"
            value={data.tone}
            options={AI_TONES}
            onChange={(value) => set("tone", value)}
          />
        </div>

        {tool === "social" && (
          <div className="grid gap-5 md:grid-cols-2 md:gap-4">
            <SelectField
              id="ai-platform"
              label="Platform"
              value={data.platform}
              options={SOCIAL_PLATFORMS}
              onChange={(value) => set("platform", value)}
            />
            <SelectField
              id="ai-num-posts"
              label="Number of Posts"
              value={data.numPosts}
              options={POST_COUNTS.map((count) => ({
                value: count,
                label: `${count} Posts`,
              }))}
              onChange={(value) => set("numPosts", value)}
            />
          </div>
        )}

        {tool === "whatsapp" && (
          <SelectField
            id="ai-campaign-goal"
            label="Campaign Goal"
            value={data.campaignGoal}
            placeholder="Select campaign goal"
            options={CAMPAIGN_GOALS}
            onChange={(value) => set("campaignGoal", value)}
          />
        )}

        <Field>
          <FieldLabel htmlFor="ai-features">
            Key Features (comma separated)
          </FieldLabel>
          <Textarea
            id="ai-features"
            rows={3}
            placeholder="e.g., Swimming Pool, Gym, 24/7 Security, Garden"
            value={data.features}
            onChange={(e) => set("features", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="ai-audience">Target Audience</FieldLabel>
          <Input
            id="ai-audience"
            placeholder="e.g., Young professionals, Families"
            value={data.targetAudience}
            onChange={(e) => set("targetAudience", e.target.value)}
          />
        </Field>

        <Button type="submit" size="lg" disabled={generating}>
          {generating ? (
            <>
              <Spinner data-icon="inline-start" />
              Generating with AI...
            </>
          ) : (
            <>
              <SparklesIcon data-icon="inline-start" />
              Generate Content
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}
