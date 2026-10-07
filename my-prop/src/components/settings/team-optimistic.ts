// Optimistic options for the generated team mutations. Spread them into the
// hook's `mutation` options; the generated onSuccess then refetches.
import type { QueryClient } from "@tanstack/react-query"

import type { TeamMember } from "./team-data"
import { getListTeamMembersQueryKey } from "@/api/generated/team/team"
import type {
  RemoveTeamMemberMutationVariables,
  UpdateTeamMemberMutationVariables,
} from "@/api/generated/team/team"
import { optimisticPatch, optimisticRemove } from "@/api/optimistic"

export function optimisticTeamMemberUpdate(queryClient: QueryClient) {
  return optimisticPatch<TeamMember, UpdateTeamMemberMutationVariables>(
    queryClient,
    getListTeamMembersQueryKey(),
    ({ memberId, data }) => ({ id: memberId, data })
  )
}

export function optimisticTeamMemberRemove(queryClient: QueryClient) {
  return optimisticRemove<TeamMember, RemoveTeamMemberMutationVariables>(
    queryClient,
    getListTeamMembersQueryKey(),
    ({ memberId }) => memberId
  )
}
