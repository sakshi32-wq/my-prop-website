import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { WEBSITE_TOOLS } from "@/lib/mock-data"
import type { WebsiteTool } from "@/lib/mock-data"

const CATEGORIES: Array<{ value: WebsiteTool["category"]; label: string }> = [
  { value: "lead-generation", label: "Lead Generation" },
  { value: "engagement", label: "Engagement" },
  { value: "analytics", label: "Analytics" },
  { value: "utilities", label: "Utilities" },
]

export function WebsiteInfoTools({
  enabledIds,
  onChange,
}: {
  enabledIds: Array<string>
  onChange: (ids: Array<string>) => void
}) {
  function toggle(id: string, enabled: boolean) {
    onChange(
      enabled
        ? [...new Set([...enabledIds, id])]
        : enabledIds.filter((t) => t !== id)
    )
  }

  return (
    <FieldSet>
      <FieldLegend>Website Tools</FieldLegend>
      <FieldDescription>
        Configure website tools and features. {enabledIds.length} of{" "}
        {WEBSITE_TOOLS.length} enabled.
      </FieldDescription>
      <FieldGroup>
        {CATEGORIES.map((category) => (
          <FieldSet key={category.value}>
            <FieldLegend variant="label">{category.label}</FieldLegend>
            <div className="grid gap-3 sm:grid-cols-2">
              {WEBSITE_TOOLS.filter((t) => t.category === category.value).map(
                (tool) => {
                  const Icon = tool.icon
                  const id = `tool-${tool.id}`
                  return (
                    <FieldLabel key={tool.id} htmlFor={id}>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            <Icon className="size-4 text-muted-foreground" />
                            {tool.name}
                          </FieldTitle>
                          <FieldDescription>
                            {tool.description}
                          </FieldDescription>
                        </FieldContent>
                        <Switch
                          id={id}
                          checked={enabledIds.includes(tool.id)}
                          onCheckedChange={(checked) =>
                            toggle(tool.id, checked)
                          }
                        />
                      </Field>
                    </FieldLabel>
                  )
                }
              )}
            </div>
          </FieldSet>
        ))}
      </FieldGroup>
    </FieldSet>
  )
}
