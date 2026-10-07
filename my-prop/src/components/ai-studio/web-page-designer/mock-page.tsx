import { useId } from "react"
import { DumbbellIcon, TreesIcon, WavesIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const AMENITIES = [
  { icon: WavesIcon, title: "Swimming Pool", desc: "Olympic size pool" },
  { icon: DumbbellIcon, title: "Fitness Center", desc: "State-of-the-art gym" },
  { icon: TreesIcon, title: "Garden", desc: "Landscaped gardens" },
]

/**
 * The generated page. It lives inside a width-constrained frame, so its
 * responsive layout uses container queries (`@md:` etc.) instead of the
 * viewport — switching the device toggle reflows it like a real device.
 */
export function MockPage() {
  const id = useId()
  const field = (name: string) => `${id}-${name}`

  return (
    <div className="@container flex flex-col gap-4 bg-background p-3 @md:gap-6 @md:p-6">
      <section className="flex flex-col gap-4 rounded-xl bg-primary p-6 text-primary-foreground @lg:p-12">
        <h1 className="text-2xl font-semibold tracking-tight @lg:text-4xl">
          Welcome to Luxury Living
        </h1>
        <p className="opacity-80 @lg:text-xl">
          Discover your dream home in the heart of Mumbai's most prestigious
          location
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              toast("Preview only", {
                description: "Buttons go live once you publish the page.",
              })
            }
          >
            Schedule a Visit
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() =>
              toast("Preview only", {
                description: "Buttons go live once you publish the page.",
              })
            }
          >
            View Gallery
          </Button>
        </div>
      </section>

      <section className="grid gap-4 @md:grid-cols-3">
        {AMENITIES.map((amenity) => (
          <Card key={amenity.title} size="sm">
            <CardHeader>
              <amenity.icon className="mb-2 size-6 text-muted-foreground" />
              <CardTitle>{amenity.title}</CardTitle>
              <CardDescription>{amenity.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              toast("Preview only", {
                description: "Inquiries are collected once the page is live.",
              })
            }}
          >
            <FieldGroup className="gap-4">
              <div className="grid gap-4 @md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={field("name")} className="sr-only">
                    Your Name
                  </FieldLabel>
                  <Input id={field("name")} placeholder="Your Name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor={field("email")} className="sr-only">
                    Email Address
                  </FieldLabel>
                  <Input
                    id={field("email")}
                    type="email"
                    placeholder="Email Address"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={field("phone")} className="sr-only">
                    Phone Number
                  </FieldLabel>
                  <Input
                    id={field("phone")}
                    type="tel"
                    placeholder="Phone Number"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={field("date")} className="sr-only">
                    Preferred Date
                  </FieldLabel>
                  <Input id={field("date")} placeholder="Preferred Date" />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor={field("message")} className="sr-only">
                  Your Message
                </FieldLabel>
                <Textarea
                  id={field("message")}
                  rows={3}
                  placeholder="Your Message"
                />
              </Field>
              <Button type="submit" size="lg" className="w-full">
                Submit Inquiry
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
