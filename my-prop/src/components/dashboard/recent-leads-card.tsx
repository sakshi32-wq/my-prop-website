import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowRightIcon, MessageSquareIcon, UserPlusIcon } from "lucide-react"
import { toast } from "sonner"

import { AddLeadDialog } from "@/components/leads/add-lead-dialog"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LEAD_SOURCES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type RecentLead = {
  id: string
  name: string
  phone: string
  budget: string
  source: string
}

const INITIAL_LEADS: Array<RecentLead> = [
  {
    id: "1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    budget: "₹80L - 1Cr",
    source: "Website",
  },
  {
    id: "2",
    name: "Priya Patel",
    phone: "+91 98765 43211",
    budget: "₹1.2Cr - 1.5Cr",
    source: "WhatsApp",
  },
  {
    id: "3",
    name: "Amit Kumar",
    phone: "+91 98765 43212",
    budget: "₹60L - 80L",
    source: "Social",
  },
  {
    id: "4",
    name: "Neha Singh",
    phone: "+91 98765 43213",
    budget: "₹2Cr+",
    source: "Referral",
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function readString(value: unknown, key: string) {
  if (typeof value !== "object" || value === null || !(key in value)) {
    return ""
  }
  const field = (value as Record<string, unknown>)[key]
  return typeof field === "string" ? field : ""
}

// The Leads dialog hands back its own lead shape; take only what we display.
function toRecentLead(lead: unknown): RecentLead | null {
  const name = readString(lead, "name").trim()
  if (!name) return null
  const source = readString(lead, "source")
  return {
    id: readString(lead, "id") || crypto.randomUUID(),
    name,
    phone: readString(lead, "phone") || "No phone",
    budget: readString(lead, "budget") || "Not set",
    source:
      LEAD_SOURCES.find((s) => s.value === source)?.label ??
      (source || "Website"),
  }
}

export function RecentLeadsCard({ className }: { className?: string }) {
  const [leads, setLeads] = useState(INITIAL_LEADS)
  const [addOpen, setAddOpen] = useState(false)

  function handleAdd(lead: unknown) {
    const recent = toRecentLead(lead)
    if (recent) setLeads((prev) => [recent, ...prev].slice(0, 5))
  }

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
        <ItemGroup className="gap-2">
          {leads.map((lead) => (
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
                  <span className="sm:hidden"> · {lead.budget}</span>
                </ItemDescription>
              </ItemContent>
              <ItemContent className="hidden flex-none text-right sm:flex">
                <ItemTitle className="self-end">{lead.budget}</ItemTitle>
                <ItemDescription className="text-right text-xs">
                  Budget
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">{lead.source}</Badge>
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
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link to="/app/leads">
            View All
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
      <AddLeadDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAdd}
      />
    </Card>
  )
}
