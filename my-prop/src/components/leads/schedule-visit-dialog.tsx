import { useState } from "react"
import { format, startOfToday } from "date-fns"
import { CalendarIcon, CheckIcon, MapPinIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { SALES_REPS, VISIT_REMINDERS } from "./data"
import { LeadSummary } from "./lead-summary"
import { OptionSelect } from "./option-select"
import type { Lead, SiteVisitInput } from "./data"
import { useScheduleSiteVisit } from "@/api/generated/leads/leads"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { PROJECTS } from "@/lib/mock-data"

const CHECKLIST = [
  "Confirm availability with the lead 1 day before",
  "Prepare property brochures and pricing details",
  "Share location and directions via WhatsApp",
  "Arrange for site manager to be present",
]

type Errors = Partial<Record<"date" | "time" | "project", string>>

function VisitForm({
  lead,
  pending,
  onSchedule,
}: {
  lead: Lead
  pending: boolean
  onSchedule: (visit: SiteVisitInput) => void
}) {
  const [date, setDate] = useState<Date | undefined>()
  const [dateOpen, setDateOpen] = useState(false)
  const [time, setTime] = useState("")
  const [project, setProject] = useState<string>(
    (PROJECTS as ReadonlyArray<string>).includes(lead.project)
      ? lead.project
      : ""
  )
  const [assignedTo, setAssignedTo] = useState("")
  const [reminder, setReminder] = useState("1hour")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Errors>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!date) next.date = "Pick a visit date."
    if (!time) next.time = "Pick a visit time."
    if (!project) next.project = "Select a project."
    setErrors(next)
    if (!date || !time || !project) return
    onSchedule({
      date: format(date, "yyyy-MM-dd"),
      time,
      project,
      assignedTo: assignedTo || undefined,
      reminder,
      notes: notes.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <LeadSummary lead={lead} />
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.date}>
            <FieldLabel htmlFor="visit-date">Visit Date *</FieldLabel>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="visit-date"
                  type="button"
                  variant="outline"
                  className="w-full justify-start font-normal"
                  aria-invalid={!!errors.date}
                >
                  <CalendarIcon data-icon="inline-start" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d)
                    setDateOpen(false)
                    setErrors((prev) => ({ ...prev, date: undefined }))
                  }}
                  disabled={{ before: startOfToday() }}
                />
              </PopoverContent>
            </Popover>
            <FieldError>{errors.date}</FieldError>
          </Field>
          <Field data-invalid={!!errors.time}>
            <FieldLabel htmlFor="visit-time">Visit Time *</FieldLabel>
            <Input
              id="visit-time"
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value)
                setErrors((prev) => ({ ...prev, time: undefined }))
              }}
              aria-invalid={!!errors.time}
            />
            <FieldError>{errors.time}</FieldError>
          </Field>
        </div>
        <Field data-invalid={!!errors.project}>
          <FieldLabel htmlFor="visit-project">Property/Project *</FieldLabel>
          <OptionSelect
            id="visit-project"
            value={project}
            onChange={(v) => {
              setProject(v)
              setErrors((prev) => ({ ...prev, project: undefined }))
            }}
            placeholder="Select project"
            options={PROJECTS}
            invalid={!!errors.project}
          />
          <FieldError>{errors.project}</FieldError>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="visit-rep">Assign To Sales Rep</FieldLabel>
            <OptionSelect
              id="visit-rep"
              value={assignedTo}
              onChange={setAssignedTo}
              placeholder="Select team member"
              options={SALES_REPS}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="visit-reminder">Send Reminder</FieldLabel>
            <OptionSelect
              id="visit-reminder"
              value={reminder}
              onChange={setReminder}
              options={VISIT_REMINDERS}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="visit-notes">Additional Notes</FieldLabel>
          <Textarea
            id="visit-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special instructions or requirements..."
            rows={3}
          />
        </Field>
      </FieldGroup>

      <Alert>
        <MapPinIcon />
        <AlertTitle>Visit Preparation Checklist</AlertTitle>
        <AlertDescription>
          <ul className="flex flex-col gap-1.5">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <SaveIcon data-icon="inline-start" />
          )}
          Schedule Visit
        </Button>
      </DialogFooter>
    </form>
  )
}

export function ScheduleVisitDialog({
  open,
  onOpenChange,
  lead,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
}) {
  // The server also moves early-stage leads to "Site Visit Scheduled".
  const scheduleVisit = useScheduleSiteVisit({
    mutation: {
      onSuccess: (activity) => {
        toast.success("Site visit scheduled", {
          description: activity.description,
        })
        onOpenChange(false)
      },
    },
  })

  return (
    <Dialog open={open && !!lead} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule Site Visit</DialogTitle>
          <DialogDescription>
            Schedule a property tour for {lead?.name ?? "this lead"}
          </DialogDescription>
        </DialogHeader>
        {lead && (
          <VisitForm
            key={lead.id}
            lead={lead}
            pending={scheduleVisit.isPending}
            onSchedule={(data) =>
              scheduleVisit.mutate({ leadId: lead.id, data })
            }
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
