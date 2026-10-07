// Optimistic options for the generated integration mutations. Spread them
// into the hook's `mutation` options; the generated onSuccess then refetches.
import type { QueryClient } from "@tanstack/react-query"

import type { Integration } from "./integrations-data"
import { getListIntegrationsQueryKey } from "@/api/generated/integrations/integrations"
import type { DisconnectIntegrationMutationVariables } from "@/api/generated/integrations/integrations"
import { optimisticPatch } from "@/api/optimistic"

export function optimisticIntegrationDisconnect(queryClient: QueryClient) {
  return optimisticPatch<Integration, DisconnectIntegrationMutationVariables>(
    queryClient,
    getListIntegrationsQueryKey(),
    ({ integrationId }) => ({
      id: integrationId,
      data: { connected: false, connectedAt: null },
    })
  )
}
