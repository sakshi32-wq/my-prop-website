import { SearchIcon } from "lucide-react"

import { NotificationsPopover } from "@/components/app-shell/notifications-popover"
import { UserMenu } from "@/components/app-shell/user-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <InputGroup className="max-w-lg">
        <InputGroupInput type="search" placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <div className="ml-auto flex items-center gap-1">
        <NotificationsPopover />
        <UserMenu />
      </div>
    </header>
  )
}
