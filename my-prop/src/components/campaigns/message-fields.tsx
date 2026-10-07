import { useEffect, useRef, useState } from "react"
import { WandSparklesIcon } from "lucide-react"
import { toast } from "sonner"

import {
  AI_TONE_OPTIONS,
  MESSAGE_TEMPLATES,
  generateAiMessage,
} from "./campaign-data"
import type { CampaignDraft, DraftErrors } from "./campaign-data"
import { Button } from "@/components/ui/button"
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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

export function MessageFields({
  draft,
  onChange,
  errors,
  showTemplates = false,
}: {
  draft: CampaignDraft
  onChange: (patch: Partial<CampaignDraft>) => void
  errors: DraftErrors
  showTemplates?: boolean
}) {
  const [templateId, setTemplateId] = useState("")
  const [generating, setGenerating] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function loadTemplate(id: string) {
    const template = MESSAGE_TEMPLATES.find((t) => t.id === id)
    if (!template) return
    setTemplateId(id)
    onChange({
      message: template.content,
      ...(draft.type === "Email" && !draft.subject.trim()
        ? { subject: template.subject }
        : {}),
    })
  }

  function generate() {
    setGenerating(true)
    timer.current = setTimeout(() => {
      setGenerating(false)
      setTemplateId("")
      onChange({
        message: generateAiMessage(draft.aiTone),
        ...(draft.type === "Email" && !draft.subject.trim()
          ? { subject: "Exclusive opportunities at our latest project" }
          : {}),
      })
      toast.success("Message generated with AI")
    }, 900)
  }

  const isEmail = draft.type === "Email"
  const length = draft.message.length

  return (
    <FieldGroup>
      {isEmail && (
        <Field data-invalid={!!errors.subject || undefined}>
          <FieldLabel htmlFor="campaign-subject">Email Subject</FieldLabel>
          <Input
            id="campaign-subject"
            placeholder="e.g., Exclusive Launch Offer - Skyline Heights"
            value={draft.subject}
            aria-invalid={!!errors.subject || undefined}
            onChange={(e) => onChange({ subject: e.target.value })}
          />
          <FieldError>{errors.subject}</FieldError>
        </Field>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field>
          <FieldLabel htmlFor="campaign-tone">AI Tone</FieldLabel>
          <Select
            value={draft.aiTone}
            onValueChange={(aiTone) => onChange({ aiTone })}
          >
            <SelectTrigger id="campaign-tone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {AI_TONE_OPTIONS.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Button
          type="button"
          variant="outline"
          onClick={generate}
          disabled={generating}
        >
          {generating ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <WandSparklesIcon data-icon="inline-start" />
          )}
          {generating ? "Generating..." : "Generate with AI"}
        </Button>
      </div>

      {showTemplates && (
        <FieldSet>
          <FieldLegend variant="label">Message Template</FieldLegend>
          <FieldDescription>
            Selecting a template replaces the message below.
          </FieldDescription>
          <RadioGroup
            value={templateId}
            onValueChange={loadTemplate}
            className="grid gap-3 sm:grid-cols-2"
          >
            {MESSAGE_TEMPLATES.map((template) => (
              <FieldLabel key={template.id} htmlFor={`template-${template.id}`}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{template.name}</FieldTitle>
                    <FieldDescription className="line-clamp-2">
                      {template.content}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value={template.id}
                    id={`template-${template.id}`}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </FieldSet>
      )}

      <Field data-invalid={!!errors.message || undefined}>
        <FieldLabel htmlFor="campaign-message">Message Content</FieldLabel>
        <Textarea
          id="campaign-message"
          placeholder="Type your message here... Use {name} for personalization"
          rows={9}
          value={draft.message}
          disabled={generating}
          aria-invalid={!!errors.message || undefined}
          onChange={(e) => {
            setTemplateId("")
            onChange({ message: e.target.value })
          }}
        />
        <FieldDescription>
          Use {"{name}"}, {"{project}"}, {"{location}"} for personalization.{" "}
          {draft.type === "SMS"
            ? `${length} characters · ${Math.max(1, Math.ceil(length / 160))} SMS`
            : `${length} characters`}
        </FieldDescription>
        <FieldError>{errors.message}</FieldError>
      </Field>
    </FieldGroup>
  )
}
