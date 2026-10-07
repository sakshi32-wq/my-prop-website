// Optimistic options for the generated AI history mutations. Spread them into
// the hook's `mutation` options; the generated onSuccess then refetches.
import type { QueryClient } from "@tanstack/react-query"

import type { Generation } from "./data"
import { getListGenerationsQueryKey } from "@/api/generated/ai/ai"
import type { DeleteGenerationMutationVariables } from "@/api/generated/ai/ai"
import { optimisticRemove } from "@/api/optimistic"

export function optimisticGenerationDelete(queryClient: QueryClient) {
  return optimisticRemove<Generation, DeleteGenerationMutationVariables>(
    queryClient,
    getListGenerationsQueryKey(),
    ({ generationId }) => generationId
  )
}
