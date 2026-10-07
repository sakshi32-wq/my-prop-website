import { WandSparklesIcon } from "lucide-react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
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
import { Switch } from "@/components/ui/switch"
import { AI_TONES } from "@/lib/mock-data"

import { StepIntro } from "./step-intro"
import type { StepProps } from "./types"

export function StepAiSettings({ data, update }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon={WandSparklesIcon}
        title="AI Content Generation"
        description="Customize how AI generates your website content."
      />
      <FieldGroup>
        <FieldLabel htmlFor="wizard-generate-ai">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>Generate content with AI</FieldTitle>
              <FieldDescription>
                Let AI create compelling copy for your website
              </FieldDescription>
            </FieldContent>
            <Switch
              id="wizard-generate-ai"
              checked={data.generateWithAI}
              onCheckedChange={(checked) => update({ generateWithAI: checked })}
            />
          </Field>
        </FieldLabel>

        {data.generateWithAI && (
          <>
            <Field>
              <FieldLabel htmlFor="wizard-ai-tone">
                Content Tone & Style
              </FieldLabel>
              <Select
                value={data.aiTone}
                onValueChange={(value) => update({ aiTone: value })}
              >
                <SelectTrigger id="wizard-ai-tone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {AI_TONES.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="wizard-target-audience">
                Target Audience
              </FieldLabel>
              <Input
                id="wizard-target-audience"
                placeholder="e.g., Young professionals, Families, Retirees"
                value={data.targetAudience}
                onChange={(e) => update({ targetAudience: e.target.value })}
              />
            </Field>
          </>
        )}
      </FieldGroup>
    </div>
  )
}
