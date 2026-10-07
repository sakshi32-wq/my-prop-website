// Optimistic options for the generated notification mutations. Spread them
// into the hook's `mutation` options; the generated onSuccess then refetches.
import type { QueryClient } from "@tanstack/react-query"

import type { Notification } from "./notifications-data"
import { getListNotificationsQueryKey } from "@/api/generated/notifications/notifications"
import type {
  DeleteNotificationMutationVariables,
  UpdateNotificationMutationVariables,
} from "@/api/generated/notifications/notifications"
import {
  optimisticPatch,
  optimisticRemove,
  patchQueries,
  rollback,
} from "@/api/optimistic"

export function optimisticNotificationUpdate(queryClient: QueryClient) {
  return optimisticPatch<Notification, UpdateNotificationMutationVariables>(
    queryClient,
    getListNotificationsQueryKey(),
    ({ notificationId, data }) => ({ id: notificationId, data })
  )
}

export function optimisticNotificationDelete(queryClient: QueryClient) {
  return optimisticRemove<Notification, DeleteNotificationMutationVariables>(
    queryClient,
    getListNotificationsQueryKey(),
    ({ notificationId }) => notificationId
  )
}

export function optimisticMarkAllRead(queryClient: QueryClient) {
  return {
    onMutate: () =>
      patchQueries<Array<Notification>>(
        queryClient,
        getListNotificationsQueryKey(),
        (notifications) => notifications.map((n) => ({ ...n, read: true }))
      ),
    onError: rollback,
  }
}
