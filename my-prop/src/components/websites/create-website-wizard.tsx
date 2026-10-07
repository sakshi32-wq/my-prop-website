import { useEffect, useRef, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { useCreateWebsite } from "@/api/generated/websites/websites"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { StepAdditionalContent } from "./wizard/step-additional-content"
import { StepAiSettings } from "./wizard/step-ai-settings"
import { StepAmenities } from "./wizard/step-amenities"
import { StepBasicInfo } from "./wizard/step-basic-info"
import { StepPropertyType } from "./wizard/step-property-type"
import { StepTemplate } from "./wizard/step-template"
import { StepWebsiteTools } from "./wizard/step-website-tools"
import {
  WIZARD_STEPS,
  createInitialData,
  toWebsiteInput,
  validateStep,
} from "./wizard/types"
import type { UploadedFile, WizardData } from "./wizard/types"

const TOTAL_STEPS = WIZARD_STEPS.length
const MAX_FILE_SIZE = 10 * 1024 * 1024

export function CreateWebsiteWizard({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-2xl">
        {/* The body unmounts whenever the dialog closes, so every reopen starts fresh. */}
        <WizardBody onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function WizardBody({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(createInitialData)
  const [attempted, setAttempted] = useState<Array<number>>([])
  const [files, setFiles] = useState<Array<UploadedFile>>([])
  const bodyRef = useRef<HTMLDivElement>(null)
  const createWebsite = useCreateWebsite({
    mutation: {
      onSuccess: (website) => {
        toast.success(`"${website.name}" created`, {
          description: "Opening the website builder…",
        })
        onClose()
        void navigate({
          to: "/app/websites/$id/builder",
          params: { id: website.id },
        })
      },
    },
  })

  // Revoke any remaining preview URLs when the wizard unmounts.
  const filesRef = useRef(files)
  useEffect(() => {
    filesRef.current = files
  }, [files])
  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
    }
  }, [])

  const errors = attempted.includes(step) ? validateStep(step, data) : {}

  function update(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  function goTo(next: number) {
    setStep(next)
    bodyRef.current?.scrollTo({ top: 0 })
  }

  function handleNext() {
    if (Object.keys(validateStep(step, data)).length > 0) {
      setAttempted((prev) => [...prev, step])
      return
    }
    if (step < TOTAL_STEPS) {
      goTo(step + 1)
      return
    }
    createWebsite.mutate({ data: toWebsiteInput(data, files) })
  }

  function addFiles(selected: Array<File>) {
    const tooLarge = selected.filter((file) => file.size > MAX_FILE_SIZE)
    if (tooLarge.length > 0) {
      toast.error(
        `${tooLarge.length} file${tooLarge.length > 1 ? "s are" : " is"} larger than 10MB`,
        { description: tooLarge.map((file) => file.name).join(", ") }
      )
    }
    const accepted = selected
      .filter((file) => file.size <= MAX_FILE_SIZE)
      .map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }))
    if (accepted.length) setFiles((prev) => [...prev, ...accepted])
  }

  function removeFile(id: string) {
    const file = files.find((f) => f.id === id)
    if (file?.preview) URL.revokeObjectURL(file.preview)
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  function clearFiles() {
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview)
    })
    setFiles([])
  }

  const stepProps = { data, update, errors }

  return (
    <>
      <DialogHeader className="pr-8">
        <DialogTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" />
          Create New Property Website
        </DialogTitle>
        <DialogDescription>
          Step {step} of {TOTAL_STEPS} · {WIZARD_STEPS[step - 1]}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-2">
        <Progress
          value={(step / TOTAL_STEPS) * 100}
          aria-label={`Step ${step} of ${TOTAL_STEPS}`}
        />
        <ol className="hidden grid-cols-7 gap-2 text-center text-xs md:grid">
          {WIZARD_STEPS.map((label, index) => (
            <li
              key={label}
              aria-current={index + 1 === step ? "step" : undefined}
              className={cn(
                "text-muted-foreground",
                index + 1 <= step && "font-medium text-foreground"
              )}
            >
              {label}
            </li>
          ))}
        </ol>
      </div>

      <div
        ref={bodyRef}
        className="-mx-4 min-h-0 flex-1 overflow-y-auto px-4 py-1"
      >
        {step === 1 && <StepBasicInfo {...stepProps} />}
        {step === 2 && <StepPropertyType {...stepProps} />}
        {step === 3 && <StepAmenities {...stepProps} />}
        {step === 4 && <StepAiSettings {...stepProps} />}
        {step === 5 && <StepTemplate {...stepProps} />}
        {step === 6 && (
          <StepAdditionalContent
            {...stepProps}
            files={files}
            onAddFiles={addFiles}
            onRemoveFile={removeFile}
            onClearFiles={clearFiles}
          />
        )}
        {step === 7 && <StepWebsiteTools {...stepProps} />}
      </div>

      <DialogFooter className="flex-row justify-between sm:justify-between">
        <Button
          variant="outline"
          onClick={() => goTo(step - 1)}
          disabled={step === 1}
        >
          <ChevronLeftIcon data-icon="inline-start" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={createWebsite.isPending}>
          {step === TOTAL_STEPS ? (
            <>
              {createWebsite.isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SparklesIcon data-icon="inline-start" />
              )}
              Create Website
            </>
          ) : (
            <>
              Next
              <ChevronRightIcon data-icon="inline-end" />
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  )
}
