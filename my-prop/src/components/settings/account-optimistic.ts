// Optimistic options for the generated account mutations. Spread them into
// the hook's `mutation` options; the generated onSuccess then refetches.
import type { QueryClient } from "@tanstack/react-query"

import type { NotificationPreferences } from "./account-data"
import { getGetNotificationPreferencesQueryKey } from "@/api/generated/account/account"
import type { UpdateNotificationPreferencesMutationVariables } from "@/api/generated/account/account"
import { patchQueries, rollback } from "@/api/optimistic"

export function optimisticNotificationPreferences(queryClient: QueryClient) {
  return {
    onMutate: ({ data }: UpdateNotificationPreferencesMutationVariables) =>
      patchQueries<NotificationPreferences>(
        queryClient,
        getGetNotificationPreferencesQueryKey(),
        (preferences) => ({ ...preferences, ...data })
      ),
    onError: rollback,
  }
}
