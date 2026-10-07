import { useState } from "react"
import { SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { EMAIL_RE } from "./utils"
import type { Profile as ProfileData } from "./account-data"
import { useGetMe, useUpdateMe } from "@/api/generated/account/account"
import { QueryError } from "@/components/query-error"
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

type Profile = Omit<ProfileData, "id">

type Errors = Partial<Record<keyof Profile, string>>

function validate(profile: Profile): Errors {
  const errors: Errors = {}
  if (!profile.firstName.trim()) errors.firstName = "First name is required."
  if (!profile.lastName.trim()) errors.lastName = "Last name is required."
  if (!profile.email.trim()) errors.email = "Email is required."
  else if (!EMAIL_RE.test(profile.email.trim()))
    errors.email = "Enter a valid email address."
  return errors
}

export function ProfileInfoCard() {
  const meQuery = useGetMe()

  if (meQuery.isSuccess) return <ProfileForm initial={meQuery.data} />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal details and contact information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {meQuery.isError ? (
          <QueryError
            title="Couldn't load your profile"
            error={meQuery.error}
            onRetry={() => void meQuery.refetch()}
          />
        ) : (
          <div
            className="flex flex-col gap-5"
            aria-busy="true"
            aria-label="Loading profile"
          >
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/** Mounted once the profile has loaded, so the form starts from it. */
function ProfileForm({ initial }: { initial: ProfileData }) {
  const [profile, setProfile] = useState<Profile>(() => ({
    firstName: initial.firstName,
    lastName: initial.lastName,
    email: initial.email,
    company: initial.company,
    phone: initial.phone,
  }))
  const [submitted, setSubmitted] = useState(false)
  const updateMe = useUpdateMe({
    mutation: {
      onSuccess: () =>
        toast.success("Profile updated", {
          description: "Your profile information has been saved.",
        }),
    },
  })
  const errors = submitted ? validate(profile) : {}

  function update(key: keyof Profile) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setProfile((prev) => ({ ...prev, [key]: event.target.value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(profile)).length > 0) {
      toast.error("Please fix the highlighted fields.")
      return
    }
    updateMe.mutate({ data: profile })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal details and contact information.
        </CardDescription>
      </CardHeader>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-(--card-spacing)"
      >
        <CardContent>
          <FieldGroup>
            <div className="grid gap-5 md:grid-cols-2">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  value={profile.firstName}
                  onChange={update("firstName")}
                  aria-invalid={!!errors.firstName}
                />
                <FieldError>{errors.firstName}</FieldError>
              </Field>
              <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  value={profile.lastName}
                  onChange={update("lastName")}
                  aria-invalid={!!errors.lastName}
                />
                <FieldError>{errors.lastName}</FieldError>
              </Field>
            </div>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={profile.email}
                onChange={update("email")}
                aria-invalid={!!errors.email}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="company">Company Name</FieldLabel>
              <Input
                id="company"
                autoComplete="organization"
                value={profile.company}
                onChange={update("company")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={profile.phone}
                onChange={update("phone")}
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updateMe.isPending}>
            {updateMe.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <SaveIcon data-icon="inline-start" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
