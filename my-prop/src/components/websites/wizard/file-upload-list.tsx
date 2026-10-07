import { useRef, useState } from "react"
import {
  EyeIcon,
  FileIcon,
  FileTextIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"

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
import { FieldTitle } from "@/components/ui/field"
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

import { formatFileSize } from "./types"
import type { UploadedFile } from "./types"

function fileTypeLabel(file: UploadedFile) {
  const subtype = file.type.split("/")[1]
  if (subtype) return subtype.toUpperCase()
  const extension = file.name.split(".").pop()
  return extension && extension !== file.name ? extension.toUpperCase() : "FILE"
}

export function FileUploadList({
  files,
  onAddFiles,
  onRemove,
  onClear,
}: {
  files: Array<UploadedFile>
  onAddFiles: (files: Array<File>) => void
  onRemove: (id: string) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <FieldTitle>Upload Files (Images, PDFs, Documents)</FieldTitle>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          onAddFiles(Array.from(e.target.files ?? []))
          // Allow picking the same file again after removing it.
          e.target.value = ""
        }}
      />
      <Empty
        className={cn("border bg-muted/30", dragging && "border-ring bg-muted")}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          onAddFiles(Array.from(e.dataTransfer.files))
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon data-icon="inline-start" />
            Choose Files
          </Button>
        </EmptyContent>
      </Empty>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <FieldTitle>Uploaded Files ({files.length})</FieldTitle>
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              <XIcon data-icon="inline-start" />
              Clear all
            </Button>
          </div>
          <ItemGroup className="max-h-64 gap-2 overflow-y-auto">
            {files.map((file) => (
              <Item key={file.id} variant="outline" size="sm" role="listitem">
                {file.preview ? (
                  <ItemMedia variant="image">
                    <img src={file.preview} alt="" />
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
                  <ItemTitle className="w-full">
                    <span className="truncate">{file.name}</span>
                  </ItemTitle>
                  <ItemDescription className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary">{fileTypeLabel(file)}</Badge>
                    {formatFileSize(file.size)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="gap-1">
                  {file.preview && (
                    <Button variant="ghost" size="icon-sm" asChild>
                      <a
                        href={file.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Preview ${file.name}`}
                      >
                        <EyeIcon />
                      </a>
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => onRemove(file.id)}
                  >
                    <XIcon />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </div>
      )}
    </div>
  )
}
