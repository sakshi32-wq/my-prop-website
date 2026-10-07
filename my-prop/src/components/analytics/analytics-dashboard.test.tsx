import { HttpResponse, http } from "msw"
import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AnalyticsDashboard } from "./analytics-dashboard"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { renderWithClient } from "@/test/render"

describe("AnalyticsDashboard", () => {
  it("loads the report for the selected range from the API", async () => {
    const ranges: Array<string> = []
    server.events.on("request:start", ({ request }) => {
      const url = new URL(request.url)
      if (url.pathname.endsWith("/analytics/report"))
        ranges.push(
          `${url.searchParams.get("from")}..${url.searchParams.get("to")}`
        )
    })
    const { user } = renderWithClient(<AnalyticsDashboard />)

    expect(screen.getByLabelText("Loading analytics")).toBeInTheDocument()
    // 30-day reference numbers come from the mock server.
    expect((await screen.findAllByText("4,285"))[0]).toBeVisible()

    await user.click(screen.getByRole("combobox", { name: "Date range" }))
    await user.click(
      await screen.findByRole("option", { name: "Last 90 Days" })
    )
    expect(await screen.findByText(/over the last 90 days/)).toBeVisible()
    expect(ranges).toHaveLength(2)
    const [from, to] = ranges[1].split("..")
    expect((Date.parse(to) - Date.parse(from)) / (24 * 60 * 60 * 1000)).toBe(89)
  })

  it("shows an error with Retry when the report fails", async () => {
    server.use(
      http.get(
        apiPath("/analytics/report"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(<AnalyticsDashboard />)

    expect(await screen.findByText("Couldn't load analytics")).toBeVisible()
    expect(screen.getByRole("button", { name: /Export Report/ })).toBeDisabled()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect((await screen.findAllByText("4,285"))[0]).toBeVisible()
  })
})
