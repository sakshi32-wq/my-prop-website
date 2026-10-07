// Optimistic options for the generated lead mutations. Spread them into the
// hook's `mutation` options; the generated onSuccess then refetches the lists.
import type { QueryClient } from "@tanstack/react-query"

import type { Lead } from "./data"
import { getListLeadsQueryKey } from "@/api/generated/leads/leads"
import type {
  DeleteLeadMutationVariables,
  UpdateLeadMutationVariables,
} from "@/api/generated/leads/leads"
import { patchQueries, rollback } from "@/api/optimistic"

export function optimisticLeadUpdate(queryClient: QueryClient) {
  return {
    onMutate: ({ leadId, data }: UpdateLeadMutationVariables) =>
      patchQueries<Array<Lead>>(queryClient, getListLeadsQueryKey(), (leads) =>
        leads.map((lead) => (lead.id === leadId ? { ...lead, ...data } : lead))
      ),
    onError: rollback,
  }
}

export function optimisticLeadDelete(queryClient: QueryClient) {
  return {
    onMutate: async ({ leadId }: DeleteLeadMutationVariables) => {
      // Keep the removed lead so onSuccess can still name it.
      const lead = queryClient
        .getQueriesData<Array<Lead>>({ queryKey: getListLeadsQueryKey() })
        .flatMap(([, leads]) => leads ?? [])
        .find((l) => l.id === leadId)
      const context = await patchQueries<Array<Lead>>(
        queryClient,
        getListLeadsQueryKey(),
        (leads) => leads.filter((l) => l.id !== leadId)
      )
      return { ...context, lead }
    },
    onError: rollback,
  }
}
