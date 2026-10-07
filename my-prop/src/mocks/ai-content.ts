// Server-side "AI" for POST /ai/generate: canned content derived from the
// form input, the way a real model call would return it.
import type {
  AiContent,
  AiContentInput,
  AiContentTool,
  AiCopy,
  AiFaq,
  AiGeneration,
  AiSocialPost,
  AiTitledText,
} from "@/api/generated/model"
import {
  faqText,
  platformLabel,
  socialPostText,
} from "@/components/ai-studio/content"

type ContentFormData = AiContentInput

const PROPERTY_NOUNS: Record<string, string> = {
  apartment: "apartment",
  villa: "villa",
  penthouse: "penthouse",
  commercial: "commercial space",
  plot: "plot",
}

const TONE_TAGLINES: Record<string, string> = {
  luxury: "Where Luxury Meets Comfort in the Heart of",
  budget: "Affordable, Comfortable Living in the Heart of",
  investor: "A Smart Investment in the Heart of",
  family: "A Home Your Whole Family Will Love in the Heart of",
}

const DEFAULT_FEATURES = ["Swimming Pool", "Gym", "Security"]

function parseFeatures(features: string) {
  const list = features
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean)
  return list.length > 0 ? list : DEFAULT_FEATURES
}

function propertyNoun(data: ContentFormData) {
  return PROPERTY_NOUNS[data.propertyType] ?? data.propertyType
}

function buildCopy(data: ContentFormData): AiCopy {
  const name = data.projectName
  const location = data.location
  const tagline = TONE_TAGLINES[data.tone] ?? TONE_TAGLINES.luxury
  return {
    hero: {
      headline: `Welcome to ${name}`,
      tagline: `${tagline} ${location}`,
      description: `Experience premium living at ${name}, ${location}'s newest landmark in luxury residential development. Perfectly designed for ${data.targetAudience || "discerning buyers"}, our thoughtfully crafted ${propertyNoun(data)}s offer the perfect blend of contemporary design and timeless elegance.`,
    },
    about: {
      title: `About ${name}`,
      paragraphs: [
        `${name} redefines modern living with its exceptional architecture and world-class amenities. Located in the vibrant neighborhood of ${location}, this premium development offers unparalleled connectivity to major business districts, entertainment hubs, and educational institutions.`,
        `Each residence is meticulously designed to maximize space, natural light, and ventilation, creating a living environment that promotes wellness and tranquility. With state-of-the-art facilities and 24/7 security, ${name} ensures a lifestyle that's both comfortable and secure.`,
      ],
    },
    features: parseFeatures(data.features),
    cta: {
      title: "Your Dream Home Awaits",
      body: `Don't miss this opportunity to be part of ${location}'s most prestigious address. Schedule a site visit today and experience luxury living firsthand.`,
    },
  }
}

const WHATSAPP_OPENERS: Record<string, string> = {
  launch: "Exciting news! We're launching",
  sitevisit: "We'd love to show you around",
  offer: "We have an exclusive offer on",
  followup: "Thanks for your interest in",
}

function buildWhatsApp(data: ContentFormData): Array<AiTitledText> {
  const name = data.projectName
  const opener = WHATSAPP_OPENERS[data.campaignGoal] ?? WHATSAPP_OPENERS.launch
  return [
    {
      title: "Initial Message",
      content: `Hi {name}! 👋\n\n${opener} ${name} in ${data.location}.\n\n🏡 Premium ${propertyNoun(data)}s\n✨ World-class amenities\n📍 Prime location\n\nInterested in learning more? Reply YES!`,
    },
    {
      title: "Follow-up Message (Day 2)",
      content: `Hello {name},\n\nJust following up on ${name}. We're offering exclusive pre-launch pricing for early birds!\n\nWould you like to schedule a site visit this weekend?\n\nCall us: +91-XXXXXXXXXX`,
    },
    {
      title: "Final Reminder",
      content: `Hi {name},\n\nLast chance! Only a few units left at ${name} with special pricing.\n\n⚡ Limited time offer\n🎁 Exclusive benefits for early buyers\n\nBook your site visit today!\n\nTeam ${name}`,
    },
  ]
}

function socialTemplates(data: ContentFormData): Array<AiSocialPost> {
  const name = data.projectName
  const noun = propertyNoun(data)
  const features = parseFeatures(data.features)
  return [
    {
      title: "Launch Announcement",
      content: `🏡 Introducing ${name}! ✨\n\nDiscover luxury living in the heart of ${data.location}. Premium ${noun}s designed for modern lifestyle.\n\n${features
        .slice(0, 3)
        .map((feature) => `✓ ${feature}`)
        .join("\n")}\n\n📞 Book your site visit today!`,
      hashtags: ["#RealEstate", "#LuxuryHomes", "#NewLaunch"],
    },
    {
      title: "Amenities Showcase",
      content: `Life at ${name} means waking up to:\n\n${features
        .slice(0, 4)
        .map((feature, index) => `${index + 1}. ${feature}`)
        .join(
          "\n"
        )}\n\nAnd so much more! 🌟\n\nExperience the lifestyle you deserve.`,
      hashtags: ["#LuxuryLiving", "#PropertyGoals"],
    },
    {
      title: "Limited Offer",
      content: `⚡ EXCLUSIVE OFFER ALERT! ⚡\n\nPre-launch prices at ${name}!\n\n🎁 Special pricing for early birds\n📍 ${data.location}\n💎 Premium ${noun}s\n\nDon't miss out! Limited units available.\n\nDM us or call now! 📞`,
      hashtags: ["#LimitedOffer", "#RealEstateDeals"],
    },
    {
      title: "Location Highlight",
      content: `📍 Why ${data.location}?\n\nEverything you need is minutes away from ${name}:\n\n🏢 Major business districts\n🏫 Top schools & colleges\n🏥 Leading hospitals\n🛍️ Shopping & entertainment\n\nLive connected. Live better.`,
      hashtags: ["#PrimeLocation", "#ConnectedLiving"],
    },
    {
      title: "Site Visit Invite",
      content: `🗓️ This weekend, see ${name} for yourself!\n\nWalk through our sample ${noun}, explore the amenities and meet our team in ${data.location}.\n\n☕ Complimentary refreshments\n🚗 Free pick-up & drop\n\nReserve your slot today!`,
      hashtags: ["#SiteVisit", "#HomeBuying"],
    },
  ]
}

const VARIATION_OPENERS = [
  "🔁 In case you missed it!",
  "✨ Still looking for the one?",
]

function buildSocialPosts(data: ContentFormData): Array<AiSocialPost> {
  const templates = socialTemplates(data)
  const count = Number(data.numPosts) || 3
  const projectTag = `#${data.projectName.replace(/[^a-zA-Z0-9]/g, "")}`
  return Array.from({ length: count }, (_, index) => {
    const template = templates[index % templates.length]
    const round = Math.floor(index / templates.length)
    if (round === 0) return template
    // Later rounds vary the opener and title so posts aren't exact repeats.
    return {
      title: `${template.title} (Variation ${round + 1})`,
      content: `${VARIATION_OPENERS[(round - 1) % VARIATION_OPENERS.length]}\n\n${template.content}`,
      hashtags: [...template.hashtags, projectTag],
    }
  })
}

function buildFaqs(data: ContentFormData): Array<AiFaq> {
  const name = data.projectName
  return [
    {
      q: `What is ${name}?`,
      a: `${name} is a premium ${propertyNoun(data)} development located in ${data.location}. It offers modern living spaces with world-class amenities designed for ${data.targetAudience || "modern families"}.`,
    },
    {
      q: "What are the available configurations?",
      a: "We offer various configurations to suit different family sizes and requirements. Each unit is thoughtfully designed to maximize space and natural light.",
    },
    {
      q: "What amenities are included?",
      a: `${name} features premium amenities including ${parseFeatures(
        data.features
      )
        .slice(0, 4)
        .join(", ")} and much more.`,
    },
    {
      q: "What is the location advantage?",
      a: `Located in ${data.location}, the project offers excellent connectivity to major business hubs, educational institutions, healthcare facilities, and entertainment zones.`,
    },
    {
      q: "How can I schedule a site visit?",
      a: "You can schedule a site visit by calling our sales team or filling out the contact form on our website. We offer personalized tours at your convenience.",
    },
    {
      q: "What are the payment plans available?",
      a: "We offer flexible payment plans tailored to your needs. Our team can discuss various options including construction-linked plans and special financing schemes.",
    },
  ]
}

/** The whole generation as plain text, for drafts, copying and downloads. */
function toPlainText(
  data: ContentFormData,
  { copy, messages, posts, faqs }: AiContent
) {
  if (copy)
    return [
      `${copy.hero.headline}\n${copy.hero.tagline}`,
      copy.hero.description,
      `${copy.about.title}\n\n${copy.about.paragraphs.join("\n\n")}`,
      `Amenities\n${copy.features.map((feature) => `- ${feature}`).join("\n")}`,
      `${copy.cta.title}\n${copy.cta.body}`,
    ].join("\n\n")
  if (messages)
    return messages
      .map(
        (message, index) =>
          `Message ${index + 1}: ${message.title}\n\n${message.content}`
      )
      .join("\n\n---\n\n")
  if (posts) {
    const platform = platformLabel(data.platform)
    return posts
      .map(
        (post, index) =>
          `${platform} Post ${index + 1}: ${post.title}\n\n${socialPostText(post)}`
      )
      .join("\n\n---\n\n")
  }
  return (faqs ?? []).map(faqText).join("\n\n")
}

function generationTitle(tool: AiContentTool, projectName: string) {
  const labels: Record<AiContentTool, string> = {
    copy: "Property Copy",
    whatsapp: "WhatsApp Campaign",
    social: "Social Media Posts",
    faq: "FAQ",
  }
  return `${labels[tool]} - ${projectName}`
}

export function generateContent(
  tool: AiContentTool,
  input: AiContentInput
): AiGeneration {
  const content: AiContent =
    tool === "copy"
      ? { copy: buildCopy(input) }
      : tool === "whatsapp"
        ? { messages: buildWhatsApp(input) }
        : tool === "social"
          ? { posts: buildSocialPosts(input) }
          : { faqs: buildFaqs(input) }
  return {
    tool,
    input,
    title: generationTitle(tool, input.projectName),
    content,
    plainText: toPlainText(input, content),
  }
}
