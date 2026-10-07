import { XIcon } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { useBuilder } from "./builder-context"
import { ColorField, NumberField, SliderField } from "./property-fields"
import { ELEMENT_ICONS, ELEMENT_LABELS } from "./section-icons"
import type { BuilderElement } from "./types"
import type { ElementPatch } from "./use-builder-state"

const FONT_WEIGHTS = [
  { value: "normal", label: "Normal" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "bold", label: "Bold" },
]

function numeric(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const parsed = typeof value === "string" ? parseFloat(value) : NaN
  return Number.isFinite(parsed) ? parsed : fallback
}

export function ElementProperties({
  sectionId,
  element,
}: {
  sectionId: string
  element: BuilderElement
}) {
  const { updateElement, select } = useBuilder()
  const styles = element.styles ?? {}
  const update = (patch: ElementPatch) =>
    updateElement(sectionId, element.id, patch)
  const Icon = ELEMENT_ICONS[element.type]
  const isTextual = ["heading", "text", "button"].includes(element.type)
  const isFormControl = element.type === "input" || element.type === "textarea"
  const hasTypography = isTextual || isFormControl
  const fontWeight = String(styles.fontWeight ?? "normal")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          <Icon data-icon="inline-start" />
          {ELEMENT_LABELS[element.type]}
        </Badge>
        <span className="text-sm text-muted-foreground">Editing element</span>
      </div>
      <Separator />

      <FieldGroup>
        {isTextual && (
          <Field>
            <FieldLabel htmlFor="element-content">Content</FieldLabel>
            <Textarea
              id="element-content"
              rows={3}
              value={element.content ?? ""}
              onChange={(e) => update({ content: e.target.value })}
            />
          </Field>
        )}

        {isFormControl && (
          <Field>
            <FieldLabel htmlFor="element-placeholder">Placeholder</FieldLabel>
            <Input
              id="element-placeholder"
              value={element.content ?? ""}
              onChange={(e) => update({ content: e.target.value })}
            />
          </Field>
        )}

        {element.type === "image" && (
          <Field>
            <FieldLabel htmlFor="element-image">Image URL</FieldLabel>
            <Input
              id="element-image"
              type="url"
              placeholder="https://..."
              value={element.content ?? ""}
              onChange={(e) => update({ content: e.target.value })}
            />
            {element.content && (
              <AspectRatio
                ratio={4 / 3}
                className="overflow-hidden rounded-lg bg-muted"
              >
                <img
                  src={element.content}
                  alt="Selected image preview"
                  className="size-full object-cover"
                />
              </AspectRatio>
            )}
          </Field>
        )}

        {element.type === "container" && (
          <FieldDescription>
            Containers group other elements. Pick a child in the Layers tab or
            click it on the canvas to edit its content.
          </FieldDescription>
        )}

        {hasTypography && (
          <>
            <NumberField
              id="element-font-size"
              label="Font Size"
              min={8}
              max={160}
              value={numeric(styles.fontSize, 16)}
              onChange={(fontSize) => update({ styles: { fontSize } })}
            />
            <Field>
              <FieldLabel htmlFor="element-font-weight">Font Weight</FieldLabel>
              <Select
                value={fontWeight}
                onValueChange={(value) =>
                  update({ styles: { fontWeight: value } })
                }
              >
                <SelectTrigger id="element-font-weight" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FONT_WEIGHTS.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                    {!FONT_WEIGHTS.some((w) => w.value === fontWeight) && (
                      <SelectItem value={fontWeight}>{fontWeight}</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </>
        )}

        <SliderField
          id="element-margin-bottom"
          label="Margin Bottom"
          value={numeric(styles.marginBottom, 0)}
          max={100}
          step={4}
          onChange={(marginBottom) => update({ styles: { marginBottom } })}
        />

        {element.type === "button" && (
          <>
            <ColorField
              id="element-bg-color"
              label="Background Color"
              value={styles.backgroundColor}
              fallback="#10b981"
              onChange={(backgroundColor) =>
                update({ styles: { backgroundColor } })
              }
            />
            <ColorField
              id="element-text-color"
              label="Text Color"
              value={styles.color}
              fallback="#ffffff"
              onChange={(color) => update({ styles: { color } })}
            />
            <SliderField
              id="element-radius"
              label="Border Radius"
              value={numeric(styles.borderRadius, 8)}
              max={50}
              step={2}
              onChange={(borderRadius) => update({ styles: { borderRadius } })}
            />
          </>
        )}
      </FieldGroup>

      <Button variant="outline" onClick={() => select(sectionId)}>
        <XIcon data-icon="inline-start" />
        Deselect Element
      </Button>
    </div>
  )
}
