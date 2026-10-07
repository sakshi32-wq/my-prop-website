import { useState } from "react"
import { CheckIcon, PencilIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function AutomationHeader({
  name,
  onNameChange,
  stepCount,
  action,
}: {
  name: string
  onNameChange: (name: string) => void
  stepCount: number
  action: React.ReactNode
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)

  function startEditing() {
    setValue(name)
    setEditing(true)
  }

  function commit() {
    const next = value.trim()
    if (next) onNameChange(next)
    setEditing(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:grid">
        {editing ? (
          <InputGroup className="max-w-md">
            <InputGroupInput
              autoFocus
              aria-label="Automation name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit()
                if (e.key === "Escape") setEditing(false)
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Cancel"
                onClick={() => setEditing(false)}
              >
                <XIcon />
              </InputGroupButton>
              <InputGroupButton
                size="icon-xs"
                aria-label="Save name"
                onClick={commit}
              >
                <CheckIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ) : (
          <CardTitle className="flex min-w-0 items-center gap-1 text-lg">
            <span className="truncate">{name}</span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Rename automation"
              onClick={startEditing}
            >
              <PencilIcon />
            </Button>
          </CardTitle>
        )}
        <CardDescription>
          {stepCount} step{stepCount === 1 ? "" : "s"} configured
        </CardDescription>
        <CardAction className="sm:self-center">{action}</CardAction>
      </CardHeader>
    </Card>
  )
}
