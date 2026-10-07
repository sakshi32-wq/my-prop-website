import { HttpResponse, http } from "msw"
import { screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AiStudio } from "./ai-studio"
import { DEMO_GENERATIONS } from "./data"
import { db } from "@/mocks/db"
import { server } from "@/mocks/node"
import { apiPath } from "@/mocks/utils"
import { gate } from "@/test/msw"
import { renderWithRouter } from "@/test/render"

async function fillProject(user: ReturnType<typeof renderWithRouter>["user"]) {
  await user.type(await screen.findByLabelText(/Project Name/), "Lakeside")
  await user.type(screen.getByLabelText(/Location/), "Pune")
}

describe("AiStudio", () => {
  it("lists recent generations from the API", async () => {
    renderWithRouter(<AiStudio />)
    expect(await screen.findByText(DEMO_GENERATIONS[0].title)).toBeVisible()
  })

  it("generates copy on the server and saves it as a draft", async () => {
    const request = gate()
    server.use(http.post(apiPath("/ai/generate"), request.resolver))
    const { user } = renderWithRouter(<AiStudio />)
    await fillProject(user)

    await user.click(screen.getByRole("button", { name: /Generate Content/ }))
    expect(screen.getByText("Generating content...")).toBeVisible()
    request.release()
    expect(await screen.findByText("Welcome to Lakeside")).toBeVisible()

    await user.click(screen.getByRole("button", { name: /Save to Drafts/ }))
    expect(await screen.findByText("Saved to drafts")).toBeVisible()
    expect(await screen.findByText("Property Copy - Lakeside")).toBeVisible()
    expect(db.generations.all()[0]).toMatchObject({
      title: "Property Copy - Lakeside",
      status: "draft",
    })
  })

  it("deletes a generation from the history", async () => {
    const { user } = renderWithRouter(<AiStudio />)
    await screen.findByText(DEMO_GENERATIONS[0].title)

    await user.click(
      screen.getByRole("button", { name: "Open generation history" })
    )
    const history = await screen.findByRole("dialog")
    await user.click(
      within(history).getAllByRole("button", { name: /Delete/ })[0]
    )
    await user.click(
      within(await screen.findByRole("alertdialog")).getByRole("button", {
        name: "Delete",
      })
    )

    expect(await screen.findByText("Generation deleted")).toBeVisible()
    await waitFor(() =>
      expect(db.generations.find(DEMO_GENERATIONS[0].id)).toBeUndefined()
    )
  })

  it("shows the server's error when generation fails", async () => {
    server.use(
      http.post(apiPath("/ai/generate"), () =>
        HttpResponse.json({ message: "Model is busy." }, { status: 503 })
      )
    )
    const { user } = renderWithRouter(<AiStudio />)
    await fillProject(user)
    await user.click(screen.getByRole("button", { name: /Generate Content/ }))

    expect(await screen.findByText("Model is busy.")).toBeVisible()
  })

  it("designs a page from a chat prompt", async () => {
    const { user } = renderWithRouter(<AiStudio />)
    await user.click(await screen.findByLabelText(/AI Web Page Designer/))

    await user.type(
      screen.getByLabelText("Describe what you want to create or change"),
      "A landing page for Lakeside"
    )
    await user.click(screen.getByRole("button", { name: "Send" }))

    expect(await screen.findByText(/I've created that for you/)).toBeVisible()
  })
})
