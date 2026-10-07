import { useState } from "react"
import { InfoIcon, MailIcon, SendIcon } from "lucide-react"

import { EMAIL_RE } from "./utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type InvitableRole = "Admin" | "Agent"

export const INVITABLE_ROLES: Array<{
  value: InvitableRole
  description: string
  permissions: Array<string>
}> = [
  {
    value: "Admin",
    description: "Full access except billing",
    permissions: [
      "Manage all websites and leads",
      "Create and manage campaigns",
      "Invite team members",
      "Use AI tools",
    ],
  },
  {
    value: "Agent",
    description: "Can manage leads and view analytics",
    permissions: [
      "View and respond to leads",
      "View analytics dashboard",
      "Use AI tools",
    ],
  },
]

export function InviteMemberDialog({
  open,
  onOpenChange,
  existingEmails,
  onInvite,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingEmails: Array<string>
  onInvite: (invite: { email: string; role: InvitableRole }) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        {/* Remounts on every open, so the form always starts empty. */}
        <InviteForm
          existingEmails={existingEmails}
          onSubmit={(invite) => {
            onInvite(invite)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function InviteForm({
  existingEmails,
  onSubmit,
}: {
  existingEmails: Array<string>
  onSubmit: (invite: { email: string; role: InvitableRole }) => void
}) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<InvitableRole>("Agent")
  const [submitted, setSubmitted] = useState(false)

  const normalized = email.trim().toLowerCase()
  const validationError = !normalized
    ? "Email address is required."
    : !EMAIL_RE.test(normalized)
      ? "Enter a valid email address."
      : existingEmails.includes(normalized)
        ? "This person is already on your team."
        : undefined
  const emailError = submitted ? validationError : undefined
  const selectedRole = INVITABLE_ROLES.find((r) => r.value === role)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (validationError) return
    onSubmit({ email: normalized, role })
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="contents">
      <DialogHeader>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogDescription>
          Send an invitation to join your team. They will receive an email with
          instructions to get started.
        </DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field data-invalid={!!emailError}>
          <FieldLabel htmlFor="inviteEmail">Email Address</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="inviteEmail"
              type="email"
              autoComplete="off"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
            />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>
          {emailError ? (
            <FieldError>{emailError}</FieldError>
          ) : (
            <FieldDescription>
              They will receive an invitation link via email
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="inviteRole">Role</FieldLabel>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as InvitableRole)}
          >
            <SelectTrigger id="inviteRole" className="w-full">
              <SelectValue>{role}</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {INVITABLE_ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{r.value}</span>
                      <span className="text-xs text-muted-foreground">
                        {r.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Alert>
          <InfoIcon />
          <AlertTitle>Permissions for {role}</AlertTitle>
          <AlertDescription>
            <ul className="flex list-disc flex-col gap-1 pl-4">
              {selectedRole?.permissions.map((permission) => (
                <li key={permission}>{permission}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">
          <SendIcon data-icon="inline-start" />
          Send Invitation
        </Button>
      </DialogFooter>
    </form>
  )
}
