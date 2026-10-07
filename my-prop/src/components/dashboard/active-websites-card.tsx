import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

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
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { WEBSITES, unsplash } from "@/lib/mock-data"

const LIVE_WEBSITES = WEBSITES.filter((site) => site.status === "live")

export function ActiveWebsitesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Websites</CardTitle>
        <CardDescription>
          {LIVE_WEBSITES.length} websites are live and capturing leads
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/websites">Manage All</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_WEBSITES.map((site) => (
            <Item key={site.id} variant="outline" asChild>
              <Link to="/app/websites">
                <ItemMedia variant="image">
                  <img
                    src={unsplash(site.thumbnail, 120, 120)}
                    alt=""
                    loading="lazy"
                  />
                </ItemMedia>
                <ItemContent className="min-w-0">
                  <ItemTitle>{site.name}</ItemTitle>
                  <ItemDescription className="truncate">
                    {site.domain}
                  </ItemDescription>
                </ItemContent>
                <Badge variant="secondary">Live</Badge>
                <ItemFooter className="text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground tabular-nums">
                      {site.leads}
                    </span>{" "}
                    leads
                  </span>
                  <span>
                    <span className="font-medium text-foreground tabular-nums">
                      {site.views.toLocaleString()}
                    </span>{" "}
                    views
                  </span>
                  <ArrowRightIcon className="size-4" />
                </ItemFooter>
              </Link>
            </Item>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
