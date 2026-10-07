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
import { useListWebsites } from "@/api/generated/websites/websites"
import { QueryError } from "@/components/query-error"
import { Skeleton } from "@/components/ui/skeleton"

const LIVE_PARAMS = { status: ["live" as const] }

export function ActiveWebsitesCard() {
  const websitesQuery = useListWebsites(LIVE_PARAMS)
  const liveWebsites = websitesQuery.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Websites</CardTitle>
        <CardDescription>
          {websitesQuery.isSuccess
            ? `${liveWebsites.length} websites are live and capturing leads`
            : "Your live websites"}
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/websites">Manage All</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {websitesQuery.isError && (
          <QueryError
            title="Couldn't load websites"
            error={websitesQuery.error}
            onRetry={() => void websitesQuery.refetch()}
          />
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {websitesQuery.isPending &&
            Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          {liveWebsites.map((site) => (
            <Item key={site.id} variant="outline" asChild>
              <Link to="/app/websites">
                <ItemMedia variant="image">
                  <img src={site.thumbnailUrl} alt="" loading="lazy" />
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
