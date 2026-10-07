import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const EMPTY = { current: "", next: "", confirm: "" }

type Passwords = typeof EMPTY
type Errors = Partial<Record<keyof Passwords, string>>

function validate(values: Passwords): Errors {
  const errors: Errors = {}
  if (!values.current) errors.current = "Enter your current password."
  if (values.next.length < 8)
    errors.next = "New password must be at least 8 characters."
  else if (values.next === values.current)
    errors.next = "New password must be different from the current one."
  if (!values.confirm) errors.confirm = "Confirm your new password."
  else if (values.confirm !== values.next)
    errors.confirm = "Passwords do not match."
  return errors
}

export function SecurityCard() {
  const [values, setValues] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validate(values) : {}

  function update(key: keyof Passwords) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length > 0) return
    toast.success("Password updated", {
      description: "Use your new password the next time you sign in.",
    })
    setValues(EMPTY)
    setSubmitted(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Change the password for your account.</CardDescription>
      </CardHeader>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-(--card-spacing)"
      >
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.current}>
              <FieldLabel htmlFor="currentPassword">
                Current Password
              </FieldLabel>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={values.current}
                onChange={update("current")}
                aria-invalid={!!errors.current}
              />
              <FieldError>{errors.current}</FieldError>
            </Field>
            <Field data-invalid={!!errors.next}>
              <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={values.next}
                onChange={update("next")}
                aria-invalid={!!errors.next}
              />
              {errors.next ? (
                <FieldError>{errors.next}</FieldError>
              ) : (
                <FieldDescription>At least 8 characters.</FieldDescription>
              )}
            </Field>
            <Field data-invalid={!!errors.confirm}>
              <FieldLabel htmlFor="confirmPassword">
                Confirm New Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={values.confirm}
                onChange={update("confirm")}
                aria-invalid={!!errors.confirm}
              />
              <FieldError>{errors.confirm}</FieldError>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="outline">
            Update Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
