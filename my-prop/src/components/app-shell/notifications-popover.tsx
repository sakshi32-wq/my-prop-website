import { useState } from "react"
import {
  BellIcon,
  CheckIcon,
  CircleAlertIcon,
  GlobeIcon,
  MessageSquareIcon,
  SendIcon,
  Trash2Icon,
  TrendingUpIcon,
  UserPlusIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

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

type Notification = {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  icon: LucideIcon
}

const initialNotifications: Array<Notification> = [
  {
    id: 1,
    title: "New Lead Captured",
    message: "Rahul Sharma submitted an inquiry for Skyline Heights",
    time: "2 min ago",
    read: false,
    icon: UserPlusIcon,
  },
  {
    id: 2,
    title: "Campaign Launched",
    message: "Your WhatsApp campaign 'Marina Bay Launch' is now live",
    time: "15 min ago",
    read: false,
    icon: SendIcon,
  },
  {
    id: 3,
    title: "Website Published",
    message: "Green Valley Residency website is now live",
    time: "1 hour ago",
    read: false,
    icon: GlobeIcon,
  },
  {
    id: 4,
    title: "Low Response Rate",
    message: "Your Ocean View campaign has below average engagement",
    time: "2 hours ago",
    read: true,
    icon: CircleAlertIcon,
  },
  {
    id: 5,
    title: "Message Received",
    message: "You have 3 new WhatsApp messages from leads",
    time: "3 hours ago",
    read: true,
    icon: MessageSquareIcon,
  },
  {
    id: 6,
    title: "Conversion Milestone",
    message: "Congratulations! You've reached 100 conversions this month",
    time: "5 hours ago",
    read: true,
    icon: TrendingUpIcon,
  },
]

export function NotificationsPopover() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  const remove = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id))

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
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckIcon data-icon="inline-start" />
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        {notifications.length === 0 ? (
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
                {notifications.map((n) => (
                  <Item
                    key={n.id}
                    size="sm"
                    variant={n.read ? "default" : "muted"}
                  >
                    <ItemMedia variant="icon">
                      <n.icon />
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
                        {n.time}
                      </span>
                    </ItemContent>
                    <ItemActions>
                      {!n.read && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => markAsRead(n.id)}
                        >
                          <CheckIcon />
                          <span className="sr-only">Mark read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => remove(n.id)}
                      >
                        <Trash2Icon />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
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
