import type { LucideIcon } from "lucide-react"

import { useSimulatedRequest } from "./utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

export type IntegrationInfo = {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

export function IntegrationItem({
  integration,
  connected,
  onConnectedChange,
}: {
  integration: IntegrationInfo
  connected: boolean
  onConnectedChange: (connected: boolean) => void
}) {
  const [connecting, connect] = useSimulatedRequest(1000)
  const Icon = integration.icon

  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Icon />
      </ItemMedia>
      <ItemContent className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <ItemTitle>{integration.name}</ItemTitle>
          {connected && <Badge>Active</Badge>}
        </div>
        <ItemDescription>
          {connected ? integration.description : "Not connected"}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {connected ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onConnectedChange(false)}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={connecting}
            onClick={() => connect(() => onConnectedChange(true))}
          >
            {connecting && <Spinner data-icon="inline-start" />}
            {connecting ? "Connecting..." : "Connect"}
          </Button>
        )}
      </ItemActions>
    </Item>
  )
}
