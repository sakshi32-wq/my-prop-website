import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { BellIcon, CheckIcon, Trash2Icon } from "lucide-react"

import { NOTIFICATION_ICONS } from "./notifications-data"
import {
  optimisticMarkAllRead,
  optimisticNotificationDelete,
  optimisticNotificationUpdate,
} from "./notifications-optimistic"
import {
  useDeleteNotification,
  useListNotifications,
  useMarkAllNotificationsRead,
  useUpdateNotification,
} from "@/api/generated/notifications/notifications"
import { QueryError } from "@/components/query-error"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function NotificationsPopover() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const notificationsQuery = useListNotifications()
  const notifications = notificationsQuery.data ?? []
  const unreadCount = notifications.filter((n) => !n.read).length

  // Small, reversible actions: optimistic, without success toasts.
  const update = useUpdateNotification({
    mutation: optimisticNotificationUpdate(queryClient),
  })
  const markAll = useMarkAllNotificationsRead({
    mutation: optimisticMarkAllRead(queryClient),
  })
  const remove = useDeleteNotification({
    mutation: optimisticNotificationDelete(queryClient),
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] tabular-nums">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(420px,calc(100vw-2rem))] p-0"
      >
        <div className="flex items-center justify-between gap-2 p-4">
          <div>
            <p className="font-semibold">Notifications</p>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAll.mutate()}>
              <CheckIcon data-icon="inline-start" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        {notificationsQuery.isPending ? (
          <div
            className="flex flex-col gap-2 p-4"
            aria-busy="true"
            aria-label="Loading notifications"
          >
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : notificationsQuery.isError ? (
          <div className="p-4">
            <QueryError
              title="Couldn't load notifications"
              error={notificationsQuery.error}
              onRetry={() => void notificationsQuery.refetch()}
            />
          </div>
        ) : notifications.length === 0 ? (
          <Empty className="py-10">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BellIcon />
              </EmptyMedia>
              <EmptyTitle>No notifications</EmptyTitle>
              <EmptyDescription>
                You&apos;re all caught up! Check back later.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <ScrollArea className="h-[min(450px,60vh)]">
              <ItemGroup className="p-2">
                {notifications.map((n) => {
                  const Icon = NOTIFICATION_ICONS[n.type]
                  return (
                    <Item
                      key={n.id}
                      size="sm"
                      variant={n.read ? "default" : "muted"}
                    >
                      <ItemMedia variant="icon">
                        <Icon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          {n.title}
                          {!n.read && (
                            <span className="size-2 rounded-full bg-primary" />
                          )}
                        </ItemTitle>
                        <ItemDescription>{n.message}</ItemDescription>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(n.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </ItemContent>
                      <ItemActions>
                        {!n.read && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() =>
                              update.mutate({
                                notificationId: n.id,
                                data: { read: true },
                              })
                            }
                          >
                            <CheckIcon />
                            <span className="sr-only">Mark read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            remove.mutate({ notificationId: n.id })
                          }
                        >
                          <Trash2Icon />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </ItemActions>
                    </Item>
                  )
                })}
              </ItemGroup>
            </ScrollArea>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
