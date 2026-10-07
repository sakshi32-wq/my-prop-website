import { useState } from "react"
import { CopyIcon, KeyIcon, PlusIcon, TriangleAlertIcon } from "lucide-react"

import { copyToClipboard, randomToken } from "./utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type ApiKeyType = "production" | "development"

export type NewApiKey = { name: string; type: ApiKeyType; key: string }

const KEY_TYPES: Array<{
  value: ApiKeyType
  label: string
  description: string
}> = [
  {
    value: "production",
    label: "Production",
    description: "For live applications",
  },
  {
    value: "development",
    label: "Development",
    description: "For testing and development",
  },
]

export function GenerateApiKeyDialog({
  open,
  onOpenChange,
  onGenerate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (key: NewApiKey) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        {/* Remounts on every open, so the form always starts empty. */}
        <GenerateKeyFlow onGenerate={onGenerate} />
      </DialogContent>
    </Dialog>
  )
}

function GenerateKeyFlow({
  onGenerate,
}: {
  onGenerate: (key: NewApiKey) => void
}) {
  const [name, setName] = useState("")
  const [type, setType] = useState<ApiKeyType>("production")
  const [submitted, setSubmitted] = useState(false)
  const [generated, setGenerated] = useState<NewApiKey | null>(null)

  const nameError =
    submitted && !name.trim() ? "Key name is required." : undefined

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (!name.trim()) return
    const prefix = type === "production" ? "sk_live_" : "sk_test_"
    const key: NewApiKey = {
      name: name.trim(),
      type,
      key: prefix + randomToken(32),
    }
    onGenerate(key)
    setGenerated(key)
  }

  if (generated) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>API Key Created</DialogTitle>
          <DialogDescription>
            &ldquo;{generated.name}&rdquo; is ready to use.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="generatedKey">Your new API key</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <KeyIcon />
            </InputGroupAddon>
            <InputGroupInput
              id="generatedKey"
              readOnly
              value={generated.key}
              className="font-mono"
              onFocus={(e) => e.currentTarget.select()}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Copy API key"
                onClick={() => copyToClipboard(generated.key, "API key copied")}
              >
                <CopyIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>Copy this key now</AlertTitle>
          <AlertDescription>
            For your security, the full key won&apos;t be shown in this dialog
            again. Store it somewhere safe.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="contents">
      <DialogHeader>
        <DialogTitle>Generate New API Key</DialogTitle>
        <DialogDescription>
          Create a new API key for your application. Choose a name and type for
          the key.
        </DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field data-invalid={!!nameError}>
          <FieldLabel htmlFor="apiKeyName">Key Name</FieldLabel>
          <Input
            id="apiKeyName"
            placeholder="My Production Key"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!nameError}
          />
          {nameError ? (
            <FieldError>{nameError}</FieldError>
          ) : (
            <FieldDescription>
              A descriptive name for your API key
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="apiKeyType">Key Type</FieldLabel>
          <Select
            value={type}
            onValueChange={(value) => setType(value as ApiKeyType)}
          >
            <SelectTrigger id="apiKeyType" className="w-full">
              <SelectValue>
                {KEY_TYPES.find((t) => t.value === type)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {KEY_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{t.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>Before you continue</AlertTitle>
          <AlertDescription>
            <ul className="flex list-disc flex-col gap-1 pl-4">
              <li>Ensure you have a secure environment for storing API keys</li>
              <li>Do not share your API keys with unauthorized users</li>
              <li>Revoke keys if they are compromised</li>
            </ul>
          </AlertDescription>
        </Alert>
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">
          <PlusIcon data-icon="inline-start" />
          Generate Key
        </Button>
      </DialogFooter>
    </form>
  )
}
