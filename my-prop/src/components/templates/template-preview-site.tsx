import { CheckIcon } from "lucide-react"
import { toast } from "sonner"

import {
  ABOUT_HIGHLIGHTS,
  PREVIEW_AMENITIES,
  slugify,
} from "@/components/templates/template-data"
import type {
  LibraryTemplate,
  PreviewSectionId,
} from "@/components/templates/template-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

function previewOnly() {
  toast("Preview only", {
    description: "Use this template to make these elements interactive.",
  })
}

/** Fake browser chrome wrapping every section of the template as one page. */
export function TemplatePreviewSite({
  template,
  sectionRef,
}: {
  template: LibraryTemplate
  sectionRef: (id: PreviewSectionId) => (el: HTMLElement | null) => void
}) {
  const host = `${slugify(template.name) || "example"}.myprop.live`

  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-lg">
      <div className="flex items-center gap-3 border-b bg-muted px-3 py-2">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-muted-foreground/40" />
          <span className="size-2.5 rounded-full bg-muted-foreground/40" />
          <span className="size-2.5 rounded-full bg-muted-foreground/40" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
          https://{host}
        </div>
      </div>

      <div className="@container">
        <section
          ref={sectionRef("hero")}
          data-section="hero"
          className="relative flex min-h-80 scroll-mt-4 items-center justify-center overflow-hidden"
        >
          <img
            src={template.thumbnailUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-background/75" />
          <div className="relative flex flex-col items-center gap-4 px-6 py-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight @2xl:text-5xl">
              {template.name}
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground">
              {template.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={previewOnly}>Schedule Visit</Button>
              <Button variant="outline" onClick={previewOnly}>
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section
          ref={sectionRef("about")}
          data-section="about"
          className="scroll-mt-4 px-6 py-12"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <h3 className="text-2xl font-bold tracking-tight">
              About This Project
            </h3>
            <div className="grid gap-8 @xl:grid-cols-2">
              <div className="flex flex-col gap-4 leading-relaxed text-muted-foreground">
                <p>
                  Experience luxury living at its finest with this premium
                  development. Thoughtfully designed spaces that blend modern
                  architecture with timeless elegance.
                </p>
                <p>
                  Located in a prime area with excellent connectivity and
                  surrounded by world-class amenities.
                </p>
              </div>
              <ul className="flex flex-col gap-4">
                {ABOUT_HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                      <CheckIcon className="size-4" />
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          ref={sectionRef("features")}
          data-section="features"
          className="scroll-mt-4 bg-muted/50 px-6 py-12"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <h3 className="text-center text-2xl font-bold tracking-tight">
              Premium Amenities
            </h3>
            <div className="grid gap-4 @md:grid-cols-2 @3xl:grid-cols-3">
              {PREVIEW_AMENITIES.map(({ icon: Icon, title, description }) => (
                <Card key={title} size="sm">
                  <CardHeader>
                    <Icon className="size-6 text-muted-foreground" />
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    {description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={sectionRef("gallery")}
          data-section="gallery"
          className="scroll-mt-4 px-6 py-12"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <h3 className="text-center text-2xl font-bold tracking-tight">
              Gallery
            </h3>
            <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-3">
              {template.galleryUrls.map((photo, i) => (
                <div
                  key={`${photo}-${i}`}
                  className="aspect-video overflow-hidden rounded-lg bg-muted"
                >
                  <img
                    src={photo}
                    alt={`${template.name} gallery ${i + 1}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={sectionRef("contact")}
          data-section="contact"
          className="scroll-mt-4 bg-muted/50 px-6 py-12"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-8">
            <h3 className="text-center text-2xl font-bold tracking-tight">
              Get In Touch
            </h3>
            <Card>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    previewOnly()
                  }}
                >
                  <FieldGroup>
                    <div className="grid gap-5 @md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="preview-name">Name</FieldLabel>
                        <Input id="preview-name" placeholder="Your name" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="preview-phone">Phone</FieldLabel>
                        <Input
                          id="preview-phone"
                          type="tel"
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="preview-email">Email</FieldLabel>
                      <Input
                        id="preview-email"
                        type="email"
                        placeholder="your@email.com"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="preview-message">Message</FieldLabel>
                      <Textarea
                        id="preview-message"
                        placeholder="Your message here..."
                      />
                    </Field>
                    <Button type="submit">Send Message</Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
