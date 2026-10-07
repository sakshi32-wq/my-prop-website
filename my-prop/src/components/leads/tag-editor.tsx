import { useState } from "react"
import { PlusIcon, XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { QUICK_TAGS } from "@/lib/mock-data"

const QUICK_TAG_SET = new Set<string>(QUICK_TAGS)

export function RemovableTags({
  tags,
  onRemove,
}: {
  tags: Array<string>
  onRemove: (tag: string) => void
}) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" asChild>
          <button
            type="button"
            onClick={() => onRemove(tag)}
            aria-label={`Remove tag ${tag}`}
          >
            {tag}
            <XIcon data-icon="inline-end" />
          </button>
        </Badge>
      ))}
    </div>
  )
}

export function CustomTagInput({
  onAdd,
  id,
}: {
  onAdd: (tag: string) => void
  id?: string
}) {
  const [value, setValue] = useState("")

  const add = () => {
    const tag = value.trim()
    if (!tag) return
    onAdd(tag)
    setValue("")
  }

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        placeholder="Add custom tag..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            add()
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={add} disabled={!value.trim()}>
          <PlusIcon data-icon="inline-start" />
          Add
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

/** Quick-tag toggles + custom tag input + the list of selected tags. */
export function TagEditor({
  tags,
  onChange,
  quickTags = QUICK_TAGS,
}: {
  tags: Array<string>
  onChange: (tags: Array<string>) => void
  quickTags?: ReadonlyArray<string>
}) {
  const quickSelected = tags.filter((t) => QUICK_TAG_SET.has(t))
  const custom = tags.filter((t) => !QUICK_TAG_SET.has(t))

  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="multiple"
        variant="outline"
        size="sm"
        className="flex-wrap"
        aria-label="Quick tags"
        value={quickSelected}
        onValueChange={(value) => onChange([...custom, ...value])}
      >
        {quickTags.map((tag) => (
          <ToggleGroupItem key={tag} value={tag}>
            {tag}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <CustomTagInput
        onAdd={(tag) => {
          if (!tags.includes(tag)) onChange([...tags, tag])
        }}
      />
      <RemovableTags
        tags={tags}
        onRemove={(tag) => onChange(tags.filter((t) => t !== tag))}
      />
    </div>
  )
}
