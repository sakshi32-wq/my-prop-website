import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { LeadSummary } from "./lead-summary"
import { optimisticLeadUpdate } from "./optimistic"
import { CustomTagInput, RemovableTags } from "./tag-editor"
import type { Lead } from "./data"
import { useUpdateLead } from "@/api/generated/leads/leads"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"

const TAG_GROUPS: Array<{ heading: string; tags: Array<string> }> = [
  {
    heading: "Lead Quality",
    tags: ["Hot Lead", "Warm Lead", "Cold Lead", "High Priority"],
  },
  {
    heading: "Buyer Type",
    tags: [
      "First Time Buyer",
      "Investor",
      "NRI",
      "End User",
      "Budget Conscious",
      "Ready to Buy",
      "Needs Financing",
      "Cash Buyer",
      "Resale Interest",
    ],
  },
  {
    heading: "Property Type",
    tags: [
      "1BHK",
      "2BHK",
      "3BHK",
      "4BHK",
      "Penthouse",
      "Villa",
      "Plot",
      "Commercial",
    ],
  },
  {
    heading: "Status",
    tags: [
      "Follow Up Today",
      "Follow Up This Week",
      "Site Visit Scheduled",
      "Documentation Pending",
      "Negotiating Price",
      "Token Amount Paid",
    ],
  },
]

function TagsForm({
  lead,
  onSave,
}: {
  lead: Lead
  onSave: (tags: Array<string>) => void
}) {
  const [tags, setTags] = useState<Array<string>>(lead.tags)

  const toggle = (tag: string) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )

  return (
    <>
      <LeadSummary
        lead={lead}
        description={[lead.project, lead.budget].filter(Boolean).join(" • ")}
      />
      <FieldGroup>
        <Field>
          <FieldTitle>Selected Tags ({tags.length})</FieldTitle>
          {tags.length > 0 ? (
            <RemovableTags
              tags={tags}
              onRemove={(tag) =>
                setTags((prev) => prev.filter((t) => t !== tag))
              }
            />
          ) : (
            <FieldDescription>No tags yet. Pick some below.</FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="custom-tag">Add Custom Tag</FieldLabel>
          <CustomTagInput
            id="custom-tag"
            onAdd={(tag) => {
              if (!tags.includes(tag)) setTags((prev) => [...prev, tag])
            }}
          />
        </Field>
        <Field>
          <FieldTitle>Quick Tags</FieldTitle>
          <Command className="border">
            <CommandInput placeholder="Search tags..." />
            <CommandList className="max-h-56">
              <CommandEmpty>No matching tags found.</CommandEmpty>
              {TAG_GROUPS.map((group) => (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {group.tags.map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      data-checked={tags.includes(tag)}
                      onSelect={() => toggle(tag)}
                    >
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={() => onSave(tags)}>
          <SaveIcon data-icon="inline-start" />
          Save Tags
        </Button>
      </DialogFooter>
    </>
  )
}

export function AddTagsDialog({
  open,
  onOpenChange,
  lead,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
}) {
  const queryClient = useQueryClient()
  const updateLead = useUpdateLead({
    mutation: {
      ...optimisticLeadUpdate(queryClient),
      onSuccess: ({ name, tags }) =>
        toast.success("Tags updated", {
          description: `${tags.length} tag${tags.length === 1 ? "" : "s"} saved for ${name}.`,
        }),
    },
  })

  return (
    <Dialog open={open && !!lead} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Add or remove tags for {lead?.name ?? "this lead"}
          </DialogDescription>
        </DialogHeader>
        {lead && (
          <TagsForm
            key={lead.id}
            lead={lead}
            onSave={(tags) => {
              updateLead.mutate({ leadId: lead.id, data: { tags } })
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
