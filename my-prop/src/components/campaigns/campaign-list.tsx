import { MegaphoneIcon, PlusIcon } from "lucide-react"

import { CampaignItem } from "./campaign-item"
import type { CampaignAction } from "./campaign-item"
import type { Campaign } from "./campaign-data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ItemGroup } from "@/components/ui/item"

export function CampaignList({
  campaigns,
  onAction,
  onCreate,
}: {
  campaigns: Campaign[]
  onAction: (action: CampaignAction, campaign: Campaign) => void
  onCreate: () => void
}) {
  const active = campaigns.filter((c) => c.status === "active").length

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Campaigns</CardTitle>
        <CardDescription>
          {campaigns.length} campaign{campaigns.length === 1 ? "" : "s"} ·{" "}
          {active} active
        </CardDescription>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MegaphoneIcon />
              </EmptyMedia>
              <EmptyTitle>No campaigns yet</EmptyTitle>
              <EmptyDescription>
                Create your first WhatsApp, Email or SMS campaign to start
                reaching your leads.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={onCreate}>
                <PlusIcon data-icon="inline-start" />
                Create Campaign
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <ItemGroup>
            {campaigns.map((campaign) => (
              <CampaignItem
                key={campaign.id}
                campaign={campaign}
                onAction={onAction}
              />
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
