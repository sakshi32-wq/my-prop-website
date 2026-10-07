import { formatDistanceToNow } from "date-fns"
import {
  CalendarIcon,
  IndianRupeeIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  PencilIcon,
  PhoneIcon,
  SparklesIcon,
  TagIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { ACTIVITY_ICONS, initials, sourceLabel, stageLabel } from "./data"
import { aiSuggestedReply } from "./send-whatsapp-dialog"
import type { Lead } from "./data"
import { useListLeadActivities } from "@/api/generated/leads/leads"
import { QueryError } from "@/components/query-error"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export type DetailAction = "whatsapp" | "schedule" | "call" | "tags" | "edit"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon
  label: string
  value: string
  href?: string
}) {
  const content = (
    <>
      <ItemMedia variant="icon">
        <Icon />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <ItemDescription>{label}</ItemDescription>
        <ItemTitle className="truncate">{value}</ItemTitle>
      </ItemContent>
    </>
  )
  return href ? (
    <Item variant="muted" size="sm" asChild>
      <a href={href}>{content}</a>
    </Item>
  ) : (
    <Item variant="muted" size="sm">
      {content}
    </Item>
  )
}

/** The lead's activity timeline, loaded while the sheet is open. */
function ActivityTimeline({ leadId }: { leadId: string }) {
  const activitiesQuery = useListLeadActivities(leadId)

  if (activitiesQuery.isPending)
    return (
      <div
        className="flex flex-col gap-2"
        aria-busy="true"
        aria-label="Loading activity"
      >
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  if (activitiesQuery.isError)
    return (
      <QueryError
        title="Couldn't load activity"
        error={activitiesQuery.error}
        onRetry={() => void activitiesQuery.refetch()}
      />
    )
  return (
    <ItemGroup>
      {activitiesQuery.data.map((activity) => {
        const Icon = ACTIVITY_ICONS[activity.type]
        return (
          <Item key={activity.id} size="xs">
            <ItemMedia variant="icon">
              <Icon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{activity.title}</ItemTitle>
              <ItemDescription>
                {[
                  activity.description,
                  formatDistanceToNow(activity.createdAt, { addSuffix: true }),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </ItemDescription>
            </ItemContent>
          </Item>
        )
      })}
    </ItemGroup>
  )
}

export function LeadDetailSheet({
  open,
  lead,
  onOpenChange,
  onAction,
}: {
  open: boolean
  lead: Lead | null
  onOpenChange: (open: boolean) => void
  onAction: (action: DetailAction, lead: Lead) => void
}) {
  return (
    <Sheet open={open && !!lead} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        {lead && (
          <>
            <SheetHeader className="border-b">
              <div className="flex items-center gap-3 pr-8">
                <Avatar size="lg">
                  <AvatarFallback>{initials(lead.name)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <SheetTitle className="truncate">{lead.name}</SheetTitle>
                  <SheetDescription>
                    Added{" "}
                    {formatDistanceToNow(lead.addedAt, { addSuffix: true })}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <Badge>{stageLabel(lead.stage)}</Badge>
                <Badge variant="outline">{sourceLabel(lead.source)}</Badge>
              </div>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1">
              <div className="flex flex-col gap-6 p-4">
                <Section title="Contact Information">
                  <ItemGroup className="gap-2">
                    <ContactRow
                      icon={PhoneIcon}
                      label="Phone"
                      value={lead.phone}
                      href={`tel:${lead.phone.replace(/\s/g, "")}`}
                    />
                    {lead.email && (
                      <ContactRow
                        icon={MailIcon}
                        label="Email"
                        value={lead.email}
                        href={`mailto:${lead.email}`}
                      />
                    )}
                    <ContactRow
                      icon={IndianRupeeIcon}
                      label="Budget"
                      value={lead.budget || "Not specified"}
                    />
                    <ContactRow
                      icon={MapPinIcon}
                      label="Interested Project"
                      value={
                        [lead.project, lead.configuration]
                          .filter(Boolean)
                          .join(" · ") || "Not specified"
                      }
                    />
                  </ItemGroup>
                </Section>

                <Section title="Tags">
                  {lead.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tags yet.
                    </p>
                  )}
                </Section>

                {lead.notes && (
                  <Section title="Notes">
                    <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                  </Section>
                )}

                <Separator />

                <Section title="Activity Timeline">
                  <ActivityTimeline leadId={lead.id} />
                </Section>

                <Alert>
                  <SparklesIcon />
                  <AlertTitle>AI Suggested Reply</AlertTitle>
                  <AlertDescription className="flex flex-col gap-3">
                    <p>&ldquo;{aiSuggestedReply(lead)}&rdquo;</p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => onAction("whatsapp", lead)}
                    >
                      <MessageSquareIcon data-icon="inline-start" />
                      Send via WhatsApp
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            </ScrollArea>

            <SheetFooter className="grid grid-cols-2 border-t">
              <Button
                variant="outline"
                onClick={() => onAction("schedule", lead)}
                className="col-span-2"
              >
                <CalendarIcon data-icon="inline-start" />
                Schedule Site Visit
              </Button>
              <Button variant="outline" onClick={() => onAction("call", lead)}>
                <PhoneIcon data-icon="inline-start" />
                Call Lead
              </Button>
              <Button variant="outline" onClick={() => onAction("tags", lead)}>
                <TagIcon data-icon="inline-start" />
                Add Tags
              </Button>
              <Button
                variant="secondary"
                onClick={() => onAction("edit", lead)}
                className="col-span-2"
              >
                <PencilIcon data-icon="inline-start" />
                Edit Lead
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
