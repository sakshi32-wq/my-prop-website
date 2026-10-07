import { Link, createFileRoute } from "@tanstack/react-router"

import { AuthLayout } from "@/components/auth/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"
import { PHOTOS } from "@/lib/mock-data"

export const Route = createFileRoute("/register")({ component: RegisterPage })

function RegisterPage() {
  return (
    <AuthLayout
      photo={PHOTOS.office}
      asideTitle="Start your journey with myprop.live"
      asideDescription="Join thousands of real estate professionals transforming their business with AI"
      title="Create your account"
      description={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}
