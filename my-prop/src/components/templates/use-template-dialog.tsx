import { useEffect, useRef, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  ArrowRightIcon,
  CheckIcon,
  FileTextIcon,
  GlobeIcon,
  RocketIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  INCLUDED_FEATURES,
  SLUG_PATTERN,
  slugify,
} from "@/components/templates/template-data"
import type { LibraryTemplate } from "@/components/templates/template-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { unsplash } from "@/lib/mock-data"

const NEXT_STEPS = [
  {
    icon: GlobeIcon,
    title: "Template Applied",
    description: (name: string) =>
      `The ${name} template will be set up with your branding`,
  },
  {
    icon: FileTextIcon,
    title: "Customize Content",
    description: () => "Edit text, images, and sections in the visual builder",
  },
  {
    icon: SettingsIcon,
    title: "Configure Settings",
    description: () => "Set up domain, SEO, analytics, and integrations",
  },
  {
    icon: RocketIcon,
    title: "Go Live",
    description: () => "Publish your website and start generating leads",
  },
]

export function UseTemplateDialog({
  open,
  onOpenChange,
  template,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: LibraryTemplate | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-xl">
        {template && (
          // Rendered only while open, so the form resets every time it closes.
          <UseTemplateForm
            key={template.id}
            template={template}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function UseTemplateForm({
  template,
  onClose,
}: {
  template: LibraryTemplate
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [submitted, setSubmitted] = useState(false)
  const [creating, setCreating] = useState(false)
  const [websiteName, setWebsiteName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [domain, setDomain] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const websiteNameError =
    submitted && !websiteName.trim() ? "Website name is required." : undefined
  const projectNameError =
    submitted && !projectName.trim() ? "Project name is required." : undefined
  const domainError =
    domain && !SLUG_PATTERN.test(domain)
      ? "Use lowercase letters, numbers and single hyphens only (e.g. skyline-heights)."
      : undefined
  const slug = domain || slugify(projectName) || "your-property"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step === 1) {
      setSubmitted(true)
      if (websiteName.trim() && projectName.trim()) setStep(2)
      return
    }
    if (domainError) return
    setCreating(true)
    timer.current = setTimeout(() => {
      toast.success(`${websiteName.trim()} created`, {
        description: `Built from the ${template.name} template at ${slug}.myprop.live`,
      })
      onClose()
      void navigate({
        to: "/app/websites/$id/builder",
        params: { id: "new" },
      })
    }, 1500)
  }

  return (
    <>
      <DialogHeader className="pr-8">
        <DialogTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" />
          Create Website from Template
        </DialogTitle>
        <DialogDescription>
          Set up your new website using the {template.name} template
        </DialogDescription>
      </DialogHeader>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col gap-4"
      >
        <div className="-mx-4 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-1">
          <Item variant="outline">
            <ItemMedia variant="image" className="size-16">
              <img src={unsplash(template.thumbnail, 200, 200)} alt="" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="flex-wrap">
                {template.name}
                {template.isPremium && (
                  <Badge>
                    <SparklesIcon data-icon="inline-start" />
                    Premium
                  </Badge>
                )}
                <Badge variant="secondary">{template.category}</Badge>
              </ItemTitle>
              <ItemDescription>{template.description}</ItemDescription>
            </ItemContent>
          </Item>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {step === 1 ? "Basic Info" : "Domain Setup"}
              </span>
              <span className="text-muted-foreground">Step {step} of 2</span>
            </div>
            <Progress value={step * 50} aria-label={`Step ${step} of 2`} />
          </div>

          {step === 1 ? (
            <>
              <FieldGroup>
                <Field data-invalid={!!websiteNameError}>
                  <FieldLabel htmlFor="website-name">Website Name</FieldLabel>
                  <Input
                    id="website-name"
                    placeholder="e.g., Skyline Heights Official Site"
                    autoFocus
                    value={websiteName}
                    aria-invalid={!!websiteNameError}
                    onChange={(e) => setWebsiteName(e.target.value)}
                  />
                  {websiteNameError ? (
                    <FieldError>{websiteNameError}</FieldError>
                  ) : (
                    <FieldDescription>
                      This will appear in the browser tab
                    </FieldDescription>
                  )}
                </Field>
                <Field data-invalid={!!projectNameError}>
                  <FieldLabel htmlFor="project-name">
                    Project / Property Name
                  </FieldLabel>
                  <Input
                    id="project-name"
                    placeholder="e.g., Skyline Heights"
                    value={projectName}
                    aria-invalid={!!projectNameError}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  {projectNameError ? (
                    <FieldError>{projectNameError}</FieldError>
                  ) : (
                    <FieldDescription>
                      Your property or project name
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">What happens next?</h4>
                <ItemGroup>
                  {NEXT_STEPS.map(({ icon: Icon, title, description }) => (
                    <Item key={title} size="sm" className="px-0">
                      <ItemMedia variant="icon">
                        <Icon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{title}</ItemTitle>
                        <ItemDescription>
                          {description(template.name)}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </div>
            </>
          ) : (
            <>
              <FieldGroup>
                <Field data-invalid={!!domainError}>
                  <FieldLabel htmlFor="domain">
                    Choose Your Domain (Optional)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="domain"
                      placeholder={slugify(projectName) || "your-property"}
                      autoFocus
                      autoCapitalize="none"
                      spellCheck={false}
                      value={domain}
                      aria-invalid={!!domainError}
                      onChange={(e) => setDomain(e.target.value.trim())}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>.myprop.live</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {domainError ? (
                    <FieldError>{domainError}</FieldError>
                  ) : (
                    <FieldDescription>
                      You can also use a custom domain later in settings
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>

              <Alert>
                <GlobeIcon />
                <AlertTitle>Free subdomain included</AlertTitle>
                <AlertDescription>
                  <p>
                    Your website will be accessible at{" "}
                    <span className="font-mono font-medium break-all text-foreground">
                      {slug}.myprop.live
                    </span>
                  </p>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3 rounded-lg bg-muted/50 p-4">
                <h4 className="text-sm font-medium">Included Features</h4>
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  {INCLUDED_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckIcon className="size-4 text-muted-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Continue
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={creating}
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit" disabled={creating || !!domainError}>
                {creating ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <RocketIcon data-icon="inline-start" />
                )}
                {creating ? "Creating Website..." : "Create Website"}
              </Button>
            </>
          )}
        </DialogFooter>
      </form>
    </>
  )
}
