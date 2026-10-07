import { createFileRoute } from "@tanstack/react-router"

import { AuthLayout } from "@/components/auth/auth-layout"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { PHOTOS } from "@/lib/mock-data"

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
    <AuthLayout
      photo={PHOTOS.tower}
      asideTitle="Need help accessing your account?"
      asideDescription="We'll send you a link to reset your password"
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
