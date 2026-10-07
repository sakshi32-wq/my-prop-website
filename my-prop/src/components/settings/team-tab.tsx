import { useState } from "react"
import { CheckIcon, PlusIcon, UsersIcon } from "lucide-react"
import { toast } from "sonner"

import { ConfirmAction } from "./confirm-action"
import { INVITABLE_ROLES, InviteMemberDialog } from "./invite-member-dialog"
import { getInitials } from "./utils"
import type { InvitableRole } from "./invite-member-dialog"
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

type Member = {
  id: string
  name: string
  email: string
  role: "Owner" | InvitableRole
  status: "active" | "invited"
}

const INITIAL_MEMBERS: Array<Member> = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Agent",
    status: "active",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa@example.com",
    role: "Agent",
    status: "active",
  },
]

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
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [inviteOpen, setInviteOpen] = useState(false)

  function invite({ email, role }: { email: string; role: InvitableRole }) {
    setMembers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: email.split("@")[0] ?? email,
        email,
        role,
        status: "invited",
      },
    ])
    toast.success("Invitation sent", {
      description: `${email} was invited as ${role}.`,
    })
  }

  function changeRole(member: Member, role: InvitableRole) {
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, role } : m))
    )
    toast.success(`${member.name} is now an ${role}`)
  }

  function remove(member: Member) {
    setMembers((prev) => prev.filter((m) => m.id !== member.id))
    toast.success(
      member.status === "invited"
        ? `Invitation for ${member.email} cancelled`
        : `${member.name} removed from the team`
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {members.length} {members.length === 1 ? "member" : "members"} in
            your workspace.
          </CardDescription>
          <CardAction>
            <Button onClick={() => setInviteOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Invite Member
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ItemGroup className="gap-3">
            {members.map((member) => (
              <Item key={member.id} variant="outline">
                <ItemMedia>
                  <Avatar size="lg">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
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
        onInvite={invite}
      />
    </div>
  )
}
