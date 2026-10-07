import { useState } from "react"
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react"

import { AudienceFields } from "./audience-fields"
import { BasicsFields } from "./basics-fields"
import {
  emptyDraft,
  statusFor,
  validateAudience,
  validateBasics,
  validateMessage,
  validateSchedule,
} from "./campaign-data"
import type { Campaign, CampaignDraft, DraftErrors } from "./campaign-data"
import { CampaignReview } from "./campaign-review"
import { MessageFields } from "./message-fields"
import { ScheduleFields } from "./schedule-fields"
import { Badge } from "@/components/ui/badge"
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

const STEPS: {
  label: string
  title: string
  description: string
  validate: (d: CampaignDraft) => DraftErrors
}[] = [
  {
    label: "Basics",
    title: "Campaign Basics",
    description: "Set up your campaign details and goals",
    validate: validateBasics,
  },
  {
    label: "Audience",
    title: "Select Your Audience",
    description: "Choose which leads will receive this campaign",
    validate: validateAudience,
  },
  {
    label: "Message",
    title: "Compose Your Message",
    description: "Create engaging content for your campaign",
    validate: validateMessage,
  },
  {
    label: "Schedule",
    title: "Schedule Your Campaign",
    description: "Choose when and how to send your campaign",
    validate: validateSchedule,
  },
  {
    label: "Review",
    title: "Review & Launch",
    description: "Review your campaign details before launching",
    validate: () => ({}),
  },
]

export function CreateCampaignWizard({
  open,
  onOpenChange,
  onLaunch,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLaunch: (campaign: Campaign) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-2xl">
        {/* Content unmounts on close, so the wizard always restarts fresh. */}
        <WizardBody
          onLaunch={(campaign) => {
            onLaunch(campaign)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function WizardBody({ onLaunch }: { onLaunch: (campaign: Campaign) => void }) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<CampaignDraft>(emptyDraft)
  const [showErrors, setShowErrors] = useState(false)

  const current = STEPS[step]
  const errors = showErrors ? current.validate(draft) : {}
  const isLast = step === STEPS.length - 1

  function update(patch: Partial<CampaignDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  function goTo(index: number) {
    setShowErrors(false)
    setStep(index)
  }

  function next() {
    if (Object.keys(current.validate(draft)).length > 0) {
      setShowErrors(true)
      return
    }
    if (!isLast) {
      goTo(step + 1)
      return
    }
    // Re-validate everything in case an earlier step went stale.
    const invalid = STEPS.findIndex(
      (s) => Object.keys(s.validate(draft)).length > 0
    )
    if (invalid !== -1) {
      setStep(invalid)
      setShowErrors(true)
      return
    }
    onLaunch({
      ...draft,
      name: draft.name.trim(),
      id: Date.now(),
      status: statusFor(draft),
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      leads: 0,
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-muted-foreground" />
          Create New Campaign
        </DialogTitle>
        <DialogDescription>
          Step {step + 1} of {STEPS.length} · {current.label}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3">
        <Progress value={((step + 1) / STEPS.length) * 100} />
        <ol className="grid grid-cols-5 gap-1">
          {STEPS.map((s, index) => (
            <li
              key={s.label}
              className="flex flex-col items-center gap-1 text-center"
              aria-current={index === step ? "step" : undefined}
            >
              <Badge
                variant={
                  index < step
                    ? "default"
                    : index === step
                      ? "secondary"
                      : "outline"
                }
                className="size-6 p-0"
              >
                {index < step ? <CheckIcon /> : index + 1}
              </Badge>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="-mx-4 min-h-0 flex-1 overflow-y-auto px-4 py-1">
        <div className="mb-5 flex flex-col gap-1">
          <h3 className="font-medium">{current.title}</h3>
          <p className="text-muted-foreground">{current.description}</p>
        </div>
        {step === 0 && (
          <BasicsFields draft={draft} onChange={update} errors={errors} />
        )}
        {step === 1 && (
          <AudienceFields draft={draft} onChange={update} errors={errors} />
        )}
        {step === 2 && (
          <MessageFields
            draft={draft}
            onChange={update}
            errors={errors}
            showTemplates
          />
        )}
        {step === 3 && (
          <ScheduleFields draft={draft} onChange={update} errors={errors} />
        )}
        {step === 4 && <CampaignReview draft={draft} onEditStep={goTo} />}
      </div>

      <DialogFooter className="flex-row justify-between sm:justify-between">
        <Button
          variant="outline"
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
        >
          <ChevronLeftIcon data-icon="inline-start" />
          Back
        </Button>
        <Button onClick={next}>
          {isLast ? (
            <>
              <SendIcon data-icon="inline-start" />
              Launch Campaign
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
