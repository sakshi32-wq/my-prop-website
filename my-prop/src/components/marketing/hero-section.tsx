import { Link } from "@tanstack/react-router"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { CONTAINER, requestDemo } from "@/components/marketing/constants"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PHOTOS, unsplash } from "@/lib/mock-data"

const STATS = [
  { value: "2,500+", label: "Active Projects" },
  { value: "50K+", label: "Leads Generated" },
  { value: "98%", label: "Customer Satisfaction" },
]

export function HeroSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className={CONTAINER}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary">
              <SparklesIcon data-icon="inline-start" />
              AI-Powered Platform
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Build &amp; Market Real Estate Projects with AI
            </h1>
            <p className="text-lg text-pretty text-muted-foreground sm:text-xl">
              Create stunning property websites, automate lead generation, and
              convert prospects with AI-powered marketing tools designed for
              real estate developers and brokers.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/register">
                  Start Free Trial
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={requestDemo}>
                Book a Demo
              </Button>
            </div>
            <dl className="grid grid-cols-3 gap-4 pt-2">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="order-2 text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </dt>
                  <dd className="text-2xl font-semibold sm:text-3xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
            <AspectRatio ratio={4 / 3}>
              <img
                src={unsplash(PHOTOS.building, 800, 600)}
                alt="Dashboard preview"
                className="size-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  )
}
