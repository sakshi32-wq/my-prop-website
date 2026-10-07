import { createFileRoute } from "@tanstack/react-router"

import { CtaSection } from "@/components/marketing/cta-section"
import { FeaturesSection } from "@/components/marketing/features-section"
import { HeroSection } from "@/components/marketing/hero-section"
import { HowItWorksSection } from "@/components/marketing/how-it-works-section"
import { PricingSection } from "@/components/marketing/pricing-section"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { TemplatesSection } from "@/components/marketing/templates-section"

export const Route = createFileRoute("/")({ component: LandingPage })

function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TemplatesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
