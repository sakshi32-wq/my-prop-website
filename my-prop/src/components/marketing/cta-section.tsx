import { Link } from "@tanstack/react-router"
import { ArrowRightIcon } from "lucide-react"

import { requestDemo } from "@/components/marketing/constants"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="bg-primary py-16 sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-4xl">
          Ready to Transform Your Real Estate Business?
        </h2>
        <p className="text-lg text-balance text-primary-foreground/80">
          Join thousands of developers and brokers who are already using
          myprop.live
        </p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              Start Free Trial
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-primary-foreground"
            onClick={requestDemo}
          >
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
