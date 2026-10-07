import { WrenchIcon } from "lucide-react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { WEBSITE_TOOLS } from "@/lib/mock-data"

import { StepIntro } from "./step-intro"
import type { StepProps } from "./types"

export function StepWebsiteTools({ data, update }: StepProps) {
  const enabledCount = Object.values(data.tools).filter(Boolean).length

  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon={WrenchIcon}
        title="Select Website Tools"
        description={`Choose tools to enhance your website's functionality. ${enabledCount} of ${WEBSITE_TOOLS.length} enabled.`}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {WEBSITE_TOOLS.map((tool) => {
          const id = `wizard-tool-${tool.id}`
          return (
            <FieldLabel key={tool.id} htmlFor={id}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    <tool.icon className="size-4 text-muted-foreground" />
                    {tool.name}
                  </FieldTitle>
                  <FieldDescription>{tool.description}</FieldDescription>
                </FieldContent>
                <Switch
                  id={id}
                  checked={data.tools[tool.id] ?? false}
                  onCheckedChange={(checked) =>
                    update({ tools: { ...data.tools, [tool.id]: checked } })
                  }
                />
              </Field>
            </FieldLabel>
          )
        })}
      </div>
    </div>
  )
}
