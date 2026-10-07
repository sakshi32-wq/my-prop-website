import { UsersIcon } from "lucide-react"

import { AUDIENCE_SEGMENTS, estimateReach } from "./campaign-data"
import type { CampaignDraft, DraftErrors } from "./campaign-data"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function AudienceFields({
  draft,
  onChange,
  errors,
}: {
  draft: CampaignDraft
  onChange: (patch: Partial<CampaignDraft>) => void
  errors: DraftErrors
}) {
  const reach = estimateReach(draft.audience)
  const allSelected = draft.audience.includes("all")

  function toggle(id: string, checked: boolean) {
    onChange({
      audience: checked
        ? [...draft.audience, id]
        : draft.audience.filter((a) => a !== id),
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <FieldSet data-invalid={!!errors.audience || undefined}>
        <FieldLegend variant="label">Audience Segments</FieldLegend>
        <FieldDescription>
          Choose which leads will receive this campaign.
        </FieldDescription>
        <FieldGroup
          data-slot="checkbox-group"
          className="sm:grid sm:grid-cols-2"
        >
          {AUDIENCE_SEGMENTS.map((segment) => {
            const id = `segment-${segment.id}`
            const included = allSelected && segment.id !== "all"
            return (
              <FieldLabel key={segment.id} htmlFor={id}>
                <Field orientation="horizontal">
                  <Checkbox
                    id={id}
                    checked={draft.audience.includes(segment.id)}
                    aria-invalid={!!errors.audience || undefined}
                    onCheckedChange={(checked) =>
                      toggle(segment.id, checked === true)
                    }
                  />
                  <FieldContent>
                    <FieldTitle>{segment.name}</FieldTitle>
                    <FieldDescription>
                      {included
                        ? "Included in All Leads"
                        : `${segment.count.toLocaleString()} leads`}
                    </FieldDescription>
                  </FieldContent>
                  <Badge variant="secondary">
                    {segment.count.toLocaleString()}
                  </Badge>
                </Field>
              </FieldLabel>
            )
          })}
        </FieldGroup>
        <FieldError>{errors.audience}</FieldError>
      </FieldSet>

      <Item variant="muted">
        <ItemMedia variant="icon">
          <UsersIcon />
        </ItemMedia>
        <ItemContent>
          <ItemDescription>Estimated Reach</ItemDescription>
          <ItemTitle className="text-2xl font-semibold tabular-nums">
            {reach.toLocaleString()} leads
          </ItemTitle>
        </ItemContent>
      </Item>
    </div>
  )
}
