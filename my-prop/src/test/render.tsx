import { QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ReactElement } from "react"

import { createQueryClient } from "@/api/query-client"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

/** Renders with the app's providers and a fresh QueryClient (no retries). */
export function renderWithClient(ui: ReactElement) {
  const queryClient = createQueryClient()
  const defaults = queryClient.getDefaultOptions()
  queryClient.setDefaultOptions({
    ...defaults,
    queries: { ...defaults.queries, retry: false },
  })

  const user = userEvent.setup()
  const result = render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{ui}</TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  )
  return { ...result, user, queryClient }
}
