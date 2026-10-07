import { Link, createFileRoute } from "@tanstack/react-router"

import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"
import { PHOTOS } from "@/lib/mock-data"

export const Route = createFileRoute("/login")({ component: LoginPage })

function LoginPage() {
  return (
    <AuthLayout
      photo={PHOTOS.building}
      asideTitle="Welcome back to myprop.live"
      asideDescription="Continue building amazing real estate experiences with AI"
      title="Sign in to your account"
      description={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up for free
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
