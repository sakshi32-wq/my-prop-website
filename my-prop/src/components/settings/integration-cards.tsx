import { useState } from "react"
import { PlugZapIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { IntegrationItem } from "./integration-item"
import { SecretInput } from "./secret-input"
import type {
  Integration,
  IntegrationId,
  IntegrationInfo,
} from "./integrations-data"
import {
  useTestIntegration,
  useUpdateIntegration,
} from "@/api/generated/integrations/integrations"
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
  /** Server state per integration, from listIntegrations. */
  states: Partial<Record<IntegrationId, Integration>>
}

/** A card listing one or more integrations that can be connected. */
export function IntegrationListCard({
  title,
  description,
  integrations,
  states,
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
              state={states[integration.id]}
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
  secret?: boolean
  placeholder?: string
}

/** A single integration with settings that show once it is connected. */
export function ConfigurableIntegrationCard({
  title,
  description,
  integration,
  fields,
  states,
}: ConnectionProps & {
  title: string
  description: string
  integration: IntegrationInfo
  fields: Array<SettingField>
}) {
  const state = states[integration.id]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <IntegrationItem integration={integration} state={state} />
      </CardContent>
      {state?.connected && (
        <IntegrationSettings
          integration={integration}
          fields={fields}
          saved={state.settings}
        />
      )}
    </Card>
  )
}

function IntegrationSettings({
  integration,
  fields,
  saved,
}: {
  integration: IntegrationInfo
  fields: Array<SettingField>
  saved: Record<string, string>
}) {
  const integrationId = integration.id
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.id, saved[field.id] ?? ""]))
  )
  const [submitted, setSubmitted] = useState(false)
  const save = useUpdateIntegration({
    mutation: {
      onSuccess: () => toast.success(`${integration.name} settings saved`),
    },
  })
  const test = useTestIntegration({
    mutation: {
      onSuccess: (result) =>
        toast.success(result.message, {
          description: `${integration.name} responded normally.`,
        }),
    },
  })

  const missing = fields.filter((field) => !values[field.id].trim())

  function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (missing.length > 0) return
    save.mutate({ integrationId, data: { settings: values } })
  }

  function handleTest() {
    setSubmitted(true)
    if (missing.length > 0) return
    test.mutate({ integrationId })
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
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <SaveIcon data-icon="inline-start" />
          )}
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={test.isPending}
          onClick={handleTest}
        >
          {test.isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <PlugZapIcon data-icon="inline-start" />
          )}
          {test.isPending ? "Testing..." : "Test Connection"}
        </Button>
      </CardFooter>
    </form>
  )
}
