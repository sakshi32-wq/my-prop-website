import { HttpResponse, http } from "msw"
import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DEMO_WEBSITES } from "./data"
import { demoLighthouseReport } from "./lighthouse/data"
import { LighthouseReportDialog } from "./lighthouse-report-dialog"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithClient } from "@/test/render"

const SITE = DEMO_WEBSITES[0]
const dialog = (
  <LighthouseReportDialog open onOpenChange={() => {}} website={SITE} />
)

describe("LighthouseReportDialog", () => {
  it("offers to run an audit when there's no report yet", async () => {
    renderWithClient(dialog)
    expect(await screen.findByText("Run Lighthouse Analysis")).toBeVisible()
  })

  it("runs an audit and shows the report", async () => {
    const request = gate()
    server.use(
      http.post(apiPath("/websites/:websiteId/lighthouse"), request.resolver)
    )
    const { user } = renderWithClient(dialog)

    await user.click(
      await screen.findByRole("button", { name: /Generate Report/ })
    )
    expect(screen.getByText("Generating Report...")).toBeVisible()

    request.release()
    expect(await screen.findByText("Lighthouse report ready")).toBeVisible()
    expect(await screen.findByLabelText("SEO score")).toBeInTheDocument()
    expect(screen.getByText("Reduce unused JavaScript")).toBeVisible()
    expect(db.lighthouseReports.all()).toHaveLength(1)
  })

  it("shows the latest saved report straight away", async () => {
    db.lighthouseReports.insert({
      ...demoLighthouseReport(SITE.id),
      scores: {
        performance: 41,
        accessibility: 88,
        bestPractices: 95,
        seo: 100,
      },
    })
    renderWithClient(dialog)

    expect(await screen.findByText("41")).toBeVisible()
    expect(screen.getByText("Poor")).toBeVisible()
  })

  it("shows an error with Retry when loading fails", async () => {
    server.use(
      http.get(
        apiPath("/websites/:websiteId/lighthouse"),
        () => HttpResponse.json({ message: "Server down." }, { status: 500 }),
        { once: true }
      )
    )
    const { user } = renderWithClient(dialog)

    expect(
      await screen.findByText("Couldn't load the last report")
    ).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Retry" }))
    expect(await screen.findByText("Run Lighthouse Analysis")).toBeVisible()
  })
})
