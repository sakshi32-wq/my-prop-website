import { SparklesIcon, UploadIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

import { FileUploadList } from "./file-upload-list"
import { StepIntro } from "./step-intro"
import type { StepProps, UploadedFile, WizardData } from "./types"

const CONTENT_FIELDS: Array<{
  key: keyof Pick<
    WizardData,
    "keyHighlights" | "developerInfo" | "nearbyLocations" | "specialOffers"
  >
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

export function StepAdditionalContent({
  data,
  update,
  files,
  onAddFiles,
  onRemoveFile,
  onClearFiles,
}: StepProps & {
  files: Array<UploadedFile>
  onAddFiles: (files: Array<File>) => void
  onRemoveFile: (id: string) => void
  onClearFiles: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <StepIntro
        icon={UploadIcon}
        title="Upload Files & Additional Content"
        description="Upload images, brochures, floor plans, and add additional content for AI to use."
      />

      <FileUploadList
        files={files}
        onAddFiles={onAddFiles}
        onRemove={onRemoveFile}
        onClear={onClearFiles}
      />

      <Separator />

      <FieldSet>
        <FieldLegend>Additional Content for AI</FieldLegend>
        <FieldGroup>
          {CONTENT_FIELDS.map((field) => (
            <Field key={field.key}>
              <FieldLabel htmlFor={`wizard-${field.key}`}>
                {field.label}
              </FieldLabel>
              <Textarea
                id={`wizard-${field.key}`}
                placeholder={field.placeholder}
                rows={3}
                value={data[field.key]}
                onChange={(e) => update({ [field.key]: e.target.value })}
              />
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>

      <Alert>
        <SparklesIcon />
        <AlertTitle>AI-Powered Content Generation</AlertTitle>
        <AlertDescription>
          Our AI will analyze your uploaded files and content to generate
          compelling website copy, suggest layouts, and create an optimized user
          experience tailored to your property.
        </AlertDescription>
      </Alert>
    </div>
  )
}
