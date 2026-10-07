import { formatDistanceToNow } from "date-fns"
import {
  ArrowRightLeftIcon,
  CircleCheckIcon,
  CopyIcon,
  IndianRupeeIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  PencilIcon,
  PhoneIcon,
  Trash2Icon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { initials, sourceLabel } from "./data"
import type { Lead } from "./data"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LEAD_STAGES } from "@/lib/mock-data"
import type { LeadStage } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation()

export type LeadAction =
  "open" | "edit" | "duplicate" | "won" | "delete" | "call" | "whatsapp"

function InfoRow({
  icon: Icon,
  children,
  strong,
}: {
  icon: LucideIcon
  children: React.ReactNode
  strong?: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
      <Icon className="size-4 shrink-0" />
      <span className={cn("truncate", strong && "font-medium text-foreground")}>
        {children}
      </span>
    </div>
  )
}

function QuickAction({
  label,
  icon: Icon,
  onClick,
  href,
}: {
  label: string
  icon: LucideIcon
  onClick?: () => void
  href?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Button variant="ghost" size="icon-sm" asChild>
            <a href={href} onClick={stopPropagation} aria-label={label}>
              <Icon />
            </a>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            <Icon />
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function LeadCard({
  lead,
  onAction,
  onMove,
  dragging,
  className,
  ...props
}: {
  lead: Lead
  onAction: (action: LeadAction, lead: Lead) => void
  onMove: (lead: Lead, stage: LeadStage) => void
  dragging?: boolean
} & Omit<React.ComponentProps<typeof Card>, "onClick">) {
  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      aria-label={`Open ${lead.name}`}
      onClick={() => onAction("open", lead)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onAction("open", lead)
        }
      }}
      className={cn(
        "cursor-pointer transition-shadow outline-none hover:ring-foreground/20 focus-visible:ring-2 focus-visible:ring-ring",
        dragging && "shadow-lg ring-2 ring-ring",
        className
      )}
      {...props}
    >
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials(lead.name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-0.5">
            <CardTitle className="truncate">{lead.name}</CardTitle>
            <CardDescription className="text-xs">
              {formatDistanceToNow(lead.addedAt, { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Actions for ${lead.name}`}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48"
              onClick={stopPropagation}
              onMouseDown={stopPropagation}
              onTouchStart={stopPropagation}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => onAction("edit", lead)}>
                  <PencilIcon />
                  Edit Lead
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onAction("duplicate", lead)}>
                  <CopyIcon />
                  Duplicate Lead
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={lead.stage === "closed"}
                  onSelect={() => onAction("won", lead)}
                >
                  <CircleCheckIcon />
                  Mark as Won
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ArrowRightLeftIcon />
                    Move to Stage
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={lead.stage}
                      onValueChange={(stage) =>
                        onMove(lead, stage as LeadStage)
                      }
                    >
                      {LEAD_STAGES.map((stage) => (
                        <DropdownMenuRadioItem
                          key={stage.value}
                          value={stage.value}
                        >
                          {stage.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => onAction("delete", lead)}
                >
                  <Trash2Icon />
                  Delete Lead
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <InfoRow icon={PhoneIcon}>{lead.phone}</InfoRow>
          {lead.email && <InfoRow icon={MailIcon}>{lead.email}</InfoRow>}
          {lead.budget && (
            <InfoRow icon={IndianRupeeIcon} strong>
              {lead.budget}
            </InfoRow>
          )}
          {lead.project && <InfoRow icon={MapPinIcon}>{lead.project}</InfoRow>}
        </div>
        {(lead.tags.length > 0 || lead.configuration) && (
          <div className="flex flex-wrap gap-1.5">
            {lead.configuration && (
              <Badge variant="outline">{lead.configuration}</Badge>
            )}
            {lead.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-1">
        <Badge variant="outline">{sourceLabel(lead.source)}</Badge>
        <div className="ml-auto flex items-center">
          <QuickAction
            label="Call"
            icon={PhoneIcon}
            onClick={() => onAction("call", lead)}
          />
          <QuickAction
            label="WhatsApp"
            icon={MessageSquareIcon}
            onClick={() => onAction("whatsapp", lead)}
          />
          {lead.email ? (
            <QuickAction
              label="Email"
              icon={MailIcon}
              href={`mailto:${lead.email}`}
            />
          ) : null}
        </div>
      </CardFooter>
    </Card>
  )
}
