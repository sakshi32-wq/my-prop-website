import { useState } from "react"
import {
  CheckCircleIcon,
  CopyIcon,
  ExternalLinkIcon,
  InfoIcon,
  PlusIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { toast } from "sonner"

import { HOSTNAME_RE, copyToClipboard, useSimulatedRequest } from "./utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemGroup } from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { WEBSITES } from "@/lib/mock-data"

export type NewDomain = { domain: string; website: string }

const DNS_RECORDS = [
  {
    label: "A Record",
    type: "A",
    name: "@",
    value: "76.76.21.21",
    copied: "IP address copied",
  },
  {
    label: "CNAME Record",
    type: "CNAME",
    name: "www",
    value: "cname.myprop.live",
    copied: "CNAME copied",
  },
]

const REGISTRAR_GUIDES = [
  {
    name: "GoDaddy",
    href: "https://www.godaddy.com/help/manage-dns-records-680",
  },
  {
    name: "Namecheap",
    href: "https://www.namecheap.com/support/knowledgebase/article.aspx/434/2237/how-do-i-set-up-host-records-for-a-domain/",
  },
  {
    name: "Cloudflare",
    href: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/",
  },
]

export function AddDomainDialog({
  open,
  onOpenChange,
  existingDomains,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingDomains: Array<string>
  onAdd: (domain: NewDomain) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-xl">
        {/* Remounts on every open, so the wizard always starts at step 1. */}
        <AddDomainWizard
          existingDomains={existingDomains}
          onDone={(domain) => {
            onAdd(domain)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function validateDomain(value: string, existing: Array<string>) {
  if (!value) return "Domain name is required."
  if (/^[a-z]+:\/\//.test(value))
    return "Enter the domain without http:// or https://."
  if (value.includes("/")) return "Enter only the domain, without a path."
  if (!HOSTNAME_RE.test(value)) return "Enter a valid domain, e.g. example.com."
  if (existing.includes(value)) return "This domain has already been added."
  return undefined
}

function AddDomainWizard({
  existingDomains,
  onDone,
}: {
  existingDomains: Array<string>
  onDone: (domain: NewDomain) => void
}) {
  const [step, setStep] = useState<"details" | "dns">("details")
  const [domainName, setDomainName] = useState("")
  const [websiteId, setWebsiteId] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [verifying, verify] = useSimulatedRequest(1500)

  const domain = domainName.trim().toLowerCase()
  const domainError = submitted
    ? validateDomain(domain, existingDomains)
    : undefined
  const websiteError =
    submitted && !websiteId ? "Select a website for this domain." : undefined
  const website = WEBSITES.find((site) => site.id === websiteId)

  function handleContinue(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (validateDomain(domain, existingDomains) || !websiteId) return
    setStep("dns")
  }

  function handleVerify() {
    verify(() =>
      toast.info("DNS records not detected yet", {
        description: `Propagation for ${domain} can take 24-48 hours. We'll keep checking automatically.`,
      })
    )
  }

  if (step === "details") {
    return (
      <form noValidate onSubmit={handleContinue} className="contents">
        <DialogHeader>
          <DialogTitle>Add Custom Domain</DialogTitle>
          <DialogDescription>
            Connect your custom domain to one of your websites
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={!!domainError}>
            <FieldLabel htmlFor="domainName">Domain Name</FieldLabel>
            <Input
              id="domainName"
              placeholder="example.com"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              aria-invalid={!!domainError}
            />
            {domainError ? (
              <FieldError>{domainError}</FieldError>
            ) : (
              <FieldDescription>
                Enter your domain without http:// or https://
              </FieldDescription>
            )}
          </Field>
          <Field data-invalid={!!websiteError}>
            <FieldLabel htmlFor="domainWebsite">Select Website</FieldLabel>
            <Select value={websiteId} onValueChange={setWebsiteId}>
              <SelectTrigger
                id="domainWebsite"
                className="w-full"
                aria-invalid={!!websiteError}
              >
                <SelectValue placeholder="Choose a website to connect" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {WEBSITES.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {websiteError ? (
              <FieldError>{websiteError}</FieldError>
            ) : (
              <FieldDescription>
                This domain will point to the selected website
              </FieldDescription>
            )}
          </Field>
          <Alert>
            <TriangleAlertIcon />
            <AlertTitle>Before you continue</AlertTitle>
            <AlertDescription>
              <ul className="flex list-disc flex-col gap-1 pl-4">
                <li>Make sure you own this domain</li>
                <li>Have access to your domain&apos;s DNS settings</li>
                <li>DNS changes may take 24-48 hours to propagate</li>
              </ul>
            </AlertDescription>
          </Alert>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">
            <PlusIcon data-icon="inline-start" />
            Add Domain
          </Button>
        </DialogFooter>
      </form>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Configure DNS for {domain}</DialogTitle>
        <DialogDescription>
          Add these DNS records at your domain registrar (GoDaddy, Namecheap,
          etc.) to point {domain} to {website?.name}.
        </DialogDescription>
      </DialogHeader>
      <div className="flex min-w-0 flex-col gap-4">
        <ItemGroup className="gap-3">
          {DNS_RECORDS.map((record) => (
            <Item key={record.type} variant="muted">
              <ItemContent className="min-w-0 gap-3">
                <Badge variant="outline">{record.label}</Badge>
                <dl className="grid grid-cols-[auto_auto_1fr] gap-x-6 gap-y-1">
                  <dt className="text-muted-foreground">Type</dt>
                  <dt className="text-muted-foreground">Name</dt>
                  <dt className="text-muted-foreground">Value</dt>
                  <dd className="font-mono font-medium">{record.type}</dd>
                  <dd className="font-mono font-medium">{record.name}</dd>
                  <dd className="font-mono font-medium break-all">
                    {record.value}
                  </dd>
                </dl>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Copy ${record.type} record value`}
                  onClick={() => copyToClipboard(record.value, record.copied)}
                >
                  <CopyIcon />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
        <Alert>
          <InfoIcon />
          <AlertTitle>Need help?</AlertTitle>
          <AlertDescription>
            <p>Check our detailed guides for popular domain registrars:</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {REGISTRAR_GUIDES.map((guide) => (
                <a
                  key={guide.name}
                  href={guide.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  {guide.name} Guide
                  <ExternalLinkIcon className="size-3" />
                </a>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => setStep("details")}>
          Back
        </Button>
        <Button variant="outline" disabled={verifying} onClick={handleVerify}>
          {verifying ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <CheckCircleIcon data-icon="inline-start" />
          )}
          {verifying ? "Checking DNS..." : "Verify DNS"}
        </Button>
        <Button
          onClick={() => onDone({ domain, website: website?.name ?? "" })}
        >
          Done
        </Button>
      </DialogFooter>
    </>
  )
}
