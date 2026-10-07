import { useId, useState } from "react"
import {
  EyeIcon,
  FileIcon,
  FileTextIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "@/lib/utils"

import { uid } from "./tree-utils"
import { formatFileSize } from "./website-info"
import type { UploadedFile } from "./website-info"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPT = "image/*,.pdf,.doc,.docx"

export function WebsiteInfoFiles({
  files,
  onChange,
}: {
  files: Array<UploadedFile>
  onChange: (files: Array<UploadedFile>) => void
}) {
  const inputId = useId()
  const [dragging, setDragging] = useState(false)

  function addFiles(list: FileList | null) {
    if (!list?.length) return
    const accepted: Array<UploadedFile> = []
    const rejected: Array<string> = []
    for (const file of Array.from(list)) {
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(file.name)
        continue
      }
      accepted.push({
        id: uid(),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      })
    }
    if (rejected.length) {
      toast.error(`${rejected.length} file(s) exceed 10MB`, {
        description: rejected.join(", "),
      })
    }
    if (accepted.length) onChange([...files, ...accepted])
  }

  function removeFile(id: string) {
    onChange(files.filter((f) => f.id !== id))
  }

  function clearAll() {
    onChange([])
  }

  return (
    <FieldSet>
      <FieldLegend>Uploaded Files</FieldLegend>
      <FieldDescription>
        Manage images, brochures, and documents.
      </FieldDescription>

      <Empty
        className={cn("border", dragging && "border-primary bg-muted")}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
      >
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UploadIcon />
          </EmptyMedia>
          <EmptyTitle>Click to upload or drag and drop</EmptyTitle>
          <EmptyDescription>
            Images, PDFs, Word documents (Max 10MB each)
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <input
            id={inputId}
            type="file"
            multiple
            accept={ACCEPT}
            className="sr-only"
            onChange={(event) => {
              addFiles(event.target.files)
              // Allow re-selecting the same file after removing it.
              event.target.value = ""
            }}
          />
          <Button variant="outline" size="sm" asChild>
            <label htmlFor={inputId} className="cursor-pointer">
              Browse files
            </label>
          </Button>
        </EmptyContent>
      </Empty>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Uploaded Files ({files.length})
            </span>
            <Button variant="ghost" size="xs" onClick={clearAll}>
              <XIcon data-icon="inline-start" />
              Clear all
            </Button>
          </div>
          <ItemGroup className="gap-2">
            {files.map((file) => (
              <Item key={file.id} variant="outline" size="sm">
                {file.preview ? (
                  <ItemMedia variant="image">
                    <img src={file.preview} alt={file.name} />
                  </ItemMedia>
                ) : (
                  <ItemMedia variant="icon">
                    {file.type.includes("pdf") ? (
                      <FileTextIcon />
                    ) : (
                      <FileIcon />
                    )}
                  </ItemMedia>
                )}
                <ItemContent className="min-w-0">
                  <ItemTitle className="w-full truncate">{file.name}</ItemTitle>
                  <ItemDescription className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                    </Badge>
                    {formatFileSize(file.size)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  {file.preview && (
                    <Button variant="ghost" size="icon-sm" asChild>
                      <a
                        href={file.preview}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${file.name}`}
                      >
                        <EyeIcon />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => removeFile(file.id)}
                  >
                    <XIcon />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </div>
      )}
    </FieldSet>
  )
}
