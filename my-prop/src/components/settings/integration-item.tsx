import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { optimisticIntegrationDisconnect } from "./integrations-optimistic"
import type { Integration, IntegrationInfo } from "./integrations-data"
import {
  useConnectIntegration,
  useDisconnectIntegration,
} from "@/api/generated/integrations/integrations"
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

/** One integration with its own connect/disconnect requests. */
export function IntegrationItem({
  integration,
  state,
}: {
  integration: IntegrationInfo
  state: Integration | undefined
}) {
  const queryClient = useQueryClient()
  const integrationId = integration.id
  // Connecting can fail (e.g. a rejected OAuth grant), so it isn't optimistic.
  const connect = useConnectIntegration({
    mutation: {
      onSuccess: () => toast.success(`${integration.name} connected`),
    },
  })
  const disconnect = useDisconnectIntegration({
    mutation: {
      ...optimisticIntegrationDisconnect(queryClient),
      onSuccess: () =>
        toast(`${integration.name} disconnected`, {
          action: {
            label: "Undo",
            onClick: () => connect.mutate({ integrationId }),
          },
        }),
    },
  })
  const connected = !!state?.connected
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
            aria-label={`Disconnect ${integration.name}`}
            onClick={() => disconnect.mutate({ integrationId })}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            aria-label={`Connect ${integration.name}`}
            disabled={connect.isPending}
            onClick={() => connect.mutate({ integrationId })}
          >
            {connect.isPending && <Spinner data-icon="inline-start" />}
            {connect.isPending ? "Connecting..." : "Connect"}
          </Button>
        )}
      </ItemActions>
    </Item>
  )
}
