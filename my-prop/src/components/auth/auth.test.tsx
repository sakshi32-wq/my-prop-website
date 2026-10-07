import { screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ForgotPasswordForm } from "./forgot-password-form"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { setAuthToken } from "@/api/fetcher"
import { UserMenu } from "@/components/app-shell/user-menu"
import { DEMO_PROFILE } from "@/components/settings/account-data"
import { db } from "@/mocks/db"
import { renderWithRouter } from "@/test/render"

const token = () => localStorage.getItem("myprop.token")

describe("auth", () => {
  it("signs in, stores the token and opens the app", async () => {
    const { user, router } = renderWithRouter(<LoginForm />)

    await user.type(
      await screen.findByLabelText("Email address"),
      DEMO_PROFILE.email
    )
    await user.type(screen.getByLabelText("Password"), "anything")
    await user.click(screen.getByRole("button", { name: /Sign in/ }))

    expect(await screen.findByText("Welcome back, John!")).toBeVisible()
    expect(token()).toMatch(/^mock_/)
    expect(db.sessions.find(token()!)?.userId).toBe(DEMO_PROFILE.id)
    await waitFor(() => expect(router.state.location.pathname).toBe("/app"))
  })

  it("rejects an unknown email", async () => {
    const { user, router } = renderWithRouter(<LoginForm />)

    await user.type(
      await screen.findByLabelText("Email address"),
      "nobody@example.com"
    )
    await user.type(screen.getByLabelText("Password"), "anything")
    await user.click(screen.getByRole("button", { name: /Sign in/ }))

    expect(await screen.findByText("Invalid email or password.")).toBeVisible()
    expect(token()).toBeNull()
    expect(router.state.location.pathname).toBe("/")
  })

  it("registers a new account and signs in as it", async () => {
    const { user } = renderWithRouter(<RegisterForm />)

    await user.type(await screen.findByLabelText("First name"), "Asha")
    await user.type(screen.getByLabelText("Last name"), "Iyer")
    await user.type(screen.getByLabelText("Email address"), "asha@example.com")
    await user.type(screen.getByLabelText("Password"), "a-long-password")
    await user.click(screen.getByRole("checkbox"))
    await user.click(screen.getByRole("button", { name: /Create account/ }))

    expect(
      await screen.findByText("Welcome to myprop.live, Asha!")
    ).toBeVisible()
    const account = db.users.all().find((u) => u.email === "asha@example.com")
    expect(db.sessions.find(token()!)?.userId).toBe(account?.id)
  })

  it("sends a password reset link", async () => {
    const { user } = renderWithRouter(<ForgotPasswordForm />)

    await user.type(
      await screen.findByLabelText("Email address"),
      "x@example.com"
    )
    await user.click(screen.getByRole("button", { name: /Send reset link/ }))

    expect(await screen.findByText("Check your email")).toBeVisible()
  })

  it("shows the signed-in user and signs out", async () => {
    db.users.insert({
      ...DEMO_PROFILE,
      id: "8b9c0d1e-2f3a-4b5c-9d6e-7f8a9b0c1d2e",
      firstName: "Asha",
      email: "asha@example.com",
    })
    db.sessions.insert({
      id: "mock_test",
      userId: "8b9c0d1e-2f3a-4b5c-9d6e-7f8a9b0c1d2e",
    })
    setAuthToken("mock_test")
    const { user, router } = renderWithRouter(<UserMenu />)

    await user.click(
      await screen.findByRole("button", { name: /Open user menu/ })
    )
    expect(await screen.findByText("Asha Doe")).toBeVisible()
    await user.click(screen.getByRole("menuitem", { name: /Logout/ }))

    expect(await screen.findByText("Signed out")).toBeVisible()
    expect(token()).toBeNull()
    expect(db.sessions.find("mock_test")).toBeUndefined()
    await waitFor(() => expect(router.state.location.pathname).toBe("/login"))
  })
})
