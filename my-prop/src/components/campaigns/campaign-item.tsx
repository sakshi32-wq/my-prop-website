import {
  ClockIcon,
  EyeIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  Trash2Icon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { ChoiceIcon } from "./choice-icon"
import { channelIcon, scheduleLabel } from "./campaign-data"
import type { Campaign } from "./campaign-data"
import {
  CampaignMetrics,
  CampaignProgress,
  StatusBadge,
} from "./campaign-metrics"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type CampaignAction = "view" | "edit" | "toggle" | "delete"

export function CampaignItem({
  campaign,
  onAction,
}: {
  campaign: Campaign
  onAction: (action: CampaignAction, campaign: Campaign) => void
}) {
  const paused = campaign.status === "paused"

  return (
    <Item variant="outline" role="listitem" className="gap-4 p-4">
      <ItemHeader className="flex-wrap items-start">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <ChoiceIcon icon={channelIcon(campaign.type)} className="size-10" />
          <ItemContent className="min-w-0">
            <ItemTitle className="text-base">{campaign.name}</ItemTitle>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <StatusBadge status={campaign.status} />
              <span className="flex items-center gap-1">
                <ClockIcon className="size-3.5" />
                {scheduleLabel(campaign)}
              </span>
            </div>
          </ItemContent>
        </div>
        <ItemActions className="gap-1">
          <ActionButton
            label="View details"
            icon={EyeIcon}
            onClick={() => onAction("view", campaign)}
          />
          <ActionButton
            label="Edit campaign"
            icon={PencilIcon}
            onClick={() => onAction("edit", campaign)}
          />
          <ActionButton
            label={paused ? "Resume campaign" : "Pause campaign"}
            icon={paused ? PlayIcon : PauseIcon}
            onClick={() => onAction("toggle", campaign)}
          />
          <ActionButton
            label="Delete campaign"
            icon={Trash2Icon}
            onClick={() => onAction("delete", campaign)}
          />
        </ItemActions>
      </ItemHeader>
      <ItemFooter className="flex-col items-stretch gap-4">
        <CampaignMetrics campaign={campaign} />
        <Separator />
        <CampaignProgress campaign={campaign} />
      </ItemFooter>
    </Item>
  )
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: LucideIcon
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          onClick={onClick}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
