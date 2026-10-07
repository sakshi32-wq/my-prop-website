import { useState } from "react"
import {
  MinusIcon,
  PhoneCallIcon,
  PhoneIcon,
  PhoneOffIcon,
  SaveIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"
import { toast } from "sonner"

import { sourceLabel } from "./data"
import { LeadSummary } from "./lead-summary"
import { OptionSelect } from "./option-select"
import type { Lead } from "./data"
import { Badge } from "@/components/ui/badge"
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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type CallStatus = "not-started" | "in-progress" | "completed"

const OUTCOMES = [
  { value: "connected", label: "Connected - Discussed" },
  { value: "interested", label: "Interested - Will Visit" },
  { value: "callback", label: "Call Back Later" },
  { value: "not-interested", label: "Not Interested" },
  { value: "wrong-number", label: "Wrong Number" },
  { value: "no-answer", label: "No Answer" },
  { value: "voicemail", label: "Voicemail Left" },
]

const NEXT_ACTIONS = [
  { value: "schedule-visit", label: "Schedule Site Visit" },
  { value: "send-brochure", label: "Send Property Brochure" },
  { value: "follow-up", label: "Follow Up in 2-3 Days" },
  { value: "send-payment-plan", label: "Send Payment Plan" },
  { value: "escalate", label: "Escalate to Manager" },
  { value: "none", label: "No Action Required" },
]

const DURATIONS = [
  { value: "less-1min", label: "Less than 1 minute" },
  { value: "1-3min", label: "1-3 minutes" },
  { value: "3-5min", label: "3-5 minutes" },
  { value: "5-10min", label: "5-10 minutes" },
  { value: "10plus", label: "More than 10 minutes" },
]

function CallStatusControl({
  status,
  phone,
  onStart,
  onEnd,
}: {
  status: CallStatus
  phone: string
  onStart: () => void
  onEnd: () => void
}) {
  if (status === "not-started") {
    return (
      <Button asChild size="sm">
        <a href={`tel:${phone.replace(/\s/g, "")}`} onClick={onStart}>
          <PhoneIcon data-icon="inline-start" />
          Start Call
        </a>
      </Button>
    )
  }
  if (status === "in-progress") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="destructive">
          <PhoneCallIcon data-icon="inline-start" />
          In Progress
        </Badge>
        <Button variant="outline" size="sm" onClick={onEnd}>
          <PhoneOffIcon data-icon="inline-start" />
          End Call
        </Button>
      </div>
    )
  }
  return <Badge variant="secondary">Call Ended</Badge>
}

function CallLogForm({ lead, onSaved }: { lead: Lead; onSaved: () => void }) {
  const [status, setStatus] = useState<CallStatus>("not-started")
  const [outcome, setOutcome] = useState("")
  const [sentiment, setSentiment] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [outcomeError, setOutcomeError] = useState(false)

  const started = status !== "not-started"

  const handleSave = () => {
    if (!outcome) {
      setOutcomeError(true)
      return
    }
    const outcomeLabel = OUTCOMES.find((o) => o.value === outcome)?.label
    toast.success("Call log saved", {
      description: `${lead.name}: ${outcomeLabel}`,
    })
    onSaved()
  }

  const context = [
    { label: "Interested Project", value: lead.project || "—" },
    { label: "Budget Range", value: lead.budget || "—" },
    { label: "Lead Source", value: sourceLabel(lead.source) },
  ]

  return (
    <>
      <LeadSummary
        lead={lead}
        actions={
          <CallStatusControl
            status={status}
            phone={lead.phone}
            onStart={() => setStatus("in-progress")}
            onEnd={() => setStatus("completed")}
          />
        }
      />

      <dl className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3">
        {context.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col gap-1">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="truncate font-medium">{item.value}</dd>
          </div>
        ))}
        <div className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Tags</dt>
          <dd className="flex flex-wrap gap-1">
            {lead.tags.length > 0
              ? lead.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))
              : "—"}
          </dd>
        </div>
      </dl>

      {started && (
        <FieldGroup>
          <Field data-invalid={outcomeError}>
            <FieldLabel htmlFor="call-outcome">Call Outcome *</FieldLabel>
            <OptionSelect
              id="call-outcome"
              value={outcome}
              onChange={(v) => {
                setOutcome(v)
                setOutcomeError(false)
              }}
              placeholder="Select outcome"
              options={OUTCOMES}
              invalid={outcomeError}
            />
            {outcomeError && (
              <FieldError>Please select a call outcome.</FieldError>
            )}
          </Field>
          <Field>
            <FieldTitle id="call-sentiment">Lead Sentiment</FieldTitle>
            <ToggleGroup
              type="single"
              variant="outline"
              aria-labelledby="call-sentiment"
              className="w-full"
              value={sentiment}
              onValueChange={setSentiment}
            >
              <ToggleGroupItem value="positive" className="flex-1">
                <ThumbsUpIcon data-icon="inline-start" />
                Positive
              </ToggleGroupItem>
              <ToggleGroupItem value="neutral" className="flex-1">
                <MinusIcon data-icon="inline-start" />
                Neutral
              </ToggleGroupItem>
              <ToggleGroupItem value="negative" className="flex-1">
                <ThumbsDownIcon data-icon="inline-start" />
                Negative
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="call-next">Next Action</FieldLabel>
              <OptionSelect
                id="call-next"
                value={nextAction}
                onChange={setNextAction}
                placeholder="Select next step"
                options={NEXT_ACTIONS}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="call-duration">Call Duration</FieldLabel>
              <OptionSelect
                id="call-duration"
                value={duration}
                onChange={setDuration}
                placeholder="Select duration"
                options={DURATIONS}
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="call-notes">Call Notes</FieldLabel>
            <Textarea
              id="call-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add detailed notes about the conversation..."
              rows={4}
            />
          </Field>
        </FieldGroup>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        {started ? (
          <Button onClick={handleSave}>
            <SaveIcon data-icon="inline-start" />
            Save Call Log
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => setStatus("completed")}>
            Log a Past Call
          </Button>
        )}
      </DialogFooter>
    </>
  )
}

export function CallLeadDialog({
  open,
  onOpenChange,
  lead,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
}) {
  return (
    <Dialog open={open && !!lead} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Call Lead</DialogTitle>
          <DialogDescription>
            Make a call to {lead?.name ?? "this lead"} and log the details
          </DialogDescription>
        </DialogHeader>
        {lead && (
          <CallLogForm
            key={lead.id}
            lead={lead}
            onSaved={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
