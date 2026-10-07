import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { useBuilder } from "./builder-context"
import { ColorField, SliderField } from "./property-fields"
import type { Section, TextAlign } from "./types"

// Website palette options (content data, rendered inside the canvas).
const BACKGROUND_SWATCHES = [
  { value: "#0f172a", label: "Midnight" },
  { value: "#10b981", label: "Emerald" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ffffff", label: "White" },
  { value: "#f8fafc", label: "Snow" },
]

const TEXT_COLORS = [
  { value: "#ffffff", label: "White" },
  { value: "#1e293b", label: "Dark" },
  { value: "#64748b", label: "Gray" },
  { value: "#10b981", label: "Emerald" },
]

const ALIGNMENTS: Array<{
  value: TextAlign
  label: string
  icon: typeof AlignLeftIcon
}> = [
  { value: "left", label: "Align left", icon: AlignLeftIcon },
  { value: "center", label: "Align center", icon: AlignCenterIcon },
  { value: "right", label: "Align right", icon: AlignRightIcon },
]

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-4 shrink-0 rounded-sm border"
      style={{ backgroundColor: color }}
    />
  )
}

export function SectionProperties({ section }: { section: Section }) {
  const { renameSection, updateSectionStyles } = useBuilder()
  const { styles } = section
  const textColor = styles.textColor ?? "#000000"
  const knownTextColor = TEXT_COLORS.some((c) => c.value === textColor)

  return (
    <Tabs defaultValue="content">
      <TabsList className="w-full">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="pt-2">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="section-name">Section Name</FieldLabel>
            <Input
              id="section-name"
              value={section.name}
              onChange={(e) => renameSection(section.id, e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="section-bg-image">
              Background Image URL
            </FieldLabel>
            <Input
              id="section-bg-image"
              type="url"
              placeholder="https://..."
              value={styles.backgroundImage ?? ""}
              onChange={(e) =>
                updateSectionStyles(section.id, {
                  backgroundImage: e.target.value,
                })
              }
            />
            <FieldDescription>Leave empty for a solid color.</FieldDescription>
          </Field>
          <Button
            onClick={() =>
              toast.info("AI content generation is coming soon", {
                description: `We'll write copy for "${section.name}" from your website info.`,
              })
            }
          >
            <SparklesIcon data-icon="inline-start" />
            Generate with AI
          </Button>
        </FieldGroup>
      </TabsContent>

      <TabsContent value="style" className="pt-2">
        <FieldGroup>
          <Field>
            <FieldTitle id="section-bg-label">Background Color</FieldTitle>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              aria-labelledby="section-bg-label"
              className="flex-wrap"
              value={styles.backgroundColor ?? ""}
              onValueChange={(value) => {
                if (value) {
                  updateSectionStyles(section.id, { backgroundColor: value })
                }
              }}
            >
              {BACKGROUND_SWATCHES.map((swatch) => (
                <ToggleGroupItem
                  key={swatch.value}
                  value={swatch.value}
                  aria-label={swatch.label}
                  title={swatch.label}
                >
                  <Swatch color={swatch.value} />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <ColorField
              id="section-bg-color"
              label="Custom background color"
              hideLabel
              value={styles.backgroundColor}
              fallback="#ffffff"
              onChange={(backgroundColor) =>
                updateSectionStyles(section.id, { backgroundColor })
              }
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="section-text-color">Text Color</FieldLabel>
            <Select
              value={textColor}
              onValueChange={(value) =>
                updateSectionStyles(section.id, { textColor: value })
              }
            >
              <SelectTrigger id="section-text-color" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TEXT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <Swatch color={color.value} />
                      {color.label}
                    </SelectItem>
                  ))}
                  {!knownTextColor && (
                    <SelectItem value={textColor}>
                      <Swatch color={textColor} />
                      Custom ({textColor})
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <SliderField
            id="section-padding"
            label="Padding"
            value={styles.padding ?? 40}
            max={200}
            step={8}
            onChange={(padding) => updateSectionStyles(section.id, { padding })}
          />

          <SliderField
            id="section-min-height"
            label="Min Height"
            value={styles.height ?? 0}
            max={800}
            step={50}
            format={(v) => (v === 0 ? "Auto" : `${v}px`)}
            onChange={(height) => updateSectionStyles(section.id, { height })}
          />

          <Field>
            <FieldTitle id="section-align-label">Text Alignment</FieldTitle>
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={0}
              aria-labelledby="section-align-label"
              className="w-full"
              value={styles.textAlign ?? "left"}
              onValueChange={(value) => {
                if (value) {
                  updateSectionStyles(section.id, {
                    textAlign: value as TextAlign,
                  })
                }
              }}
            >
              {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  aria-label={label}
                  className="flex-1"
                >
                  <Icon />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Field>
        </FieldGroup>
      </TabsContent>
    </Tabs>
  )
}
