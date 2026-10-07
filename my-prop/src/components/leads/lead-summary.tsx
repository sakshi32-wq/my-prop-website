import type { ReactNode } from "react"

import { initials } from "./data"
import type { Lead } from "./data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

/** Compact "who is this about" row shown at the top of lead dialogs. */
export function LeadSummary({
  lead,
  description,
  actions,
}: {
  lead: Lead
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <Item variant="muted">
      <ItemMedia>
        <Avatar size="lg">
          <AvatarFallback>{initials(lead.name)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemTitle>{lead.name}</ItemTitle>
        <ItemDescription>{description ?? lead.phone}</ItemDescription>
      </ItemContent>
      {actions && <ItemActions>{actions}</ItemActions>}
    </Item>
  )
}
