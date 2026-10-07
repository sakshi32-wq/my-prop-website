import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import { PasswordInput } from "@/components/auth/password-input"
import { SocialAuth } from "@/components/auth/social-auth"
import {
  focusFirstInvalid,
  hasErrors,
  validateEmail,
  validatePassword,
} from "@/components/auth/validation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function validate(values: { email: string; password: string }) {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  }
}

export function LoginForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: "", password: "" })
  const [remember, setRemember] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const errors: Partial<ReturnType<typeof validate>> = submitted
    ? validate(values)
    : {}

  function update(field: keyof typeof values) {
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
    toast.success("Welcome back!", {
      description: remember ? "We'll keep you signed in." : undefined,
    })
    void navigate({ to: "/app" })
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={update("email")}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error">{errors.email}</FieldError>
        </Field>
        <Field data-invalid={!!errors.password || undefined}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              to="/forgot-password"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={update("password")}
            aria-invalid={!!errors.password || undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <FieldError id="password-error">{errors.password}</FieldError>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
          />
          <FieldLabel htmlFor="remember" className="font-normal">
            Remember me
          </FieldLabel>
        </Field>
        <Field>
          <Button type="submit">Sign in</Button>
        </Field>
        <SocialAuth />
      </FieldGroup>
    </form>
  )
}
