import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { toast } from "sonner"

import { faqText, platformLabel, socialPostText } from "./content"
import type { CopyContent, Faq, SocialPost, TitledText } from "./content"
import type { AiGeneration } from "@/api/generated/model"
import { CopyButton } from "./copy-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

function OutputBlock({
  label,
  title,
  copyText,
  className,
  children,
}: {
  label: string
  title?: string
  copyText: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn("flex flex-col gap-3 rounded-xl border p-4", className)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Badge variant="outline">{label}</Badge>
          {title && <h4 className="font-medium">{title}</h4>}
        </div>
        <CopyButton text={copyText} label={`Copy ${title ?? label}`} />
      </div>
      {children}
    </section>
  )
}

function CopyOutput({ copy }: { copy: CopyContent }) {
  return (
    <Tabs defaultValue="hero">
      <TabsList className="w-full">
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="cta">CTA</TabsTrigger>
      </TabsList>

      <TabsContent value="hero" className="flex flex-col gap-4">
        <OutputBlock
          label="Headline"
          copyText={`${copy.hero.headline}\n${copy.hero.tagline}`}
          className="bg-muted/50"
        >
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {copy.hero.headline}
          </h2>
          <p className="text-lg text-muted-foreground md:text-xl">
            {copy.hero.tagline}
          </p>
        </OutputBlock>
        <OutputBlock label="Description" copyText={copy.hero.description}>
          <p className="leading-relaxed">{copy.hero.description}</p>
        </OutputBlock>
      </TabsContent>

      <TabsContent value="about">
        <OutputBlock
          label="About Section"
          copyText={`${copy.about.title}\n\n${copy.about.paragraphs.join("\n\n")}`}
        >
          <h3 className="text-xl font-semibold">{copy.about.title}</h3>
          {copy.about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </OutputBlock>
      </TabsContent>

      <TabsContent value="features">
        <OutputBlock
          label="Amenities List"
          copyText={copy.features.map((feature) => `• ${feature}`).join("\n")}
        >
          <ul className="flex flex-col gap-3">
            {copy.features.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="flex items-start gap-3"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </OutputBlock>
      </TabsContent>

      <TabsContent value="cta">
        <OutputBlock
          label="Call to Action"
          copyText={`${copy.cta.title}\n${copy.cta.body}`}
          className="bg-muted/50"
        >
          <h3 className="text-xl font-semibold">{copy.cta.title}</h3>
          <p className="leading-relaxed text-muted-foreground">
            {copy.cta.body}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() =>
                toast("CTA preview", {
                  description:
                    "On your website this button opens the site visit form.",
                })
              }
            >
              Schedule Site Visit
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast("CTA preview", {
                  description:
                    "On your website this button downloads the brochure.",
                })
              }
            >
              Download Brochure
            </Button>
          </div>
        </OutputBlock>
      </TabsContent>
    </Tabs>
  )
}

function WhatsAppOutput({ messages }: { messages: Array<TitledText> }) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => (
        <OutputBlock
          key={message.title}
          label={`Message ${index + 1}`}
          title={message.title}
          copyText={message.content}
        >
          <p className="rounded-lg bg-muted p-4 font-mono text-sm whitespace-pre-wrap">
            {message.content}
          </p>
        </OutputBlock>
      ))}
    </div>
  )
}

function SocialOutput({
  posts,
  platform: platformValue,
}: {
  posts: Array<SocialPost>
  platform: string
}) {
  const platform = platformLabel(platformValue)
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post, index) => (
        <OutputBlock
          key={post.title}
          label={`${platform} Post ${index + 1}`}
          title={post.title}
          copyText={socialPostText(post)}
        >
          <div className="flex flex-col gap-3 rounded-lg bg-muted p-4">
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </OutputBlock>
      ))}
    </div>
  )
}

function FaqOutput({ faqs }: { faqs: Array<Faq> }) {
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, index) => (
        <Collapsible
          key={faq.q}
          defaultOpen={index === 0}
          className="group/faq rounded-xl border"
        >
          <div className="flex items-center gap-2 p-2 pl-4">
            <Badge variant="outline">FAQ {index + 1}</Badge>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto min-w-0 flex-1 justify-between py-2 text-left whitespace-normal"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDownIcon
                  data-icon="inline-end"
                  className="transition-transform group-data-[state=open]/faq:rotate-180"
                />
              </Button>
            </CollapsibleTrigger>
            <CopyButton text={faqText(faq)} label={`Copy FAQ ${index + 1}`} />
          </div>
          <CollapsibleContent className="px-4 pb-4 leading-relaxed text-muted-foreground">
            {faq.a}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

export function GeneratedOutput({ generation }: { generation: AiGeneration }) {
  const { copy, messages, posts, faqs } = generation.content
  if (copy) return <CopyOutput copy={copy} />
  if (messages) return <WhatsAppOutput messages={messages} />
  if (posts)
    return <SocialOutput posts={posts} platform={generation.input.platform} />
  return <FaqOutput faqs={faqs ?? []} />
}

export function GeneratedOutputSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-xl border p-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}
