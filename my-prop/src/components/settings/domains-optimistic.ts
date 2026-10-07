// Optimistic options for the generated domain mutations. Spread them into the
// hook's `mutation` options; the generated onSuccess then refetches.
import type { QueryClient } from "@tanstack/react-query"

import type { Domain } from "./domains-data"
import { getListDomainsQueryKey } from "@/api/generated/domains/domains"
import type { DeleteDomainMutationVariables } from "@/api/generated/domains/domains"
import { optimisticRemove } from "@/api/optimistic"

export function optimisticDomainDelete(queryClient: QueryClient) {
  return optimisticRemove<Domain, DeleteDomainMutationVariables>(
    queryClient,
    getListDomainsQueryKey(),
    ({ domainId }) => domainId
  )
}
