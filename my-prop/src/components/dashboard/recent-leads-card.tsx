import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowRightIcon, MessageSquareIcon, UserPlusIcon } from "lucide-react"
import { toast } from "sonner"

import { useListLeads } from "@/api/generated/leads/leads"
import { AddLeadDialog } from "@/components/leads/add-lead-dialog"
import { initials, sourceLabel } from "@/components/leads/data"
import { QueryError } from "@/components/query-error"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const RECENT_LEADS_PARAMS = { limit: 5 }

export function RecentLeadsCard({ className }: { className?: string }) {
  const leadsQuery = useListLeads(RECENT_LEADS_PARAMS)
  const [addOpen, setAddOpen] = useState(false)

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Leads</CardTitle>
        <CardDescription>
          The latest enquiries from your websites
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
            <UserPlusIcon data-icon="inline-start" />
            Add Lead
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        {leadsQuery.isPending ? (
          <ItemGroup className="gap-2" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </ItemGroup>
        ) : leadsQuery.isError ? (
          <QueryError
            title="Couldn't load recent leads"
            error={leadsQuery.error}
            onRetry={() => void leadsQuery.refetch()}
          />
        ) : (
          <ItemGroup className="gap-2">
            {leadsQuery.data.map((lead) => (
              <Item key={lead.id} variant="outline" role="listitem">
                <ItemMedia>
                  <Avatar size="lg">
                    <AvatarFallback>{initials(lead.name)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemTitle>{lead.name}</ItemTitle>
                  <ItemDescription>
                    {lead.phone}
                    <span className="sm:hidden">
                      {" "}
                      · {lead.budget || "Not set"}
                    </span>
                  </ItemDescription>
                </ItemContent>
                <ItemContent className="hidden flex-none text-right sm:flex">
                  <ItemTitle className="self-end">
                    {lead.budget || "Not set"}
                  </ItemTitle>
                  <ItemDescription className="text-right text-xs">
                    Budget
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">{sourceLabel(lead.source)}</Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Message ${lead.name}`}
                        onClick={() =>
                          toast.success(`Opening chat with ${lead.name}`, {
                            description: lead.phone,
                          })
                        }
                      >
                        <MessageSquareIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link to="/app/leads">
            View All
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
      <AddLeadDialog open={addOpen} onOpenChange={setAddOpen} />
    </Card>
  )
}
