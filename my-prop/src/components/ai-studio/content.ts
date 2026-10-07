// Display helpers for generated content (the content itself comes from
// POST /ai/generate).
import { SOCIAL_PLATFORMS } from "./data"
import type { AiFaq, AiSocialPost } from "@/api/generated/model"

export type {
  AiCopy as CopyContent,
  AiFaq as Faq,
  AiSocialPost as SocialPost,
  AiTitledText as TitledText,
} from "@/api/generated/model"

export function platformLabel(value: string) {
  return (
    SOCIAL_PLATFORMS.find((platform) => platform.value === value)?.label ??
    value
  )
}

export function socialPostText(post: AiSocialPost) {
  return `${post.content}\n\n${post.hashtags.join(" ")}`
}

export function faqText(faq: AiFaq) {
  return `Q: ${faq.q}\nA: ${faq.a}`
}
