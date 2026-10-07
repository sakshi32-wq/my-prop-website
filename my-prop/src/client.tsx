// Start's default client entry, plus the MSW worker. TanStack Start picks
// this file up automatically.
import { StrictMode, startTransition } from "react"
import { hydrateRoot } from "react-dom/client"
import { StartClient } from "@tanstack/react-start/client"

async function enableMocking() {
  if (import.meta.env.VITE_API_MOCKING === "false") return
  const { worker } = await import("./mocks/browser")
  await worker.start({ onUnhandledFrame: "bypass" })
}

// Start the worker before hydrating, so the first queries are intercepted.
void enableMocking().then(() => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>
    )
  })
})
