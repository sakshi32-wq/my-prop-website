// Optimistic options for the generated campaign mutations. Spread them into
// the hook's `mutation` options; the generated onSuccess then refetches.
import type { QueryClient } from "@tanstack/react-query"

import type { Campaign } from "./campaign-data"
import { getListCampaignsQueryKey } from "@/api/generated/campaigns/campaigns"
import type {
  DeleteCampaignMutationVariables,
  UpdateCampaignMutationVariables,
} from "@/api/generated/campaigns/campaigns"
import { optimisticPatch, optimisticRemove } from "@/api/optimistic"

export function optimisticCampaignUpdate(queryClient: QueryClient) {
  return optimisticPatch<Campaign, UpdateCampaignMutationVariables>(
    queryClient,
    getListCampaignsQueryKey(),
    ({ campaignId, data }) => ({ id: campaignId, data })
  )
}

export function optimisticCampaignDelete(queryClient: QueryClient) {
  return optimisticRemove<Campaign, DeleteCampaignMutationVariables>(
    queryClient,
    getListCampaignsQueryKey(),
    ({ campaignId }) => campaignId
  )
}
