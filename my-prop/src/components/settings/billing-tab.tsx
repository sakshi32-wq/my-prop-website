import { format, parseISO } from "date-fns"
import {
  CreditCardIcon,
  DownloadIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import { formatInr } from "./billing-data"
import { ConfirmAction } from "./confirm-action"
import { downloadTextFile } from "./utils"
import type { Invoice, Subscription } from "./billing-data"
import {
  useCancelSubscription,
  useGetSubscription,
  useListInvoices,
  useRequestPlanUpgrade,
  useResumeSubscription,
} from "@/api/generated/billing/billing"
import { QueryError } from "@/components/query-error"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const formatNumber = (value: number) => value.toLocaleString("en-IN")
const formatDate = (date: string) => format(parseISO(date), "MMM d, yyyy")

function downloadInvoice(invoice: Invoice, subscription?: Subscription) {
  downloadTextFile(
    `${invoice.number}.txt`,
    [
      "myprop.live — Invoice",
      "",
      `Invoice:  ${invoice.number}`,
      `Date:     ${formatDate(invoice.issuedAt)}`,
      `Plan:     ${subscription?.plan.name ?? "Subscription"} (monthly)`,
      `Amount:   ${formatInr(invoice.amountInr)}`,
      `Status:   ${invoice.status}`,
      subscription
        ? `Paid with card ending ${subscription.paymentMethod.last4}`
        : "",
      "",
      "Thank you for your business!",
    ].join("\n")
  )
  toast.success(`${invoice.number} downloaded`)
}

export function BillingTab() {
  const subscriptionQuery = useGetSubscription()
  const invoicesQuery = useListInvoices()
  const cancel = useCancelSubscription({
    mutation: {
      onSuccess: (subscription) =>
        toast("Subscription cancelled", {
          description: `Your plan stays active until ${formatDate(subscription.currentPeriodEnd)}.`,
        }),
    },
  })
  const resume = useResumeSubscription({
    mutation: { onSuccess: () => toast.success("Subscription resumed") },
  })
  const upgrade = useRequestPlanUpgrade({
    mutation: {
      onSuccess: () =>
        toast.success("Upgrade request received", {
          description: "Our team will reach out with Scale plan options.",
        }),
    },
  })

  const subscription = subscriptionQuery.data
  if (!subscription)
    return subscriptionQuery.isError ? (
      <QueryError
        title="Couldn't load your subscription"
        error={subscriptionQuery.error}
        onRetry={() => void subscriptionQuery.refetch()}
      />
    ) : (
      <div
        className="flex flex-col gap-6"
        aria-busy="true"
        aria-label="Loading billing"
      >
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    )

  const { plan, paymentMethod } = subscription
  const cancelled = subscription.status === "cancelling"
  const periodEnd = formatDate(subscription.currentPeriodEnd)
  const price = formatInr(plan.priceInr)

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
              <Badge variant="destructive">Cancels {periodEnd}</Badge>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-muted-foreground">{plan.tagline}</p>
            </div>
            <p className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold">{price}</span>
              <span className="text-muted-foreground">per month</span>
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {subscription.usage.map((usage) => (
              <Item key={usage.key} variant="muted">
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
                <ItemTitle className="text-lg">{periodEnd}</ItemTitle>
                <ItemDescription>
                  {cancelled ? "Will not renew" : `${price} auto-renews`}
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button
            disabled={upgrade.isPending}
            onClick={() => upgrade.mutate({ data: { plan: "scale" } })}
          >
            {upgrade.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <SparklesIcon data-icon="inline-start" />
            )}
            Upgrade Plan
          </Button>
          {cancelled ? (
            <Button
              variant="outline"
              disabled={resume.isPending}
              onClick={() => resume.mutate()}
            >
              {resume.isPending && <Spinner data-icon="inline-start" />}
              Resume Subscription
            </Button>
          ) : (
            <ConfirmAction
              title="Cancel your subscription?"
              description={`You'll keep ${plan.name} features until ${periodEnd}. After that your websites will be unpublished and lead capture will stop.`}
              confirmLabel="Cancel Subscription"
              cancelLabel="Keep Plan"
              onConfirm={() => cancel.mutate()}
              trigger={
                <Button variant="outline" disabled={cancel.isPending}>
                  {cancel.isPending && <Spinner data-icon="inline-start" />}
                  Cancel Subscription
                </Button>
              }
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
                •••• •••• •••• {paymentMethod.last4}
              </ItemTitle>
              <ItemDescription>
                {paymentMethod.brand} · Expires{" "}
                {String(paymentMethod.expMonth).padStart(2, "0")}/
                {String(paymentMethod.expYear).slice(-2)}
              </ItemDescription>
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
          {invoicesQuery.isError ? (
            <QueryError
              title="Couldn't load invoices"
              error={invoicesQuery.error}
              onRetry={() => void invoicesQuery.refetch()}
            />
          ) : (
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
                {invoicesQuery.isPending && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                )}
                {invoicesQuery.data?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {formatDate(invoice.issuedAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {invoice.number}
                    </TableCell>
                    <TableCell>{formatInr(invoice.amountInr)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadInvoice(invoice, subscription)}
                      >
                        <DownloadIcon data-icon="inline-start" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
