import { isSectionArray } from "./tree-utils"
import type { Section } from "./types"
import type { WebsiteInfo } from "./website-info"

const STORAGE_PREFIX = "myprop:website-builder:"

type StoredDraft = {
  version: 1
  savedAt: string
  sections: Array<Section>
  info: WebsiteInfo
}

/** Object URLs only live for the current session, so never persist them. */
export function serializableInfo(info: WebsiteInfo): WebsiteInfo {
  return {
    ...info,
    uploadedFiles: info.uploadedFiles.map(
      ({ preview: _preview, ...file }) => file
    ),
  }
}

export function saveDraft(
  websiteId: string,
  sections: Array<Section>,
  info: WebsiteInfo
) {
  const draft: StoredDraft = {
    version: 1,
    savedAt: new Date().toISOString(),
    sections,
    info: serializableInfo(info),
  }
  localStorage.setItem(STORAGE_PREFIX + websiteId, JSON.stringify(draft))
}

/** Returns null when nothing is stored; throws on corrupt data. */
export function loadDraft(
  websiteId: string,
  defaults: WebsiteInfo
): { sections: Array<Section>; info: WebsiteInfo; savedAt?: string } | null {
  const raw = localStorage.getItem(STORAGE_PREFIX + websiteId)
  if (!raw) return null
  const parsed = JSON.parse(raw) as Partial<StoredDraft> | null
  if (!parsed || !isSectionArray(parsed.sections)) {
    throw new Error("Invalid builder draft")
  }
  const rawInfo: unknown = parsed.info
  const storedInfo: Partial<WebsiteInfo> =
    typeof rawInfo === "object" &&
    rawInfo !== null &&
    typeof (rawInfo as Partial<WebsiteInfo>).projectName === "string"
      ? rawInfo
      : {}
  return {
    sections: parsed.sections,
    info: {
      ...defaults,
      ...storedInfo,
      additionalContent: {
        ...defaults.additionalContent,
        ...storedInfo.additionalContent,
      },
    },
    savedAt: parsed.savedAt,
  }
}
