import { AI_TOOLS } from "./data"
import type { ToolId } from "./data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ToolList({
  value,
  onValueChange,
}: {
  value: ToolId
  onValueChange: (value: ToolId) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle id="ai-tools-title">AI Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          aria-labelledby="ai-tools-title"
          value={value}
          onValueChange={(next) => onValueChange(next as ToolId)}
          className="sm:grid-cols-2 lg:grid-cols-1"
        >
          {AI_TOOLS.map((tool) => (
            <FieldLabel key={tool.id} htmlFor={`ai-tool-${tool.id}`}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>
                    <tool.icon className="size-4 text-muted-foreground" />
                    {tool.name}
                  </FieldTitle>
                  <FieldDescription>{tool.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={tool.id} id={`ai-tool-${tool.id}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
