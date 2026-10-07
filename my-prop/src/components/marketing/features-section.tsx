import {
  ChartColumnIcon,
  LayoutTemplateIcon,
  MessageSquareIcon,
  SendIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { CONTAINER } from "@/components/marketing/constants"
import { SectionHeading } from "@/components/marketing/section-heading"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const FEATURES: Array<{
  icon: LucideIcon
  title: string
  description: string
}> = [
  {
    icon: SparklesIcon,
    title: "AI Website Generator",
    description:
      "Generate complete property websites in minutes with AI. Just add project details and watch magic happen.",
  },
  {
    icon: LayoutTemplateIcon,
    title: "Drag & Drop Builder",
    description:
      "Customize every section with an intuitive visual builder. No coding required.",
  },
  {
    icon: MessageSquareIcon,
    title: "WhatsApp Automation",
    description:
      "Send personalized WhatsApp campaigns and automate follow-ups with intelligent chatbots.",
  },
  {
    icon: UsersIcon,
    title: "Lead CRM",
    description:
      "Manage leads with a visual pipeline. Track interactions, schedule follow-ups, and close deals faster.",
  },
  {
    icon: SendIcon,
    title: "Campaign Builder",
    description:
      "Create multi-channel campaigns with email and WhatsApp. Set triggers and automation flows.",
  },
  {
    icon: ChartColumnIcon,
    title: "Analytics Dashboard",
    description:
      "Track performance with real-time analytics. Measure ROI, conversion rates, and lead sources.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-16 bg-muted/50 py-16 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          title="Everything You Need to Succeed"
          description="Powerful tools to build, market, and convert real estate leads"
        />
        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader className="gap-2">
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
