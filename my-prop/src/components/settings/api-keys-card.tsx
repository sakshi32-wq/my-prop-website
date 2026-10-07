import { useState } from "react"
import { format } from "date-fns"
import { CopyIcon, KeyIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { ConfirmAction } from "./confirm-action"
import { GenerateApiKeyDialog } from "./generate-api-key-dialog"
import { copyToClipboard, maskSecret } from "./utils"
import type { NewApiKey } from "./generate-api-key-dialog"
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

type ApiKey = NewApiKey & { id: string; created: string }

const INITIAL_KEYS: Array<ApiKey> = [
  {
    id: "prod",
    name: "Production API Key",
    type: "production",
    key: "sk_live_demo-key-not-real-4f2a",
    created: "Jan 15, 2026",
  },
  {
    id: "dev",
    name: "Development API Key",
    type: "development",
    key: "sk_test_demo-key-not-real-9b7c",
    created: "Jan 10, 2026",
  },
]

export function ApiKeysCard() {
  const [keys, setKeys] = useState(INITIAL_KEYS)
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set())
  const [generateOpen, setGenerateOpen] = useState(false)

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function addKey(key: NewApiKey) {
    setKeys((prev) => [
      ...prev,
      {
        ...key,
        id: crypto.randomUUID(),
        created: format(new Date(), "MMM d, yyyy"),
      },
    ])
    toast.success(`${key.name} created`)
  }

  function revoke(key: ApiKey) {
    setKeys((prev) => prev.filter((k) => k.id !== key.id))
    toast.success(`${key.name} revoked`, {
      description: "Requests using this key will now be rejected.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Use these API keys to integrate myprop.live with your existing systems
        </CardDescription>
      </CardHeader>
      <CardContent>
        {keys.length === 0 ? (
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
            {keys.map((apiKey) => {
              const isRevealed = revealed.has(apiKey.id)
              return (
                <Item key={apiKey.id} variant="outline">
                  <ItemContent className="min-w-56">
                    <div className="flex flex-wrap items-center gap-2">
                      <ItemTitle>{apiKey.name}</ItemTitle>
                      <Badge variant="secondary">
                        {apiKey.type === "production"
                          ? "Production"
                          : "Development"}
                      </Badge>
                    </div>
                    <ItemDescription className="font-mono break-all">
                      {isRevealed ? apiKey.key : maskSecret(apiKey.key)}
                    </ItemDescription>
                    <ItemDescription className="text-xs">
                      Created: {apiKey.created}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      aria-pressed={isRevealed}
                      onClick={() => toggleReveal(apiKey.id)}
                    >
                      {isRevealed ? "Hide" : "Reveal"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Copy ${apiKey.name}`}
                      onClick={() =>
                        copyToClipboard(apiKey.key, "API key copied")
                      }
                    >
                      <CopyIcon />
                    </Button>
                    <ConfirmAction
                      title={`Revoke ${apiKey.name}?`}
                      description="Any application using this key will immediately lose access. This cannot be undone."
                      confirmLabel="Revoke Key"
                      onConfirm={() => revoke(apiKey)}
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
              )
            })}
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
        onGenerate={addKey}
      />
    </Card>
  )
}
