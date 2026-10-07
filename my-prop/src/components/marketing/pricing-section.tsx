import { Link } from "@tanstack/react-router"
import { CheckIcon } from "lucide-react"
import { toast } from "sonner"

import { CONTAINER } from "@/components/marketing/constants"
import { SectionHeading } from "@/components/marketing/section-heading"
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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Plan = {
  name: string
  price: string
  period: string
  description: string
  features: Array<string>
  popular: boolean
  contactSales?: boolean
}

const PLANS: Array<Plan> = [
  {
    name: "Starter",
    price: "₹4,999",
    period: "/month",
    description: "Perfect for individual brokers",
    features: [
      "3 Active Websites",
      "500 Leads/month",
      "WhatsApp & Email Campaigns",
      "Basic CRM",
      "AI Content Generation",
      "Standard Templates",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "₹14,999",
    period: "/month",
    description: "For growing developers",
    features: [
      "15 Active Websites",
      "5,000 Leads/month",
      "Advanced Automation",
      "Full CRM Suite",
      "Unlimited AI Generation",
      "Premium Templates",
      "Custom Domain",
      "Priority Support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited Websites",
      "Unlimited Leads",
      "White Label Solution",
      "Dedicated Account Manager",
      "Custom Integrations",
      "API Access",
      "Advanced Analytics",
      "24/7 Support",
    ],
    popular: false,
    contactSales: true,
  },
]

function contactSales() {
  toast.success("Thanks for your interest", {
    description: "Our sales team will contact you shortly.",
  })
}

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-16 py-16 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          title="Simple, Transparent Pricing"
          description="Choose the plan that fits your business"
        />
        <div className="mt-12 grid items-start gap-6 sm:mt-16 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(plan.popular && "shadow-xl ring-2 ring-primary")}
            >
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                {plan.popular && (
                  <CardAction>
                    <Badge>Most Popular</Badge>
                  </CardAction>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="mb-1 text-muted-foreground">
                      {plan.period}
                    </span>
                  )}
                </div>
                <Separator />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.contactSales ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={contactSales}
                  >
                    Contact Sales
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link to="/register">Start Free Trial</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
