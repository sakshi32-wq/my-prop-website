// Optimistic options for the generated API key mutations. Spread them into
// the hook's `mutation` options; the generated onSuccess then refetches.
import type { QueryClient } from "@tanstack/react-query"

import type { ApiKey } from "./api-keys-data"
import { getListApiKeysQueryKey } from "@/api/generated/api-keys/api-keys"
import type { RevokeApiKeyMutationVariables } from "@/api/generated/api-keys/api-keys"
import { optimisticRemove } from "@/api/optimistic"

export function optimisticApiKeyRevoke(queryClient: QueryClient) {
  return optimisticRemove<ApiKey, RevokeApiKeyMutationVariables>(
    queryClient,
    getListApiKeysQueryKey(),
    ({ apiKeyId }) => apiKeyId
  )
}
