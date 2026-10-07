import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon, MailCheckIcon } from "lucide-react"
import { toast } from "sonner"

import { focusFirstInvalid, validateEmail } from "@/components/auth/validation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function BackToSignIn() {
  return (
    <Button variant="ghost" asChild>
      <Link to="/login">
        <ArrowLeftIcon data-icon="inline-start" />
        Back to sign in
      </Link>
    </Button>
  )
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const error = submitted ? validateEmail(email) : undefined

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (validateEmail(email)) {
      focusFirstInvalid(event.currentTarget)
      return
    }
    const address = email.trim()
    setSentTo(address)
    toast.success("Reset link sent", { description: `Sent to ${address}` })
  }

  function reset() {
    setSentTo(null)
    setSubmitted(false)
  }

  if (sentTo) {
    return (
      <div className="flex flex-col gap-6">
        <Alert>
          <MailCheckIcon />
          <AlertTitle>Check your email</AlertTitle>
          <AlertDescription>
            <p>
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-foreground">{sentTo}</span>. The
              link expires in 30 minutes.
            </p>
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={reset}>
            Use a different email
          </Button>
          <BackToSignIn />
        </div>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={!!error || undefined}>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? "email-error" : undefined}
          />
          <FieldError id="email-error">{error}</FieldError>
        </Field>
        <Field>
          <Button type="submit">Send reset link</Button>
          <BackToSignIn />
        </Field>
      </FieldGroup>
    </form>
  )
}
