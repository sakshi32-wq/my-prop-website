import { Fragment } from "react"
import { ZapIcon } from "lucide-react"

import {
  AUDIENCE_SEGMENTS,
  OBJECTIVES,
  channelIcon,
  describeSchedule,
  estimateReach,
  labelOf,
} from "./campaign-data"
import type { CampaignDraft } from "./campaign-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function CampaignReview({
  draft,
  onEditStep,
}: {
  draft: CampaignDraft
  onEditStep: (step: number) => void
}) {
  const reach = estimateReach(draft.audience)
  const ChannelIcon = channelIcon(draft.type)
  const segments = AUDIENCE_SEGMENTS.filter((s) =>
    draft.audience.includes(s.id)
  )

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Campaign Name", value: draft.name || "Not set" },
    {
      label: "Channel",
      value: (
        <Badge variant="secondary">
          <ChannelIcon data-icon="inline-start" />
          {draft.type}
        </Badge>
      ),
    },
    {
      label: "Objective",
      value: labelOf(OBJECTIVES, draft.objective) ?? "Not set",
    },
    {
      label: "Audience",
      value: (
        <span className="flex flex-wrap justify-end gap-1">
          {segments.map((s) => (
            <Badge key={s.id} variant="outline">
              {s.name}
            </Badge>
          ))}
        </span>
      ),
    },
    {
      label: "Estimated Reach",
      value: `${reach.toLocaleString()} leads`,
    },
    { label: "Schedule", value: describeSchedule(draft) },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
          <CardAction>
            <Button variant="link" size="sm" onClick={() => onEditStep(0)}>
              Edit
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-2.5">
            {rows.map((row, index) => (
              <Fragment key={row.label}>
                {index > 0 && <Separator />}
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 text-right font-medium break-words">
                    {row.value}
                  </dd>
                </div>
              </Fragment>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Message Preview</CardTitle>
          <CardAction>
            <Button variant="link" size="sm" onClick={() => onEditStep(2)}>
              Edit
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {draft.type === "Email" && draft.subject && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Subject</span>
              <span className="font-medium">{draft.subject}</span>
            </div>
          )}
          <p className="rounded-lg bg-muted p-3 break-words whitespace-pre-wrap">
            {draft.message || "No message content"}
          </p>
        </CardContent>
      </Card>

      <Alert>
        <ZapIcon />
        <AlertTitle>Ready to Launch?</AlertTitle>
        <AlertDescription>
          This campaign will be sent to {reach.toLocaleString()} leads. Make
          sure your message is ready!
        </AlertDescription>
      </Alert>
    </div>
  )
}
