import { toast } from "sonner"

import { Logo } from "@/components/logo"
import { CONTAINER } from "@/components/marketing/constants"
import { Separator } from "@/components/ui/separator"

type FooterLink = { label: string; href?: string }

const COLUMNS: Array<{ title: string; links: Array<FooterLink> }> = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Templates", href: "#templates" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About" },
      { label: "Blog" },
      { label: "Careers" },
      { label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy" }, { label: "Terms" }, { label: "Security" }],
  },
]

const LINK_CLASS =
  "text-sm text-muted-foreground transition-colors hover:text-foreground"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/50 py-12">
      <div className={CONTAINER}>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground">
              AI-powered real estate marketing platform
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold">{column.title}</h4>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a href={link.href} className={LINK_CLASS}>
                        {link.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className={LINK_CLASS}
                        onClick={() =>
                          toast(`${link.label} page coming soon`, {
                            description:
                              "This section isn't available in the demo yet.",
                          })
                        }
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} myprop.live. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
