import {
  BellIcon,
  ClockIcon,
  FilterIcon,
  MailIcon,
  MessageSquareIcon,
  SmartphoneIcon,
  StarIcon,
  TagIcon,
  UsersIcon,
  WebhookIcon,
  ZapIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type StepType =
  | "trigger"
  | "whatsapp"
  | "email"
  | "sms"
  | "wait"
  | "condition"
  | "assign"
  | "tag"
  | "score"
  | "notification"
  | "webhook"

export type DelayUnit = "minutes" | "hours" | "days"

export type StepConfig = {
  trigger?: string
  message?: string
  subject?: string
  delay?: number
  delayUnit?: DelayUnit
  condition?: string
  assignTo?: string
  tagName?: string
  scoreValue?: number
  notifyWho?: string
  webhookUrl?: string
}

export type AutomationStep = {
  id: string
  type: StepType
  name: string
  description: string
  config: StepConfig
}

export const STEP_TYPES: Record<
  StepType,
  { name: string; description: string; icon: LucideIcon }
> = {
  trigger: {
    name: "Trigger",
    description: "Starts the automation",
    icon: ZapIcon,
  },
  whatsapp: {
    name: "WhatsApp Message",
    description: "Send a WhatsApp message",
    icon: MessageSquareIcon,
  },
  email: { name: "Email", description: "Send an email", icon: MailIcon },
  sms: {
    name: "SMS",
    description: "Send a text message",
    icon: SmartphoneIcon,
  },
  wait: {
    name: "Wait/Delay",
    description: "Pause before the next step",
    icon: ClockIcon,
  },
  condition: {
    name: "Condition",
    description: "Branch on lead behaviour",
    icon: FilterIcon,
  },
  assign: {
    name: "Assign to Agent",
    description: "Route the lead to your team",
    icon: UsersIcon,
  },
  tag: { name: "Add Tag", description: "Label the lead", icon: TagIcon },
  score: {
    name: "Update Score",
    description: "Raise or lower lead score",
    icon: StarIcon,
  },
  notification: {
    name: "Send Notification",
    description: "Alert someone on your team",
    icon: BellIcon,
  },
  webhook: {
    name: "Webhook",
    description: "Call an external URL",
    icon: WebhookIcon,
  },
}

export const ADDABLE_STEP_TYPES = (
  Object.keys(STEP_TYPES) as StepType[]
).filter((t) => t !== "trigger")

export const TRIGGER_OPTIONS = [
  {
    value: "new_lead",
    label: "New Lead Captured",
    description: "When a new lead is captured",
  },
  {
    value: "form_submit",
    label: "Form Submitted",
    description: "When a website form is submitted",
  },
  {
    value: "website_visit",
    label: "Website Visit",
    description: "When a lead visits a property website",
  },
  {
    value: "lead_stage",
    label: "Lead Stage Changed",
    description: "When a lead moves to a new pipeline stage",
  },
]

export const CONDITION_OPTIONS = [
  { value: "replied", label: "Lead Replied" },
  { value: "not_replied", label: "Lead Not Replied" },
  { value: "opened", label: "Message Opened" },
  { value: "clicked", label: "Link Clicked" },
  { value: "score", label: "Lead Score > X" },
]

export const ASSIGN_OPTIONS = [
  { value: "round_robin", label: "Next Available (Round Robin)" },
  { value: "least_busy", label: "Least Busy Agent" },
  { value: "specific", label: "Specific Agent" },
  { value: "team", label: "Specific Team" },
]

export const NOTIFY_OPTIONS = [
  { value: "assigned_agent", label: "Assigned Agent" },
  { value: "sales_manager", label: "Sales Manager" },
  { value: "whole_team", label: "Whole Team" },
]

export const DELAY_UNITS: { value: DelayUnit; label: string }[] = [
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
]

function labelFor(list: { value: string; label: string }[], value?: string) {
  return list.find((o) => o.value === value)?.label
}

export function defaultConfig(type: StepType): StepConfig {
  switch (type) {
    case "trigger":
      return { trigger: "new_lead" }
    case "wait":
      return { delay: 1, delayUnit: "hours" }
    case "condition":
      return { condition: "replied" }
    case "assign":
      return { assignTo: "round_robin" }
    case "score":
      return { scoreValue: 10 }
    case "notification":
      return { notifyWho: "assigned_agent" }
    default:
      return {}
  }
}

export function createStep(type: StepType): AutomationStep {
  const meta = STEP_TYPES[type]
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    name: meta.name,
    description: `New ${meta.name}`,
    config: defaultConfig(type),
  }
}

function truncate(text: string, max = 28) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/** Short, human readable summaries of a step's configuration. */
export function configBadges(step: AutomationStep): string[] {
  const c = step.config
  switch (step.type) {
    case "trigger":
      return [labelFor(TRIGGER_OPTIONS, c.trigger) ?? "No trigger"]
    case "whatsapp":
    case "sms":
      return [c.message ? `${c.message.length} characters` : "No message yet"]
    case "email":
      return [
        c.subject ? `Subject: ${truncate(c.subject)}` : "No subject",
        c.message ? `${c.message.length} characters` : "No message yet",
      ]
    case "wait":
      return [`Delay: ${c.delay ?? 1} ${c.delayUnit ?? "hours"}`]
    case "condition":
      return [labelFor(CONDITION_OPTIONS, c.condition) ?? "No condition"]
    case "assign":
      return [labelFor(ASSIGN_OPTIONS, c.assignTo) ?? "Not assigned"]
    case "tag":
      return [c.tagName ? `Tag: ${truncate(c.tagName)}` : "No tag"]
    case "score": {
      const v = c.scoreValue ?? 0
      return [`Score ${v >= 0 ? "+" : ""}${v}`]
    }
    case "notification":
      return [`Notify: ${labelFor(NOTIFY_OPTIONS, c.notifyWho) ?? "Nobody"}`]
    case "webhook":
      return [c.webhookUrl ? truncate(c.webhookUrl, 36) : "No URL"]
  }
}

export function initialSteps(): AutomationStep[] {
  return [
    {
      id: "trigger",
      type: "trigger",
      name: "Trigger",
      description: "When a new lead is captured",
      config: { trigger: "new_lead" },
    },
    {
      id: "welcome",
      type: "whatsapp",
      name: "Welcome Message",
      description: "Greet the lead on WhatsApp",
      config: {
        message:
          "Hi {name}! 👋 Thanks for your interest in {project}. Would you like the brochure and price list?",
      },
    },
    {
      id: "wait-1",
      type: "wait",
      name: "Wait/Delay",
      description: "Give the lead time to respond",
      config: { delay: 1, delayUnit: "days" },
    },
    {
      id: "assign-1",
      type: "assign",
      name: "Assign to Agent",
      description: "Route the lead to the sales team",
      config: { assignTo: "round_robin" },
    },
  ]
}
