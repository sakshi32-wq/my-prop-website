import { Link } from "@tanstack/react-router"

import { CONTAINER } from "@/components/marketing/constants"
import { SectionHeading } from "@/components/marketing/section-heading"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PHOTOS, unsplash } from "@/lib/mock-data"

const SHOWCASE = [
  { name: "Project Launch", type: "New Development", photo: PHOTOS.office },
  { name: "Luxury Tower", type: "High-End Property", photo: PHOTOS.tower },
  { name: "Single Property", type: "Villa/Apartment", photo: PHOTOS.villa },
  { name: "Broker Profile", type: "Personal Brand", photo: PHOTOS.building },
]

export function TemplatesSection() {
  return (
    <section id="templates" className="scroll-mt-16 bg-muted/50 py-16 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          title="Professional Templates"
          description="Choose from our library of premium real estate templates"
        />
        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {SHOWCASE.map((template) => (
            <Link
              key={template.name}
              to="/register"
              aria-label={`Start with the ${template.name} template`}
              className="group rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Card className="h-full pt-0 transition-shadow group-hover:shadow-lg">
                <AspectRatio ratio={4 / 3} className="overflow-hidden bg-muted">
                  <img
                    src={unsplash(template.photo, 400, 300)}
                    alt={template.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </AspectRatio>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.type}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
