import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { KeyIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { apiKeyTypeLabel } from "./api-keys-data"
import { optimisticApiKeyRevoke } from "./api-keys-optimistic"
import { ConfirmAction } from "./confirm-action"
import { GenerateApiKeyDialog } from "./generate-api-key-dialog"
import {
  useListApiKeys,
  useRevokeApiKey,
} from "@/api/generated/api-keys/api-keys"
import { QueryError } from "@/components/query-error"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

export function ApiKeysCard() {
  const queryClient = useQueryClient()
  const keysQuery = useListApiKeys()
  const keys = keysQuery.data ?? []
  const [generateOpen, setGenerateOpen] = useState(false)

  const revokeKey = useRevokeApiKey({
    mutation: {
      ...optimisticApiKeyRevoke(queryClient),
      onSuccess: (_data, _variables, { removed }) =>
        toast.success(`${removed?.name ?? "API key"} revoked`, {
          description: "Requests using this key will now be rejected.",
        }),
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Use these API keys to integrate myprop.live with your existing systems
        </CardDescription>
      </CardHeader>
      <CardContent>
        {keysQuery.isPending ? (
          <ItemGroup
            className="gap-3"
            aria-busy="true"
            aria-label="Loading API keys"
          >
            {Array.from({ length: 2 }, (_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </ItemGroup>
        ) : keysQuery.isError ? (
          <QueryError
            title="Couldn't load API keys"
            error={keysQuery.error}
            onRetry={() => void keysQuery.refetch()}
          />
        ) : keys.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <KeyIcon />
              </EmptyMedia>
              <EmptyTitle>No API keys</EmptyTitle>
              <EmptyDescription>
                Generate a key to connect your own systems.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="gap-3">
            {keys.map((apiKey) => (
              <Item key={apiKey.id} variant="outline">
                <ItemContent className="min-w-56">
                  <div className="flex flex-wrap items-center gap-2">
                    <ItemTitle>{apiKey.name}</ItemTitle>
                    <Badge variant="secondary">
                      {apiKeyTypeLabel(apiKey.type)}
                    </Badge>
                  </div>
                  <ItemDescription className="font-mono break-all">
                    {apiKey.preview}
                  </ItemDescription>
                  <ItemDescription className="text-xs">
                    Created: {format(apiKey.createdAt, "MMM d, yyyy")}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="ml-auto">
                  <ConfirmAction
                    title={`Revoke ${apiKey.name}?`}
                    description="Any application using this key will immediately lose access. This cannot be undone."
                    confirmLabel="Revoke Key"
                    onConfirm={() => revokeKey.mutate({ apiKeyId: apiKey.id })}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Revoke ${apiKey.name}`}
                      >
                        <Trash2Icon />
                      </Button>
                    }
                  />
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => setGenerateOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          Generate New API Key
        </Button>
      </CardFooter>

      <GenerateApiKeyDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
      />
    </Card>
  )
}
