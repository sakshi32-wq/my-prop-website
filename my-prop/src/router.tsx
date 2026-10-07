import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import { createQueryClient } from "./api/query-client"

export function getRouter() {
  // One QueryClient per router, so the server never shares a cache between requests.
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
