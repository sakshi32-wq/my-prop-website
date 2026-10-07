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

type Entity = { id: string }

/**
 * Optimistic options for an update that merges fields into one item of a
 * cached list. Spread the result into a generated mutation hook's options.
 */
export function optimisticPatch<TItem extends Entity, TVariables>(
  queryClient: QueryClient,
  listKey: QueryKey,
  toPatch: (variables: TVariables) => { id: string; data: Partial<TItem> }
) {
  return {
    onMutate: (variables: TVariables) => {
      const { id, data } = toPatch(variables)
      return patchQueries<Array<TItem>>(queryClient, listKey, (items) =>
        items.map((item) => (item.id === id ? { ...item, ...data } : item))
      )
    },
    onError: rollback,
  }
}

/**
 * Optimistic options for a delete that removes one item from a cached list.
 * The context keeps the removed item, so onSuccess can still name it.
 */
export function optimisticRemove<TItem extends Entity, TVariables>(
  queryClient: QueryClient,
  listKey: QueryKey,
  toId: (variables: TVariables) => string
) {
  return {
    onMutate: async (variables: TVariables) => {
      const id = toId(variables)
      const removed = queryClient
        .getQueriesData<Array<TItem>>({ queryKey: listKey })
        .flatMap(([, items]) => items ?? [])
        .find((item) => item.id === id)
      const context = await patchQueries<Array<TItem>>(
        queryClient,
        listKey,
        (items) => items.filter((item) => item.id !== id)
      )
      return { ...context, removed }
    },
    onError: rollback,
  }
}
