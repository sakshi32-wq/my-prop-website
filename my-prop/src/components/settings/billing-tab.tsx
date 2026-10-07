import { useState } from "react"
import {
  CreditCardIcon,
  DownloadIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import { ConfirmAction } from "./confirm-action"
import { downloadTextFile } from "./utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PLAN = {
  name: "Growth Plan",
  tagline: "Perfect for growing developers",
  price: "₹14,999",
  nextBilling: "Mar 15",
}

const USAGE = [
  { label: "Websites", used: 8, limit: 15 },
  { label: "Leads This Month", used: 2847, limit: 5000 },
]

const INVOICES = [
  {
    date: "Feb 15, 2026",
    amount: "₹14,999",
    status: "Paid",
    invoice: "INV-2026-002",
  },
  {
    date: "Jan 15, 2026",
    amount: "₹14,999",
    status: "Paid",
    invoice: "INV-2026-001",
  },
  {
    date: "Dec 15, 2025",
    amount: "₹14,999",
    status: "Paid",
    invoice: "INV-2025-012",
  },
]

const formatNumber = (value: number) => value.toLocaleString("en-IN")

function downloadInvoice(invoice: (typeof INVOICES)[number]) {
  downloadTextFile(
    `${invoice.invoice}.txt`,
    [
      "myprop.live — Invoice",
      "",
      `Invoice:  ${invoice.invoice}`,
      `Date:     ${invoice.date}`,
      `Plan:     ${PLAN.name} (monthly)`,
      `Amount:   ${invoice.amount}`,
      `Status:   ${invoice.status}`,
      `Paid with card ending 4242`,
      "",
      "Thank you for your business!",
    ].join("\n")
  )
  toast.success(`${invoice.invoice} downloaded`)
}

export function BillingTab() {
  const [cancelled, setCancelled] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your subscription and usage this cycle.
          </CardDescription>
          {cancelled && (
            <CardAction>
              <Badge variant="destructive">Cancels {PLAN.nextBilling}</Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">{PLAN.name}</h3>
              <p className="text-muted-foreground">{PLAN.tagline}</p>
            </div>
            <p className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold">{PLAN.price}</span>
              <span className="text-muted-foreground">per month</span>
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {USAGE.map((usage) => (
              <Item key={usage.label} variant="muted">
                <ItemContent className="gap-2">
                  <ItemDescription>{usage.label}</ItemDescription>
                  <ItemTitle className="text-lg">
                    {formatNumber(usage.used)} / {formatNumber(usage.limit)}
                  </ItemTitle>
                  <Progress
                    value={(usage.used / usage.limit) * 100}
                    aria-label={`${usage.label} usage`}
                  />
                </ItemContent>
              </Item>
            ))}
            <Item variant="muted">
              <ItemContent className="gap-2">
                <ItemDescription>
                  {cancelled ? "Access Until" : "Next Billing"}
                </ItemDescription>
                <ItemTitle className="text-lg">{PLAN.nextBilling}</ItemTitle>
                <ItemDescription>
                  {cancelled ? "Will not renew" : `${PLAN.price} auto-renews`}
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button
            onClick={() =>
              toast.success("Upgrade request received", {
                description: "Our team will reach out with Scale plan options.",
              })
            }
          >
            <SparklesIcon data-icon="inline-start" />
            Upgrade Plan
          </Button>
          {cancelled ? (
            <Button
              variant="outline"
              onClick={() => {
                setCancelled(false)
                toast.success("Subscription resumed")
              }}
            >
              Resume Subscription
            </Button>
          ) : (
            <ConfirmAction
              title="Cancel your subscription?"
              description={`You'll keep ${PLAN.name} features until ${PLAN.nextBilling}. After that your websites will be unpublished and lead capture will stop.`}
              confirmLabel="Cancel Subscription"
              cancelLabel="Keep Plan"
              onConfirm={() => {
                setCancelled(true)
                toast(`Subscription cancelled`, {
                  description: `Your plan stays active until ${PLAN.nextBilling}.`,
                })
              }}
              trigger={<Button variant="outline">Cancel Subscription</Button>}
            />
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            The card used for your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <CreditCardIcon />
            </ItemMedia>
            <ItemContent className="min-w-48">
              <ItemTitle className="font-mono whitespace-nowrap">
                •••• •••• •••• 4242
              </ItemTitle>
              <ItemDescription>Expires 12/26</ItemDescription>
            </ItemContent>
            <ItemActions className="ml-auto">
              <Badge>Default</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("Card editing is handled by our payment partner", {
                    description:
                      "You'll be redirected to a secure page in the live app.",
                  })
                }
              >
                Edit
              </Button>
            </ItemActions>
          </Item>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() =>
              toast.info("Adding cards is handled by our payment partner", {
                description:
                  "You'll be redirected to a secure page in the live app.",
              })
            }
          >
            <PlusIcon data-icon="inline-start" />
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Download invoices for past payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.date}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadInvoice(invoice)}
                    >
                      <DownloadIcon data-icon="inline-start" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
