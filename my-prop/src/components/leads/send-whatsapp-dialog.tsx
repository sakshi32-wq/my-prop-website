import { useState } from "react"
import { SendIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { firstName, phoneDigits } from "./data"
import type { Lead } from "./data"
import { useSendLeadMessage } from "@/api/generated/leads/leads"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Message, MessageContent } from "@/components/ui/message"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const TEMPLATES = [
  {
    id: "visit",
    name: "Site Visit Invitation",
    message:
      "Hi {name}, thank you for your interest in {project}. We'd love to show you around! Are you available for a site visit this weekend? Our team can arrange a personalized tour.",
  },
  {
    id: "follow-up",
    name: "Follow Up",
    message:
      "Hi {name}, I wanted to follow up on your inquiry about {project}. Do you have any questions? I'm here to help you find your dream home!",
  },
  {
    id: "offer",
    name: "Special Offer",
    message:
      "Hi {name}, we have an exclusive limited-time offer on {project}! Book now and get special pricing. Would you like to schedule a call to discuss?",
  },
  {
    id: "payment",
    name: "Payment Plan Info",
    message:
      "Hi {name}, we offer flexible payment plans for {project} that can fit your budget of {budget}. Shall I share the detailed payment structure with you?",
  },
]

function fill(template: string, lead: Lead) {
  return template
    .replaceAll("{name}", firstName(lead.name))
    .replaceAll("{project}", lead.project || "our projects")
    .replaceAll("{budget}", lead.budget || "your range")
}

export function aiSuggestedReply(lead: Lead) {
  return `Hi ${firstName(lead.name)}, thank you for your interest in ${lead.project || "our projects"}. I'd love to schedule a site visit for you. Are you available this weekend?`
}

function aiGeneratedMessage(lead: Lead) {
  const budget = lead.budget ? ` with a budget of ${lead.budget}` : ""
  return `Hi ${firstName(lead.name)}, I noticed you're interested in ${lead.project || "our projects"}${budget}. I'd love to help you find the perfect property that matches your requirements. When would be a good time for us to discuss this further?`
}

function Composer({
  lead,
  initialMessage,
  onSent,
}: {
  lead: Lead
  initialMessage: string
  onSent: (text: string) => void
}) {
  const [message, setMessage] = useState(initialMessage)
  const [template, setTemplate] = useState("")

  const handleSend = () => {
    const text = message.trim()
    if (!text) return
    const digits = phoneDigits(lead.phone)
    if (!digits) {
      toast.error("This lead has no valid phone number.")
      return
    }
    window.open(
      `https://wa.me/${digits}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    )
    toast.success("Opening WhatsApp", {
      description: `Message to ${lead.name} is ready to send.`,
    })
    onSent(text)
  }

  return (
    <>
      <FieldGroup>
        <Field>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <FieldTitle id="wa-templates">Quick Templates</FieldTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMessage(aiGeneratedMessage(lead))
                setTemplate("")
              }}
            >
              <SparklesIcon data-icon="inline-start" />
              AI Generate
            </Button>
          </div>
          <RadioGroup
            aria-labelledby="wa-templates"
            className="grid gap-2 sm:grid-cols-2"
            value={template}
            onValueChange={(id) => {
              const t = TEMPLATES.find((item) => item.id === id)
              if (!t) return
              setTemplate(id)
              setMessage(fill(t.message, lead))
            }}
          >
            {TEMPLATES.map((t) => (
              <FieldLabel key={t.id} htmlFor={`wa-${t.id}`}>
                <Field orientation="horizontal">
                  <FieldContent className="min-w-0">
                    <FieldTitle>{t.name}</FieldTitle>
                    <FieldDescription className="line-clamp-2">
                      {fill(t.message, lead)}
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={t.id} id={`wa-${t.id}`} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="wa-message">Your Message</FieldLabel>
          <Textarea
            id="wa-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              setTemplate("")
            }}
            placeholder="Type your message here..."
            rows={6}
            className="resize-none"
          />
          <div className="flex items-center justify-between gap-2">
            <FieldDescription>{message.length} characters</FieldDescription>
            {message.trim() && <Badge variant="secondary">Ready to send</Badge>}
          </div>
        </Field>
        {message.trim() && (
          <Field>
            <FieldTitle>Preview</FieldTitle>
            <div className="rounded-lg bg-muted p-3">
              <Message align="end">
                <MessageContent>
                  <Bubble variant="tinted">
                    <BubbleContent className="whitespace-pre-wrap">
                      {message}
                    </BubbleContent>
                  </Bubble>
                </MessageContent>
              </Message>
            </div>
          </Field>
        )}
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleSend} disabled={!message.trim()}>
          <SendIcon data-icon="inline-start" />
          Send via WhatsApp
        </Button>
      </DialogFooter>
    </>
  )
}

export function SendWhatsAppDialog({
  open,
  onOpenChange,
  lead,
  initialMessage = "",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
  initialMessage?: string
}) {
  // WhatsApp opens on the click itself (popup blockers); this only records
  // the message on the lead's timeline.
  const sendMessage = useSendLeadMessage()

  return (
    <Dialog open={open && !!lead} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Send WhatsApp Message</DialogTitle>
          <DialogDescription>
            Send a message to {lead?.name ?? "this lead"}
            {lead?.phone ? ` at ${lead.phone}` : ""}
          </DialogDescription>
        </DialogHeader>
        {lead && (
          <Composer
            key={lead.id}
            lead={lead}
            initialMessage={initialMessage}
            onSent={(text) => {
              sendMessage.mutate({
                leadId: lead.id,
                data: { channel: "whatsapp", text },
              })
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
