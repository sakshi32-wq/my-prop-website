// Optimistic options for the generated lead mutations. Spread them into the
// hook's `mutation` options; the generated onSuccess then refetches the lists.
import type { QueryClient } from "@tanstack/react-query"

import type { Lead } from "./data"
import { getListLeadsQueryKey } from "@/api/generated/leads/leads"
import type {
  DeleteLeadMutationVariables,
  UpdateLeadMutationVariables,
} from "@/api/generated/leads/leads"
import { optimisticPatch, optimisticRemove } from "@/api/optimistic"

export function optimisticLeadUpdate(queryClient: QueryClient) {
  return optimisticPatch<Lead, UpdateLeadMutationVariables>(
    queryClient,
    getListLeadsQueryKey(),
    ({ leadId, data }) => ({ id: leadId, data })
  )
}

export function optimisticLeadDelete(queryClient: QueryClient) {
  return optimisticRemove<Lead, DeleteLeadMutationVariables>(
    queryClient,
    getListLeadsQueryKey(),
    ({ leadId }) => leadId
  )
}
