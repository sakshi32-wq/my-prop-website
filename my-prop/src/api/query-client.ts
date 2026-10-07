import { MutationCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ApiError } from "./fetcher"

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      /** Set to false when the component shows the error itself. */
      errorToast?: boolean
    }
  }
}

function isClientError(error: unknown) {
  return error instanceof ApiError && error.status >= 400 && error.status < 500
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // A 4xx won't succeed on retry; network and 5xx errors might.
        retry: (failureCount, error) =>
          !isClientError(error) && failureCount < 3,
      },
    },
    // Components only handle success; failed mutations toast here.
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        if (mutation.meta?.errorToast === false) return
        toast.error(error.message || "Something went wrong. Please try again.")
      },
    }),
  })
}
