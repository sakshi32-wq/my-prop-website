import { useEffect, useRef, useState } from "react"
import { Building2Icon, MapPinIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  AI_TONES,
  AMENITIES,
  PROPERTY_TYPES,
  UNIT_CONFIGURATIONS,
} from "@/lib/mock-data"

import { WebsiteInfoFiles } from "./website-info-files"
import { WebsiteInfoTools } from "./website-info-tools"
import type { WebsiteInfo } from "./website-info"

const TABS = [
  { value: "basic", label: "Basic Info" },
  { value: "property", label: "Property" },
  { value: "amenities", label: "Amenities" },
  { value: "ai", label: "AI Settings" },
  { value: "files", label: "Files" },
  { value: "content", label: "Content" },
  { value: "tools", label: "Tools" },
]

const CONTENT_FIELDS: Array<{
  key: keyof WebsiteInfo["additionalContent"]
  label: string
  placeholder: string
}> = [
  {
    key: "keyHighlights",
    label: "Key Highlights",
    placeholder: "e.g., Prime location, Vastu compliant, Ready to move, etc.",
  },
  {
    key: "developerInfo",
    label: "Developer Information",
    placeholder:
      "Information about the developer, their track record, awards, etc.",
  },
  {
    key: "nearbyLocations",
    label: "Nearby Locations & Connectivity",
    placeholder: "Schools, hospitals, malls, metro stations, airports, etc.",
  },
  {
    key: "specialOffers",
    label: "Special Offers & Payment Plans",
    placeholder:
      "Launch offers, payment plans, discounts, financing options, etc.",
  },
]

type Errors = Partial<Record<"projectName" | "location", string>>

function validate(info: WebsiteInfo): Errors {
  const errors: Errors = {}
  if (!info.projectName.trim()) errors.projectName = "Project name is required."
  if (!info.location.trim()) errors.location = "Location is required."
  return errors
}

function WebsiteInfoForm({
  initial,
  onSave,
}: {
  initial: WebsiteInfo
  onSave: (info: WebsiteInfo) => void
}) {
  const [form, setForm] = useState(initial)
  const [tab, setTab] = useState("basic")
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validate(form) : {}

  // Revoke preview object URLs that end up unused once the dialog closes:
  // files added then cancelled, or removed then saved.
  const latest = useRef({ form, saved: false })
  useEffect(() => {
    latest.current.form = form
  }, [form])
  useEffect(() => {
    const tracked = latest.current
    return () => {
      const kept = tracked.saved
        ? tracked.form.uploadedFiles
        : initial.uploadedFiles
      const keptIds = new Set(kept.map((f) => f.id))
      for (const file of [
        ...initial.uploadedFiles,
        ...tracked.form.uploadedFiles,
      ]) {
        if (file.preview && !keptIds.has(file.id)) {
          URL.revokeObjectURL(file.preview)
        }
      }
    }
  }, [initial])

  const set = <TKey extends keyof WebsiteInfo>(
    key: TKey,
    value: WebsiteInfo[TKey]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length > 0) {
      setTab("basic")
      toast.error("Please fill in the required fields")
      return
    }
    latest.current.saved = true
    onSave({
      ...form,
      projectName: form.projectName.trim(),
      location: form.location.trim(),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex min-w-0 flex-col gap-4"
    >
      <Tabs value={tab} onValueChange={setTab} className="min-w-0">
        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <TabsList className="w-max">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="px-2.5">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <ScrollArea className="-mx-4 h-[min(60svh,520px)]">
          <div className="px-4 py-2">
            <TabsContent value="basic">
              <FieldSet>
                <FieldLegend>Basic Information</FieldLegend>
                <FieldDescription>
                  Update your project&apos;s basic details.
                </FieldDescription>
                <FieldGroup>
                  <Field data-invalid={!!errors.projectName}>
                    <FieldLabel htmlFor="info-project-name">
                      Project Name *
                    </FieldLabel>
                    <Input
                      id="info-project-name"
                      placeholder="e.g., Skyline Heights"
                      aria-invalid={!!errors.projectName}
                      value={form.projectName}
                      onChange={(e) => set("projectName", e.target.value)}
                    />
                    <FieldError>{errors.projectName}</FieldError>
                  </Field>
                  <Field data-invalid={!!errors.location}>
                    <FieldLabel htmlFor="info-location">Location *</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <MapPinIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="info-location"
                        placeholder="e.g., Andheri West, Mumbai"
                        aria-invalid={!!errors.location}
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                      />
                    </InputGroup>
                    <FieldError>{errors.location}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="info-description">
                      Project Description
                    </FieldLabel>
                    <Textarea
                      id="info-description"
                      rows={4}
                      placeholder="Briefly describe your property project..."
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </TabsContent>

            <TabsContent value="property">
              <FieldSet>
                <FieldLegend>Property Details</FieldLegend>
                <FieldDescription>
                  Update property type and configurations.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="info-property-type">
                      Property Type
                    </FieldLabel>
                    <Select
                      value={form.propertyType}
                      onValueChange={(value) => set("propertyType", value)}
                    >
                      <SelectTrigger id="info-property-type" className="w-full">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldTitle id="info-configurations">
                      Configurations Available
                    </FieldTitle>
                    <ToggleGroup
                      type="multiple"
                      variant="outline"
                      aria-labelledby="info-configurations"
                      className="flex-wrap"
                      value={form.configurations}
                      onValueChange={(value) => set("configurations", value)}
                    >
                      {UNIT_CONFIGURATIONS.map((config) => (
                        <ToggleGroupItem key={config} value={config}>
                          {config}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="info-price-range">
                      Price Range
                    </FieldLabel>
                    <Input
                      id="info-price-range"
                      placeholder="e.g., ₹80L - ₹1.5Cr"
                      value={form.priceRange}
                      onChange={(e) => set("priceRange", e.target.value)}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </TabsContent>

            <TabsContent value="amenities">
              <FieldSet>
                <FieldLegend>Amenities &amp; Features</FieldLegend>
                <FieldDescription>
                  Update amenities your project offers.
                </FieldDescription>
                <Field>
                  <FieldTitle id="info-amenities">Select Amenities</FieldTitle>
                  <ToggleGroup
                    type="multiple"
                    variant="outline"
                    aria-labelledby="info-amenities"
                    className="flex-wrap"
                    value={form.amenities}
                    onValueChange={(value) => set("amenities", value)}
                  >
                    {AMENITIES.map((amenity) => (
                      <ToggleGroupItem key={amenity} value={amenity}>
                        {amenity}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <FieldDescription>
                    Selected: {form.amenities.length} amenities
                  </FieldDescription>
                </Field>
              </FieldSet>
            </TabsContent>

            <TabsContent value="ai">
              <FieldSet>
                <FieldLegend>AI Content Generation</FieldLegend>
                <FieldDescription>
                  Customize AI content generation settings.
                </FieldDescription>
                <FieldGroup>
                  <FieldLabel htmlFor="info-generate-ai">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Generate content with AI</FieldTitle>
                        <FieldDescription>
                          Let AI create compelling copy for your website.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        id="info-generate-ai"
                        checked={form.generateWithAI}
                        onCheckedChange={(checked) =>
                          set("generateWithAI", checked)
                        }
                      />
                    </Field>
                  </FieldLabel>
                  {form.generateWithAI && (
                    <>
                      <Field>
                        <FieldLabel htmlFor="info-ai-tone">
                          Content Tone &amp; Style
                        </FieldLabel>
                        <Select
                          value={form.aiTone}
                          onValueChange={(value) => set("aiTone", value)}
                        >
                          <SelectTrigger id="info-ai-tone" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
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
                        <FieldLabel htmlFor="info-audience">
                          Target Audience
                        </FieldLabel>
                        <Input
                          id="info-audience"
                          placeholder="e.g., Young professionals, Families, Retirees"
                          value={form.targetAudience}
                          onChange={(e) =>
                            set("targetAudience", e.target.value)
                          }
                        />
                      </Field>
                    </>
                  )}
                </FieldGroup>
              </FieldSet>
            </TabsContent>

            <TabsContent value="files">
              <WebsiteInfoFiles
                files={form.uploadedFiles}
                onChange={(files) => set("uploadedFiles", files)}
              />
            </TabsContent>

            <TabsContent value="content">
              <FieldSet>
                <FieldLegend>Additional Content</FieldLegend>
                <FieldDescription>
                  Update additional content for AI to use.
                </FieldDescription>
                <FieldGroup>
                  {CONTENT_FIELDS.map((field) => (
                    <Field key={field.key}>
                      <FieldLabel htmlFor={`info-${field.key}`}>
                        {field.label}
                      </FieldLabel>
                      <Textarea
                        id={`info-${field.key}`}
                        rows={3}
                        placeholder={field.placeholder}
                        value={form.additionalContent[field.key]}
                        onChange={(e) =>
                          set("additionalContent", {
                            ...form.additionalContent,
                            [field.key]: e.target.value,
                          })
                        }
                      />
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            </TabsContent>

            <TabsContent value="tools">
              <WebsiteInfoTools
                enabledIds={form.enabledToolIds}
                onChange={(ids) => set("enabledToolIds", ids)}
              />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">
          <SaveIcon data-icon="inline-start" />
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  )
}

export function EditWebsiteInfoDialog({
  open,
  onOpenChange,
  info,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  info: WebsiteInfo
  onSave: (info: WebsiteInfo) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2Icon className="size-4 text-muted-foreground" />
            Edit Website Information
          </DialogTitle>
          <DialogDescription>
            Update your project&apos;s website information and settings.
          </DialogDescription>
        </DialogHeader>
        {/* The form only mounts while open, so its draft resets on close. */}
        <WebsiteInfoForm
          initial={info}
          onSave={(next) => {
            onSave(next)
            toast.success("Website information updated")
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
