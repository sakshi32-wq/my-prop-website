import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { WebsiteBuilderPage } from "./website-builder-page"
import { DEMO_WEBSITES } from "@/components/websites/data"
import { db } from "@/mocks/db"
import { renderWithRouter } from "@/test/render"

const RIVERSIDE = DEMO_WEBSITES[3]

describe("WebsiteBuilderPage", () => {
  it("loads the website and its saved info", async () => {
    renderWithRouter(<WebsiteBuilderPage websiteId={RIVERSIDE.id} />)

    expect(
      await screen.findByLabelText("Loading website builder")
    ).toBeInTheDocument()
    expect(
      await screen.findByRole("heading", { name: "Riverside Residency" })
    ).toBeVisible()
    expect(screen.getByText(RIVERSIDE.domain)).toBeVisible()
    expect(screen.queryByText("Unsaved")).not.toBeInTheDocument()
  })

  it("saves the layout to the API, then publishes it", async () => {
    const { user } = renderWithRouter(
      <WebsiteBuilderPage websiteId={RIVERSIDE.id} />
    )
    await screen.findByRole("heading", { name: "Riverside Residency" })

    await user.click(screen.getByRole("button", { name: "Save" }))
    expect(await screen.findByText("Website saved")).toBeVisible()
    const saved = db.websiteContents.find(RIVERSIDE.id)
    expect(saved?.sections).toHaveLength(1)
    expect(saved?.savedAt).not.toBeNull()

    await user.click(screen.getByRole("button", { name: "Publish" }))
    expect(await screen.findByText("Website published")).toBeVisible()
    expect(db.websites.find(RIVERSIDE.id)?.status).toBe("live")
  })

  it("starts from the saved sections", async () => {
    db.websiteContents.update(RIVERSIDE.id, {
      sections: [
        {
          id: "saved-section",
          name: "Saved Contact Section",
          type: "contact",
          icon: "form",
          styles: {},
          elements: [],
        },
      ],
    })
    renderWithRouter(<WebsiteBuilderPage websiteId={RIVERSIDE.id} />)

    expect(
      (await screen.findAllByText("Saved Contact Section")).length
    ).toBeGreaterThan(0)
  })

  it("shows not found for an unknown website", async () => {
    renderWithRouter(
      <WebsiteBuilderPage websiteId="00000000-0000-4000-8000-000000000000" />
    )
    expect(await screen.findByText("Website not found")).toBeVisible()
  })
})
