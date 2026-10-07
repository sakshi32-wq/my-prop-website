import { ChoiceIcon } from "./choice-icon"
import { CHANNELS, OBJECTIVES, STATUS_OPTIONS } from "./campaign-data"
import type {
  CampaignDraft,
  CampaignStatus,
  Channel,
  DraftErrors,
} from "./campaign-data"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BasicsFields({
  draft,
  onChange,
  errors,
  status,
  onStatusChange,
}: {
  draft: CampaignDraft
  onChange: (patch: Partial<CampaignDraft>) => void
  errors: DraftErrors
  status?: CampaignStatus
  onStatusChange?: (status: CampaignStatus) => void
}) {
  return (
    <FieldGroup>
      <Field data-invalid={!!errors.name || undefined}>
        <FieldLabel htmlFor="campaign-name">Campaign Name</FieldLabel>
        <Input
          id="campaign-name"
          placeholder="e.g., Skyline Heights Launch Campaign"
          value={draft.name}
          aria-invalid={!!errors.name || undefined}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="campaign-objective">
            Campaign Objective
          </FieldLabel>
          <Select
            value={draft.objective}
            onValueChange={(objective) => onChange({ objective })}
          >
            <SelectTrigger id="campaign-objective" className="w-full">
              <SelectValue placeholder="Select campaign objective" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {OBJECTIVES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        {status && onStatusChange && (
          <Field>
            <FieldLabel htmlFor="campaign-status">Campaign Status</FieldLabel>
            <Select
              value={status}
              onValueChange={(v) => onStatusChange(v as CampaignStatus)}
            >
              <SelectTrigger id="campaign-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      </div>

      <FieldSet data-invalid={!!errors.type || undefined}>
        <FieldLegend variant="label">Communication Channel</FieldLegend>
        <RadioGroup
          value={draft.type}
          onValueChange={(v) => onChange({ type: v as Channel })}
          className="grid gap-3 sm:grid-cols-3"
        >
          {CHANNELS.map((channel) => (
            <FieldLabel
              key={channel.value}
              htmlFor={`channel-${channel.value}`}
            >
              <Field orientation="horizontal">
                <ChoiceIcon icon={channel.icon} />
                <FieldContent>
                  <FieldTitle>{channel.label}</FieldTitle>
                  <FieldDescription>{channel.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={channel.value}
                  id={`channel-${channel.value}`}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        <FieldError>{errors.type}</FieldError>
      </FieldSet>
    </FieldGroup>
  )
}
