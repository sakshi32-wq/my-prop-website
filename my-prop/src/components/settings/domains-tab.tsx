import { useState } from "react"
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
import type { NewDomain } from "./add-domain-dialog"
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

type Domain = NewDomain & { status: "active" | "pending" }

const INITIAL_DOMAINS: Array<Domain> = [
  {
    domain: "skylineheights.com",
    status: "active",
    website: "Skyline Heights",
  },
  {
    domain: "marinabay.in",
    status: "pending",
    website: "Marina Bay Apartments",
  },
  {
    domain: "greenvalley.com",
    status: "active",
    website: "Green Valley Villas",
  },
]

export function DomainsTab() {
  const [domains, setDomains] = useState(INITIAL_DOMAINS)
  const [addOpen, setAddOpen] = useState(false)

  function addDomain(domain: NewDomain) {
    setDomains((prev) => [...prev, { ...domain, status: "pending" }])
    toast.success(`${domain.domain} added`, {
      description: "It will become active once your DNS records are verified.",
    })
  }

  function removeDomain(domain: string) {
    setDomains((prev) => prev.filter((d) => d.domain !== domain))
    toast.success(`${domain} removed`)
  }

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
        {domains.length === 0 ? (
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
              <Item key={item.domain} variant="outline">
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
                  <ItemDescription>{item.website}</ItemDescription>
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
                    description={`${item.website} will no longer be reachable at this domain. You can add it again later.`}
                    confirmLabel="Remove Domain"
                    onConfirm={() => removeDomain(item.domain)}
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
        onAdd={addDomain}
      />
    </Card>
  )
}
