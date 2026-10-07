import {
  ASSIGN_OPTIONS,
  CONDITION_OPTIONS,
  DELAY_UNITS,
  NOTIFY_OPTIONS,
  TRIGGER_OPTIONS,
} from "./automation-data"
import type { AutomationStep, DelayUnit, StepConfig } from "./automation-data"
import type { StepErrors } from "./edit-step-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldDescription,
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
import { Textarea } from "@/components/ui/textarea"
import { QUICK_TAGS } from "@/lib/mock-data"

type Props = {
  step: AutomationStep
  onChange: (step: AutomationStep) => void
  errors: StepErrors
}

function OptionSelect({
  id,
  label,
  value,
  options,
  onValueChange,
}: {
  id: string
  label: string
  value?: string
  options: { value: string; label: string }[]
  onValueChange: (value: string) => void
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export function StepConfigFields({ step, onChange, errors }: Props) {
  const c = step.config
  const set = (patch: Partial<AutomationStep>) =>
    onChange({ ...step, ...patch })
  const setConfig = (patch: StepConfig) =>
    onChange({ ...step, config: { ...c, ...patch } })

  const nameField = (
    <Field data-invalid={!!errors.name || undefined}>
      <FieldLabel htmlFor="step-name">Name</FieldLabel>
      <Input
        id="step-name"
        value={step.name}
        aria-invalid={!!errors.name || undefined}
        onChange={(e) => set({ name: e.target.value })}
      />
      <FieldError>{errors.name}</FieldError>
    </Field>
  )

  const descriptionField = (
    <Field>
      <FieldLabel htmlFor="step-description">Description</FieldLabel>
      <Input
        id="step-description"
        value={step.description}
        onChange={(e) => set({ description: e.target.value })}
      />
    </Field>
  )

  const messageField = (rows: number, placeholder: string) => (
    <Field>
      <FieldLabel htmlFor="step-message">Message</FieldLabel>
      <Textarea
        id="step-message"
        rows={rows}
        placeholder={placeholder}
        value={c.message ?? ""}
        onChange={(e) => setConfig({ message: e.target.value })}
      />
      <FieldDescription>
        Use variables: {"{name}"}, {"{project}"}, {"{agent}"}
      </FieldDescription>
    </Field>
  )

  if (step.type === "trigger") {
    return (
      <FieldGroup>
        <OptionSelect
          id="step-trigger"
          label="Trigger Event"
          value={c.trigger}
          options={TRIGGER_OPTIONS}
          onValueChange={(trigger) =>
            onChange({
              ...step,
              config: { ...c, trigger },
              description:
                TRIGGER_OPTIONS.find((t) => t.value === trigger)?.description ??
                step.description,
            })
          }
        />
        {descriptionField}
      </FieldGroup>
    )
  }

  return (
    <FieldGroup>
      {nameField}
      {descriptionField}

      {(step.type === "whatsapp" || step.type === "sms") &&
        messageField(5, "Enter your message here...")}

      {step.type === "email" && (
        <>
          <Field>
            <FieldLabel htmlFor="step-subject">Subject</FieldLabel>
            <Input
              id="step-subject"
              placeholder="Email subject"
              value={c.subject ?? ""}
              onChange={(e) => setConfig({ subject: e.target.value })}
            />
          </Field>
          {messageField(6, "Enter email body...")}
        </>
      )}

      {step.type === "wait" && (
        <div className="grid grid-cols-[1fr_auto] items-start gap-3">
          <Field data-invalid={!!errors.delay || undefined}>
            <FieldLabel htmlFor="step-delay">Delay Duration</FieldLabel>
            <Input
              id="step-delay"
              type="number"
              min={1}
              value={Number.isNaN(c.delay) ? "" : (c.delay ?? 1)}
              aria-invalid={!!errors.delay || undefined}
              onChange={(e) => setConfig({ delay: e.target.valueAsNumber })}
            />
            <FieldError>{errors.delay}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="step-delay-unit">Unit</FieldLabel>
            <Select
              value={c.delayUnit ?? "hours"}
              onValueChange={(v) => setConfig({ delayUnit: v as DelayUnit })}
            >
              <SelectTrigger id="step-delay-unit" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {DELAY_UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
      )}

      {step.type === "condition" && (
        <OptionSelect
          id="step-condition"
          label="Condition Type"
          value={c.condition}
          options={CONDITION_OPTIONS}
          onValueChange={(condition) => setConfig({ condition })}
        />
      )}

      {step.type === "assign" && (
        <OptionSelect
          id="step-assign"
          label="Assign To"
          value={c.assignTo}
          options={ASSIGN_OPTIONS}
          onValueChange={(assignTo) => setConfig({ assignTo })}
        />
      )}

      {step.type === "tag" && (
        <Field data-invalid={!!errors.tagName || undefined}>
          <FieldLabel htmlFor="step-tag">Tag Name</FieldLabel>
          <Input
            id="step-tag"
            placeholder="e.g., Hot Lead, Interested, Follow-up"
            value={c.tagName ?? ""}
            aria-invalid={!!errors.tagName || undefined}
            onChange={(e) => setConfig({ tagName: e.target.value })}
          />
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="outline" asChild>
                <button
                  type="button"
                  onClick={() => setConfig({ tagName: tag })}
                >
                  {tag}
                </button>
              </Badge>
            ))}
          </div>
          <FieldError>{errors.tagName}</FieldError>
        </Field>
      )}

      {step.type === "score" && (
        <Field data-invalid={!!errors.scoreValue || undefined}>
          <FieldLabel htmlFor="step-score">Score Change</FieldLabel>
          <Input
            id="step-score"
            type="number"
            step={1}
            placeholder="e.g., 10 or -5"
            value={Number.isNaN(c.scoreValue) ? "" : (c.scoreValue ?? 10)}
            aria-invalid={!!errors.scoreValue || undefined}
            onChange={(e) => setConfig({ scoreValue: e.target.valueAsNumber })}
          />
          <FieldDescription>
            Positive values increase score, negative decrease
          </FieldDescription>
          <FieldError>{errors.scoreValue}</FieldError>
        </Field>
      )}

      {step.type === "notification" && (
        <>
          <OptionSelect
            id="step-notify"
            label="Notify"
            value={c.notifyWho}
            options={NOTIFY_OPTIONS}
            onValueChange={(notifyWho) => setConfig({ notifyWho })}
          />
          {messageField(3, "e.g., {name} just replied, follow up now")}
        </>
      )}

      {step.type === "webhook" && (
        <Field data-invalid={!!errors.webhookUrl || undefined}>
          <FieldLabel htmlFor="step-webhook">Webhook URL</FieldLabel>
          <Input
            id="step-webhook"
            type="url"
            placeholder="https://your-webhook-url.com/endpoint"
            value={c.webhookUrl ?? ""}
            aria-invalid={!!errors.webhookUrl || undefined}
            onChange={(e) => setConfig({ webhookUrl: e.target.value })}
          />
          <FieldDescription>
            We'll POST the lead details as JSON to this URL.
          </FieldDescription>
          <FieldError>{errors.webhookUrl}</FieldError>
        </Field>
      )}
    </FieldGroup>
  )
}
