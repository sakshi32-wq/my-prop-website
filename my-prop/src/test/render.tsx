import { QueryClientProvider } from "@tanstack/react-query"
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router"
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

/**
 * renderWithClient inside a memory router, for components that use Link or
 * useNavigate. The component is the root route, so it stays mounted after
 * navigating; assert on `router.state.location` instead.
 */
export function renderWithRouter(ui: ReactElement) {
  const rootRoute = createRootRoute({
    component: () => ui,
    notFoundComponent: () => null,
  })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  })
  return { ...renderWithClient(<RouterProvider router={router} />), router }
}
