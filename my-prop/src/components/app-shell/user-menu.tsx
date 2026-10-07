import { useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"
import { toast } from "sonner"

import { setAuthToken } from "@/api/fetcher"
import { useGetMe } from "@/api/generated/account/account"
import { useLogout } from "@/api/generated/auth/auth"
import { fullName } from "@/components/settings/account-data"
import { getInitials } from "@/components/settings/utils"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export function UserMenu() {
  const { data: me } = useGetMe()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // Sign out locally even if the server call fails.
  const logout = useLogout({
    mutation: {
      meta: { errorToast: false },
      onSettled: () => {
        setAuthToken(null)
        queryClient.removeQueries()
        toast.success("Signed out")
        void navigate({ to: "/login" })
      },
    },
  })
  const name = me ? fullName(me) : ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarFallback>{me ? getInitials(name) : ""}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Open user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {me ? (
            <>
              <p className="truncate">{name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {me.email}
              </p>
            </>
          ) : (
            <div className="flex flex-col gap-1.5" aria-label="Loading account">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/app/settings">
              <UserIcon />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/app/settings">
              <SettingsIcon />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={logout.isPending}
            onSelect={() => logout.mutate()}
          >
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
