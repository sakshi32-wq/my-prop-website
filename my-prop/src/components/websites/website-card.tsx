import { Link } from "@tanstack/react-router"
import {
  ChartColumnIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  GaugeIcon,
  GlobeIcon,
  PencilIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { toast } from "sonner"

import { AspectRatio } from "@/components/ui/aspect-ratio"
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
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { WEBSITE_TOOLS, unsplash } from "@/lib/mock-data"
import type { Website } from "@/lib/mock-data"

async function copyDomain(domain: string) {
  try {
    await navigator.clipboard.writeText(domain)
    toast.success("Domain copied", { description: domain })
  } catch {
    toast.error("Couldn't copy the domain", {
      description: "Your browser blocked clipboard access.",
    })
  }
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export function WebsiteCard({
  site,
  onOpenLighthouse,
}: {
  site: Website
  onOpenLighthouse: (site: Website) => void
}) {
  const tools = WEBSITE_TOOLS.filter((tool) => site.toolIds.includes(tool.id))
  const isLive = site.status === "live"

  return (
    <Card className="pt-0">
      <AspectRatio ratio={16 / 10} className="bg-muted">
        <img
          src={unsplash(site.thumbnail, 600, 375)}
          alt={site.name}
          loading="lazy"
          className="size-full object-cover"
        />
        <Badge
          variant={isLive ? "default" : "secondary"}
          className="absolute top-3 right-3"
        >
          {isLive ? "Live" : "Draft"}
        </Badge>
      </AspectRatio>

      <CardHeader>
        <CardTitle className="text-lg">{site.name}</CardTitle>
        <CardDescription className="flex min-w-0 items-center gap-1.5">
          <GlobeIcon className="size-4 shrink-0" />
          <span className="truncate">{site.domain}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Copy ${site.domain}`}
            onClick={() => void copyDomain(site.domain)}
          >
            <CopyIcon />
          </Button>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Stat
            icon={EyeIcon}
            label="Views"
            value={site.views.toLocaleString()}
          />
          <Stat
            icon={UsersIcon}
            label="Leads"
            value={site.leads.toLocaleString()}
          />
          <Stat icon={ChartColumnIcon} label="CVR" value={site.conversion} />
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            Enabled Tools ({tools.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tools.map((tool) => (
              <Badge key={tool.id} variant="secondary">
                <tool.icon data-icon="inline-start" />
                {tool.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to="/app/websites/$id/builder" params={{ id: site.id }}>
            <PencilIcon data-icon="inline-start" />
            Edit Website
          </Link>
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label={`Lighthouse report for ${site.name}`}
              onClick={() => onOpenLighthouse(site)}
            >
              <GaugeIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Lighthouse report</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            {isLive ? (
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={`https://${site.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${site.domain} in a new tab`}
                >
                  <ExternalLinkIcon />
                </a>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Open ${site.domain}`}
                onClick={() =>
                  toast.info(`${site.name} isn't published yet`, {
                    description: "Publish it from the builder to view it live.",
                  })
                }
              >
                <ExternalLinkIcon />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {isLive ? "Open live site" : "Not published yet"}
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}
