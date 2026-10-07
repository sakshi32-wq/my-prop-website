import { useEffect, useRef, useState } from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkPlusIcon,
  CheckIcon,
  EyeIcon,
  RefreshCwIcon,
  Share2Icon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import type {
  GeneratedTemplate,
  LibraryTemplate,
} from "@/components/templates/template-data"
import { GeneratedPreview } from "@/components/templates/generated-preview"
import {
  ContentStep,
  DesignStep,
  LayoutStep,
  TypeStep,
  WizardSummary,
} from "@/components/templates/wizard-steps"
import {
  EMPTY_WIZARD_DATA,
  WIZARD_STEPS,
  buildGeneratedTemplate,
  validateStep,
} from "@/components/templates/wizard-options"
import type {
  WizardData,
  WizardErrors,
} from "@/components/templates/wizard-options"
import { useCreateTemplate } from "@/api/generated/templates/templates"
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

const LAST_STEP = WIZARD_STEPS.length - 1

export function GenerateTemplateWizard({
  open,
  onOpenChange,
  onUseTemplate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUseTemplate: (template: LibraryTemplate) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-3xl">
        {/* Mounted only while open, so the wizard resets on close. */}
        <WizardBody onUseTemplate={onUseTemplate} />
      </DialogContent>
    </Dialog>
  )
}

function WizardBody({
  onUseTemplate,
}: {
  onUseTemplate: (template: LibraryTemplate) => void
}) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<WizardData>(EMPTY_WIZARD_DATA)
  const [showErrors, setShowErrors] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<GeneratedTemplate | null>(null)
  // The library copy, once the generated template has been saved.
  const [saved, setSaved] = useState<LibraryTemplate | null>(null)
  const createTemplate = useCreateTemplate({
    mutation: {
      onSuccess: (template) => {
        setSaved(template)
        toast.success("Saved to library", {
          description: `${template.name} is now in your template library.`,
        })
      },
    },
  })
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const scrollArea = useRef<HTMLDivElement>(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const errors: WizardErrors = showErrors ? validateStep(step, data) : {}

  function update(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }))
  }

  function goTo(next: number) {
    setStep(next)
    setShowErrors(false)
    scrollArea.current?.scrollTo({ top: 0 })
  }

  function handleNext() {
    if (Object.keys(validateStep(step, data)).length > 0) {
      setShowErrors(true)
      return
    }
    goTo(step + 1)
  }

  function handleGenerate() {
    setGenerating(true)
    timer.current = setTimeout(() => {
      setGenerating(false)
      setGenerated(buildGeneratedTemplate(data))
      setSaved(null)
    }, 3000)
  }

  function handleSave() {
    if (generated) createTemplate.mutate({ data: generated })
  }

  // Websites can only use library templates, so save the result first.
  function handleUse() {
    if (saved) onUseTemplate(saved)
    else if (generated)
      createTemplate.mutate(
        { data: generated },
        { onSuccess: (template) => onUseTemplate(template) }
      )
  }

  const current = WIZARD_STEPS[step]

  return (
    <>
      <DialogHeader className="pr-8">
        <DialogTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" />
          Generate Custom Template with AI
        </DialogTitle>
        <DialogDescription>
          Create a personalized website template powered by AI
        </DialogDescription>
      </DialogHeader>

      <StepIndicator step={step} />

      <div
        ref={scrollArea}
        className="-mx-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-1"
      >
        {step < LAST_STEP && (
          <h3 className="text-base font-semibold">{current.name}</h3>
        )}
        {step === 0 && <TypeStep data={data} errors={errors} update={update} />}
        {step === 1 && (
          <DesignStep data={data} errors={errors} update={update} />
        )}
        {step === 2 && (
          <LayoutStep data={data} errors={errors} update={update} />
        )}
        {step === 3 && (
          <ContentStep data={data} errors={errors} update={update} />
        )}
        {step === LAST_STEP &&
          (generated ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <CheckIcon className="size-6" />
                </span>
                <h3 className="text-xl font-semibold">Template Generated!</h3>
                <p className="text-muted-foreground">
                  {generated.name} is ready to use
                </p>
              </div>
              <GeneratedPreview template={generated} data={data} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    toast("Full preview is being prepared", {
                      description:
                        "Use the template to open it in the website builder.",
                    })
                  }
                >
                  <EyeIcon data-icon="inline-start" />
                  Full Preview
                </Button>
                <Button disabled={createTemplate.isPending} onClick={handleUse}>
                  <CheckIcon data-icon="inline-start" />
                  Use Template
                </Button>
                <Button
                  variant="outline"
                  disabled={!!saved || createTemplate.isPending}
                  onClick={handleSave}
                >
                  {createTemplate.isPending ? (
                    <Spinner data-icon="inline-start" />
                  ) : saved ? (
                    <CheckIcon data-icon="inline-start" />
                  ) : (
                    <BookmarkPlusIcon data-icon="inline-start" />
                  )}
                  {saved ? "Saved to Library" : "Save to Library"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("Share link created", {
                      description: `Save ${generated.name} to your library to share it with your team.`,
                    })
                  }
                >
                  <Share2Icon data-icon="inline-start" />
                  Share Template
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <SparklesIcon className="size-6" />
                </span>
                <h3 className="text-xl font-semibold">Ready to Generate!</h3>
                <p className="text-muted-foreground">
                  Review your selections and generate your custom template
                </p>
              </div>
              <WizardSummary data={data} />
            </div>
          ))}
      </div>

      <DialogFooter className="sm:items-center sm:justify-between">
        <span className="hidden text-sm text-muted-foreground sm:block">
          Step {step + 1} of {WIZARD_STEPS.length}
        </span>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          {step === LAST_STEP && generated ? (
            <Button
              variant="outline"
              onClick={() => {
                setGenerated(null)
                setSaved(null)
                goTo(0)
              }}
            >
              <RefreshCwIcon data-icon="inline-start" />
              Start Over
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={step === 0 || generating}
              onClick={() => goTo(step - 1)}
            >
              <ArrowLeftIcon data-icon="inline-start" />
              Back
            </Button>
          )}
          {step < LAST_STEP && (
            <Button onClick={handleNext}>
              Next
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
          {step === LAST_STEP && !generated && (
            <Button disabled={generating} onClick={handleGenerate}>
              {generating ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SparklesIcon data-icon="inline-start" />
              )}
              {generating ? "Generating Template..." : "Generate Template"}
            </Button>
          )}
        </div>
      </DialogFooter>
    </>
  )
}

function StepIndicator({ step }: { step: number }) {
  const progress = (step / (WIZARD_STEPS.length - 1)) * 100
  return (
    <div className="flex flex-col gap-3">
      <ol className="flex items-start justify-between gap-1">
        {WIZARD_STEPS.map(({ name, icon: Icon }, index) => {
          const done = index < step
          const active = index === step
          return (
            <li
              key={name}
              aria-current={active ? "step" : undefined}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center"
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary bg-primary/10 text-foreground",
                  !done && !active && "bg-muted text-muted-foreground"
                )}
              >
                {done ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
                <span className="sr-only">{name}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "hidden text-xs leading-tight sm:block",
                  active || done
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {name}
              </span>
            </li>
          )
        })}
      </ol>
      <Progress value={progress} aria-label={`Step ${step + 1} of 5`} />
      <p className="text-center text-xs text-muted-foreground sm:hidden">
        Step {step + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[step].name}
      </p>
    </div>
  )
}
