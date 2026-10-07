import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { PasswordInput } from "@/components/auth/password-input"
import { SocialAuth } from "@/components/auth/social-auth"
import {
  focusFirstInvalid,
  hasErrors,
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/components/auth/validation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const MIN_PASSWORD = 8

type Values = {
  firstName: string
  lastName: string
  email: string
  company: string
  password: string
  terms: boolean
}

const INITIAL: Values = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  password: "",
  terms: false,
}

function validate(values: Values) {
  return {
    firstName: validateRequired(values.firstName, "First name"),
    lastName: validateRequired(values.lastName, "Last name"),
    email: validateEmail(values.email),
    password: validatePassword(values.password, MIN_PASSWORD),
    terms: values.terms
      ? undefined
      : "You must accept the Terms of Service and Privacy Policy.",
  }
}

function showPolicy(name: string) {
  return (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    toast(name, { description: "The full document will be available soon." })
  }
}

function TextField({
  id,
  label,
  error,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string
  label: string
  error?: string
}) {
  return (
    <Field data-invalid={!!error || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </Field>
  )
}

export function RegisterForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<Values>(INITIAL)
  const [submitted, setSubmitted] = useState(false)

  const errors: Partial<ReturnType<typeof validate>> = submitted
    ? validate(values)
    : {}

  function update(field: Exclude<keyof Values, "terms">) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: event.target.value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (hasErrors(validate(values))) {
      focusFirstInvalid(event.currentTarget)
      return
    }
    toast.success(`Welcome to myprop.live, ${values.firstName.trim()}!`, {
      description: "Your account has been created.",
    })
    void navigate({ to: "/app" })
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
          <TextField
            id="firstName"
            label="First name"
            autoComplete="given-name"
            placeholder="John"
            value={values.firstName}
            onChange={update("firstName")}
            error={errors.firstName}
          />
          <TextField
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            placeholder="Doe"
            value={values.lastName}
            onChange={update("lastName")}
            error={errors.lastName}
          />
        </div>
        <TextField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={update("email")}
          error={errors.email}
        />
        <TextField
          id="company"
          label="Company name"
          autoComplete="organization"
          placeholder="Your Real Estate Company"
          value={values.company}
          onChange={update("company")}
        />
        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.password}
            onChange={update("password")}
            aria-invalid={!!errors.password || undefined}
            aria-describedby={
              errors.password ? "password-error" : "password-hint"
            }
          />
          {errors.password ? (
            <FieldError id="password-error">{errors.password}</FieldError>
          ) : (
            <FieldDescription id="password-hint">
              Must be at least {MIN_PASSWORD} characters.
            </FieldDescription>
          )}
        </Field>
        <Field
          orientation="horizontal"
          data-invalid={!!errors.terms || undefined}
        >
          <Checkbox
            id="terms"
            checked={values.terms}
            onCheckedChange={(checked) =>
              setValues((prev) => ({ ...prev, terms: checked === true }))
            }
            aria-invalid={!!errors.terms || undefined}
            aria-describedby={errors.terms ? "terms-error" : undefined}
          />
          <FieldContent>
            <FieldLabel htmlFor="terms" className="inline font-normal">
              I agree to the{" "}
              <a
                href="#"
                onClick={showPolicy("Terms of Service")}
                className="font-medium underline underline-offset-4"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                onClick={showPolicy("Privacy Policy")}
                className="font-medium underline underline-offset-4"
              >
                Privacy Policy
              </a>
            </FieldLabel>
            <FieldError id="terms-error">{errors.terms}</FieldError>
          </FieldContent>
        </Field>
        <Field>
          <Button type="submit">Create account</Button>
        </Field>
        <SocialAuth />
      </FieldGroup>
    </form>
  )
}
