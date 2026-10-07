import { useState } from "react"
import { PlugZapIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { IntegrationItem } from "./integration-item"
import { SecretInput } from "./secret-input"
import { useSimulatedRequest } from "./utils"
import type { IntegrationInfo } from "./integration-item"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ItemGroup } from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type ConnectionProps = {
  connected: Record<string, boolean>
  onConnectedChange: (integration: IntegrationInfo, connected: boolean) => void
}

/** A card listing one or more integrations that can be connected. */
export function IntegrationListCard({
  title,
  description,
  integrations,
  connected,
  onConnectedChange,
}: ConnectionProps & {
  title: string
  description: string
  integrations: Array<IntegrationInfo>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup
          className={cn(
            "gap-3",
            integrations.length > 1 && "md:grid md:grid-cols-2"
          )}
        >
          {integrations.map((integration) => (
            <IntegrationItem
              key={integration.id}
              integration={integration}
              connected={!!connected[integration.id]}
              onConnectedChange={(value) =>
                onConnectedChange(integration, value)
              }
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}

export type SettingField = {
  id: string
  label: string
  defaultValue: string
  secret?: boolean
  placeholder?: string
}

/** A single integration with settings that show once it is connected. */
export function ConfigurableIntegrationCard({
  title,
  description,
  integration,
  fields,
  connected,
  onConnectedChange,
}: ConnectionProps & {
  title: string
  description: string
  integration: IntegrationInfo
  fields: Array<SettingField>
}) {
  const isConnected = !!connected[integration.id]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <IntegrationItem
          integration={integration}
          connected={isConnected}
          onConnectedChange={(value) => onConnectedChange(integration, value)}
        />
      </CardContent>
      {isConnected && (
        <IntegrationSettings integration={integration} fields={fields} />
      )}
    </Card>
  )
}

function IntegrationSettings({
  integration,
  fields,
}: {
  integration: IntegrationInfo
  fields: Array<SettingField>
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.id, field.defaultValue]))
  )
  const [submitted, setSubmitted] = useState(false)
  const [testing, test] = useSimulatedRequest(1500)

  const missing = fields.filter((field) => !values[field.id].trim())

  function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (missing.length > 0) return
    toast.success(`${integration.name} settings saved`)
  }

  function handleTest() {
    setSubmitted(true)
    if (missing.length > 0) return
    test(() =>
      toast.success("Connection successful", {
        description: `${integration.name} responded normally.`,
      })
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSave}
      className="flex flex-col gap-(--card-spacing)"
    >
      <CardContent>
        <FieldGroup>
          {fields.map((field) => {
            const id = `${integration.id}-${field.id}`
            const invalid = submitted && missing.includes(field)
            const inputProps = {
              id,
              value: values[field.id],
              placeholder: field.placeholder,
              "aria-invalid": invalid,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                setValues((prev) => ({
                  ...prev,
                  [field.id]: event.target.value,
                })),
            }
            return (
              <Field key={field.id} data-invalid={invalid}>
                <FieldLabel htmlFor={id}>{field.label}</FieldLabel>
                {field.secret ? (
                  <SecretInput {...inputProps} />
                ) : (
                  <Input {...inputProps} />
                )}
                {invalid && <FieldError>{field.label} is required.</FieldError>}
              </Field>
            )
          })}
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        <Button type="submit">
          <SaveIcon data-icon="inline-start" />
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={testing}
          onClick={handleTest}
        >
          {testing ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <PlugZapIcon data-icon="inline-start" />
          )}
          {testing ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </form>
  )
}
