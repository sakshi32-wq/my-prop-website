import { HttpResponse, http } from "msw"
import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { KpiCards } from "./kpi-cards"
import { LeadsOverTimeChart } from "./leads-over-time-chart"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { renderWithClient } from "@/test/render"

describe("dashboard overview", () => {
  it("shows the API's numbers and formats the changes", async () => {
    db.dashboardOverview.update({
      conversionRate: { value: 30.25, changePct: -4 },
    })
    renderWithClient(
      <>
        <KpiCards />
        <LeadsOverTimeChart />
      </>
    )

    expect(screen.getByLabelText("Loading dashboard numbers")).toBeVisible()
    expect(await screen.findByText("2,847")).toBeVisible()
    expect(screen.getByText("30.3%")).toBeVisible()
    expect(screen.getByText("Down 4.0% this month")).toBeVisible()
    expect(screen.getByText("3 launching today")).toBeVisible()
    expect(screen.getByText("395 this week")).toBeVisible()
  })

  it("shows an error with Retry when the overview fails", async () => {
    server.use(
      http.get(
        apiPath("/analytics/overview"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<KpiCards />)

    expect(
      await screen.findByText("Couldn't load your dashboard numbers")
    ).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("2,847")).toBeVisible()
  })
})
