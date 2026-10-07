import { formatCrore } from "./data"
import type { AnalyticsData } from "./data"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TopWebsites({ data }: { data: AnalyticsData }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Top Performing Websites</CardTitle>
        <CardDescription>
          Ranked by revenue in the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="min-w-xl">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead className="text-right">CVR</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.websites.map((site) => (
              <TableRow key={site.name}>
                <TableCell>
                  <Badge variant={site.rank === 1 ? "default" : "secondary"}>
                    #{site.rank}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {site.visitors.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {site.leads.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {site.cvr.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCrore(site.revenueCr)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
