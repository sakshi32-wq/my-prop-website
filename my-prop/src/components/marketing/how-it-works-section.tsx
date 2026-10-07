import { CONTAINER } from "@/components/marketing/constants"
import { SectionHeading } from "@/components/marketing/section-heading"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const STEPS = [
  {
    step: "01",
    title: "Add Your Project Details",
    description:
      "Enter property information, upload images, and define your target audience.",
  },
  {
    step: "02",
    title: "AI Builds Your Site",
    description:
      "Our AI generates a complete website with copy, layout, and lead capture forms.",
  },
  {
    step: "03",
    title: "Capture & Convert Leads",
    description:
      "Automated campaigns nurture leads through WhatsApp, email, and smart follow-ups.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-16 py-16 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          title="How It Works"
          description="Get started in 3 simple steps"
        />
        <ol className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
          {STEPS.map((item) => (
            <li key={item.step}>
              <Card className="h-full">
                <CardHeader className="gap-3">
                  <span
                    aria-hidden
                    className="text-5xl font-semibold text-muted-foreground/30 sm:text-6xl"
                  >
                    {item.step}
                  </span>
                  <CardTitle className="text-xl">
                    <span className="sr-only">Step {item.step}: </span>
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
