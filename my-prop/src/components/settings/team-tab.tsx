import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { CheckIcon, PlusIcon, UsersIcon } from "lucide-react"
import { toast } from "sonner"

import { ConfirmAction } from "./confirm-action"
import { INVITABLE_ROLES, InviteMemberDialog } from "./invite-member-dialog"
import {
  optimisticTeamMemberRemove,
  optimisticTeamMemberUpdate,
} from "./team-optimistic"
import { getInitials } from "./utils"
import type { InvitableRole, TeamMember } from "./team-data"
import {
  useListTeamMembers,
  useRemoveTeamMember,
  useUpdateTeamMember,
} from "@/api/generated/team/team"
import { QueryError } from "@/components/query-error"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const ROLE_PERMISSIONS = [
  {
    role: "Owner",
    permissions: [
      "Full access to all features",
      "Manage billing",
      "Delete account",
    ],
  },
  {
    role: "Admin",
    permissions: [
      "Manage websites",
      "Manage leads",
      "Manage campaigns",
      "Invite team members",
    ],
  },
  {
    role: "Agent",
    permissions: [
      "View and respond to leads",
      "View analytics",
      "Use AI tools",
    ],
  },
]

export function TeamTab() {
  const queryClient = useQueryClient()
  const membersQuery = useListTeamMembers()
  const members = membersQuery.data ?? []
  const [inviteOpen, setInviteOpen] = useState(false)

  const updateMember = useUpdateTeamMember({
    mutation: {
      ...optimisticTeamMemberUpdate(queryClient),
      onSuccess: (member) =>
        toast.success(`${member.name} is now an ${member.role}`),
    },
  })
  const removeMember = useRemoveTeamMember({
    mutation: {
      ...optimisticTeamMemberRemove(queryClient),
      onSuccess: (_data, _variables, { removed }) =>
        toast.success(
          removed?.status === "invited"
            ? `Invitation for ${removed.email} cancelled`
            : `${removed?.name ?? "Member"} removed from the team`
        ),
    },
  })

  function changeRole(member: TeamMember, role: InvitableRole) {
    updateMember.mutate({ memberId: member.id, data: { role } })
  }

  function remove(member: TeamMember) {
    removeMember.mutate({ memberId: member.id })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {membersQuery.isSuccess
              ? `${members.length} ${members.length === 1 ? "member" : "members"} in your workspace.`
              : "People with access to your workspace."}
          </CardDescription>
          <CardAction>
            <Button onClick={() => setInviteOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Invite Member
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {membersQuery.isPending ? (
            <ItemGroup
              className="gap-3"
              aria-busy="true"
              aria-label="Loading team members"
            >
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-18 w-full rounded-lg" />
              ))}
            </ItemGroup>
          ) : membersQuery.isError ? (
            <QueryError
              title="Couldn't load team members"
              error={membersQuery.error}
              onRetry={() => void membersQuery.refetch()}
            />
          ) : (
            <ItemGroup className="gap-3">
              {members.map((member) => (
                <Item key={member.id} variant="outline">
                  <ItemMedia>
                    <Avatar size="lg">
                      <AvatarFallback>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent className="min-w-44">
                    <div className="flex flex-wrap items-center gap-2">
                      <ItemTitle>{member.name}</ItemTitle>
                      {member.status === "invited" && (
                        <Badge variant="outline">Invited</Badge>
                      )}
                    </div>
                    <ItemDescription className="break-all">
                      {member.email}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="ml-auto">
                    {member.role === "Owner" ? (
                      <Badge variant="secondary">Owner</Badge>
                    ) : (
                      <>
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            changeRole(member, value as InvitableRole)
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            aria-label={`Role for ${member.name}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent position="popper" align="end">
                            <SelectGroup>
                              {INVITABLE_ROLES.map((r) => (
                                <SelectItem key={r.value} value={r.value}>
                                  {r.value}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <ConfirmAction
                          title={
                            member.status === "invited"
                              ? `Cancel invitation for ${member.email}?`
                              : `Remove ${member.name}?`
                          }
                          description={
                            member.status === "invited"
                              ? "The invitation link will stop working."
                              : `${member.name} will immediately lose access to your workspace.`
                          }
                          confirmLabel={
                            member.status === "invited"
                              ? "Cancel Invitation"
                              : "Remove"
                          }
                          cancelLabel="Keep"
                          onConfirm={() => remove(member)}
                          trigger={
                            <Button variant="ghost" size="sm">
                              Remove
                            </Button>
                          }
                        />
                      </>
                    )}
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>
            What each role can do in your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {ROLE_PERMISSIONS.map((item) => (
              <Item key={item.role} variant="muted" className="items-start">
                <ItemContent>
                  <ItemTitle>{item.role}</ItemTitle>
                  <ul className="flex flex-col gap-1.5 text-muted-foreground">
                    {item.permissions.map((permission) => (
                      <li key={permission} className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </ItemContent>
              </Item>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Item className="p-0">
            <ItemMedia variant="icon">
              <UsersIcon />
            </ItemMedia>
            <ItemContent className="min-w-44">
              <ItemTitle>Invite a new team member</ItemTitle>
              <ItemDescription>
                Enter their email and select a role
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInviteOpen(true)}
              >
                Invite
              </Button>
            </ItemActions>
          </Item>
        </CardContent>
      </Card>

      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        existingEmails={members.map((m) => m.email)}
      />
    </div>
  )
}
