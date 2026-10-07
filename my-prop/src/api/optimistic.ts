// Building blocks for optimistic mutations on top of the generated hooks.
import type { QueryClient, QueryKey } from "@tanstack/react-query"

export type OptimisticContext = {
  /** Puts every patched query back the way it was before the mutation. */
  restore: () => void
}

/**
 * Patches every cached query under `queryKey` (a prefix, so one key covers a
 * list under any filters) and returns a context that can undo the patch.
 * Use it in onMutate.
 */
export async function patchQueries<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  patch: (data: TData) => TData
): Promise<OptimisticContext> {
  // Stop in-flight refetches from overwriting the optimistic data.
  await queryClient.cancelQueries({ queryKey })
  const snapshot = queryClient.getQueriesData<TData>({ queryKey })
  queryClient.setQueriesData<TData>({ queryKey }, (data) =>
    data === undefined ? data : patch(data)
  )
  return {
    restore: () => {
      for (const [key, data] of snapshot) queryClient.setQueryData(key, data)
    },
  }
}

/** onError handler that undoes a patchQueries() from onMutate. */
export function rollback(
  _error: unknown,
  _variables: unknown,
  context: OptimisticContext | undefined
) {
  context?.restore()
}
