import type {
  WebsiteInfo as SavedWebsiteInfo,
  WebsiteFile,
} from "@/api/generated/model"

export type UploadedFile = WebsiteFile & {
  /** Object URL for image previews (session only, never sent to the API). */
  preview?: string
}

/** The API's project info, plus session-only file previews. */
export type WebsiteInfo = Omit<SavedWebsiteInfo, "uploadedFiles"> & {
  uploadedFiles: Array<UploadedFile>
}

/** Strips the session-only object URLs before saving or exporting. */
export function serializableInfo(info: WebsiteInfo): SavedWebsiteInfo {
  return {
    ...info,
    uploadedFiles: info.uploadedFiles.map(
      ({ preview: _preview, ...file }) => file
    ),
  }
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  )
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}
