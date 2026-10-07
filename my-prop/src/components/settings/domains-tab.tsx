import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  ExternalLinkIcon,
  GlobeIcon,
  InfoIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { AddDomainDialog } from "./add-domain-dialog"
import { ConfirmAction } from "./confirm-action"
import { optimisticDomainDelete } from "./domains-optimistic"
import {
  useDeleteDomain,
  useListDomains,
} from "@/api/generated/domains/domains"
import { QueryError } from "@/components/query-error"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

export function DomainsTab() {
  const queryClient = useQueryClient()
  const domainsQuery = useListDomains()
  const domains = domainsQuery.data ?? []
  const [addOpen, setAddOpen] = useState(false)

  const deleteDomain = useDeleteDomain({
    mutation: {
      ...optimisticDomainDelete(queryClient),
      onSuccess: (_data, _variables, { removed }) =>
        toast.success(`${removed?.domain ?? "Domain"} removed`),
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Domains</CardTitle>
        <CardDescription>
          Serve your websites from domains you own.
        </CardDescription>
        <CardAction>
          <Button onClick={() => setAddOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            Add Domain
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {domainsQuery.isPending ? (
          <ItemGroup
            className="gap-3"
            aria-busy="true"
            aria-label="Loading domains"
          >
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </ItemGroup>
        ) : domainsQuery.isError ? (
          <QueryError
            title="Couldn't load domains"
            error={domainsQuery.error}
            onRetry={() => void domainsQuery.refetch()}
          />
        ) : domains.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <GlobeIcon />
              </EmptyMedia>
              <EmptyTitle>No custom domains yet</EmptyTitle>
              <EmptyDescription>
                Add a domain to give your website a branded address.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="gap-3">
            {domains.map((item) => (
              <Item key={item.id} variant="outline">
                <ItemMedia variant="icon">
                  <GlobeIcon />
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <ItemTitle className="break-all">{item.domain}</ItemTitle>
                    <Badge
                      variant={
                        item.status === "active" ? "default" : "secondary"
                      }
                    >
                      {item.status === "active" ? "Active" : "Pending"}
                    </Badge>
                  </div>
                  <ItemDescription>{item.websiteName}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a
                      href={`https://${item.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${item.domain}`}
                    >
                      <ExternalLinkIcon />
                    </a>
                  </Button>
                  <ConfirmAction
                    title={`Remove ${item.domain}?`}
                    description={`${item.websiteName} will no longer be reachable at this domain. You can add it again later.`}
                    confirmLabel="Remove Domain"
                    onConfirm={() => deleteDomain.mutate({ domainId: item.id })}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${item.domain}`}
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

        <Alert>
          <InfoIcon />
          <AlertTitle>How to connect your custom domain</AlertTitle>
          <AlertDescription>
            <ol className="flex list-decimal flex-col gap-1 pl-4">
              <li>Purchase a domain from any domain registrar</li>
              <li>Add your domain in the settings above</li>
              <li>Update your DNS settings with the provided records</li>
              <li>Wait for DNS propagation (usually 24-48 hours)</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>

      <AddDomainDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        existingDomains={domains.map((d) => d.domain)}
      />
    </Card>
  )
}
